import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import {
  RelatedTaskType,
  Task,
  TaskDisplayType,
  TaskEditType,
  TaskIndicatorType,
} from "@/types/TaskTypes";
import {
  createQueryString,
  generateDefaultResources,
  generateMinusId,
} from "@/utils/utils";
import { format } from "date-fns";
import { taskApi } from "@/api/taskApi";
import { useCalendarStore } from "./CalendarStore";
import { useGlobalStore } from "./index";
import {
  generateTaskCreateBody,
  generateTaskForDisplay,
} from "@/utils/TaskUtils";

type TaskIndicatorKey = keyof TaskIndicatorType;

export const useTaskStore = defineStore("task", () => {
  const tasks = ref<TaskDisplayType[]>([]);
  const calendarStore = useCalendarStore();
  const globalStore = useGlobalStore();
  const archiveModalDispay = ref(false);
  const selectedTask = ref<TaskEditType>(null);
  const selectedTaskTemplate = ref(null);
  const selectedOrderDetails = ref(null);
  function setArchiveModalDispay(display: boolean) {
    archiveModalDispay.value = display;
  }
  const taskIndicatorDisplay = reactive<TaskIndicatorType>({
    tittle: true,
    customer: true,
    time: true,
    employee: true,
    vehicle: true,
    devices: true,
  });
  function setSelectedTask(task: TaskEditType | null) {
    if (!task) {
      selectedTask.value.relatedTasks.forEach((relatedTask) => {
        if (relatedTask.details.id && relatedTask.details.id < 0) {
          tasks.value = tasks.value.filter(
            (task) => task.id != relatedTask.details.id
          );
        }
      });
    }
    selectedTask.value = task;
  }
  function setTaskTemplate(taskTemplateId: number) {
    const taskTemplate = calendarStore.defaultData.taskTemplates.find(
      (template) => {
        if (template.id == taskTemplateId) {
          return template;
        }
      }
    );
    selectedTaskTemplate.value = taskTemplate;
  }
  function setOrderDetails(orderId: number) {
    const orderDetail = calendarStore.defaultData.orders.find((order) => {
      if (order.id == orderId) {
        return order;
      }
    });
    selectedOrderDetails.value = orderDetail;
  }
  function setTaskIndicatorDisplay(
    displayName: TaskIndicatorKey,
    value: boolean
  ) {
    taskIndicatorDisplay[displayName] = value;
  }
  function addResource(taskId: number, type: string) {
    let updatedTask = tasks.value.find((task) => {
      if (task.id == taskId) {
        return task;
      }
    });
    if (!updatedTask) {
      return;
    }
    const task = selectedTask.value.relatedTasks.find(
      (task) => task.details.id == taskId
    );
    if (!task) {
      return;
    }
    task.mappedResources.push({
      id: task.mappedResources.length + 1,
      resourcesId: null,
      name: type,
      number: null,
      type: type,
      count: 0,
      status: "open",
    });
    switch (type) {
      case "Employee":
        updatedTask.allEmployeeCount = Number(updatedTask.allEmployeeCount) + 1;
        task.details.employees = updatedTask.allEmployeeCount;
        break;
      case "Vehicle":
        updatedTask.allVehicleCount = Number(updatedTask.allVehicleCount) + 1;
        task.details.vehicle = updatedTask.allVehicleCount;
        break;

      default:
        updatedTask.allDeviceCount = Number(updatedTask.allDeviceCount) + 1;
        task.details.devices = updatedTask.allDeviceCount;
        break;
    }
  }
  function addAssignedResource(taskId: number, type: string) {
    let updatedTask = tasks.value.find((task) => {
      if (task.id == taskId) {
        return task;
      }
    });
    if (!updatedTask) {
      return;
    }
    switch (type) {
      case "Employee":
        updatedTask.employeeCount = Number(updatedTask.employeeCount) + 1;
        break;
      case "Vehicle":
        updatedTask.vehicleCount = Number(updatedTask.vehicleCount) + 1;
        break;

      default:
        updatedTask.deviceCount = Number(updatedTask.deviceCount) + 1;
        break;
    }
  }
  function addResourcesId(taskId: number, resourceId: number, type: string) {
    const task = selectedTask.value.relatedTasks.find(
      (task) => task.details.id == taskId
    );
    if (task) {
      switch (type) {
        case "Employee":
          if (task.details.employeesIds) {
            task.details.employeesIds.push(resourceId);
          } else {
            task.details.employeesIds = [resourceId];
          }
          break;
        case "Vehicle":
          if (task.details.vehiclesIds) {
            task.details.vehicelesIds.push(resourceId);
          } else {
            task.details.vehicelesIds = [resourceId];
          }
          task.details.vehicle_count = task.details.vehicelesIds.length;
          break;

        default:
          if (task.details.devicesIds) {
            task.details.devicesIds.push(resourceId);
          } else {
            task.details.devicesIds = [resourceId];
          }
          break;
      }
    }
  }
  function removeRelatedTasks() {
    // Remove Added realated resource before
    selectedTask.value.relatedTasks.forEach((relatedTask, index) => {
      if (
        index > 0 &&
        relatedTask.id &&
        relatedTask.id.toString().length > 12
      ) {
        tasks.value = tasks.value.filter((task) => task.id != relatedTask.id);
      }
    });

    selectedTask.value.relatedTasks.length = 1;
  }
  function addRelatedDate(dateTime) {
    const id = generateMinusId();
    selectedTask.value.relatedTasks.push({
      id,
      date: dateTime.startDate,
      startTime: dateTime.startTime,
      endTime: dateTime.endTime,
      taskTemplate: {
        id,
        employees_count: selectedTask.value.taskTemplate.employees_count,
        employees: selectedTask.value.taskTemplate.employees,
        vehicle_count: selectedTask.value.taskTemplate.vehicle_count,
        vehicle: selectedTask.value.taskTemplate.vehicle,
        devices_count: selectedTask.value.taskTemplate.devices_count,
        devices: selectedTask.value.taskTemplate.devices,
        startTime: dateTime.startTime,
        endTime: dateTime.endTime,
        color: selectedTask.value.taskTemplate.color,
      },
      orderDetails: {
        latitude: "",
        longitude: "",
        id: selectedTask.value.orderDetails.id,
        orderNumber: selectedTask.value.orderDetails.orderNumber,
        customerName:
          selectedTask.value.orderDetails.customerName || "No Customer",
      },
      otherDetails: {
        requiredSkills: "",
        dress: "",
        language: "",
        teamLeadDescription: "",
        teamLeadContactPerson: "",
        notificationTemplate: "",
      },
      resources: {
        devices: [],
        users: [],
        vehicles: [],
      },
      mappedResources: generateDefaultResources(
        {
          devices: [],
          users: [],
          vehicles: [],
        },
        {
          employees: selectedTask.value.taskTemplate.employees,
          vehicle: selectedTask.value.taskTemplate.vehicle,
          devices: selectedTask.value.taskTemplate.devices,
        }
      ),
    });
    const tempTask = {
      id,
      title: selectedTask.value.title,
      startTime: dateTime.startTime,
      endTime: dateTime.endTime,
      description: selectedTask.value.description,
      date: dateTime.startDate,
      color: "#f00",
      deviceCount: selectedTask.value.taskTemplate.devices_count || 0,
      allDeviceCount: selectedTask.value.taskTemplate.devices || 0,
      employeeCount: selectedTask.value.taskTemplate.employees_count || 0,
      allEmployeeCount: selectedTask.value.taskTemplate.employees || 0,
      vehicleCount: selectedTask.value.taskTemplate.vehicle_count || 0,
      allVehicleCount: selectedTask.value.taskTemplate.vehicle || 0,
      orderId: selectedTask.value.orderDetails.id,
      users: selectedTask.value.users,
      address: selectedTask.value.taskTemplate.location,
      customer: selectedTask.value.orderDetails.customerName || "No Customer",
    };
    addTask(tempTask);
  }
  async function addRelatedResources(id, singleTask, dateTime) {
    selectedTask.value.relatedTasks.push({
      date: dateTime.startDate,
      startTime: dateTime.startTime,
      endTime: dateTime.endTime,
      taskTemplate: {
        id: -1,
        employees_count: selectedTask.value.taskTemplate.employees_count,
        employees: selectedTask.value.taskTemplate.employees,
        vehicle_count: selectedTask.value.taskTemplate.vehicle_count,
        vehicle: selectedTask.value.taskTemplate.vehicle,
        devices_count: selectedTask.value.taskTemplate.devices_count,
        devices: selectedTask.value.taskTemplate.devices,
        startTime: dateTime.startTime,
        endTime: dateTime.endTime,
        color: selectedTask.value.taskTemplate.color,
      },
      orderDetails: {
        latitude: "",
        longitude: "",
        id: selectedTask.value.orderDetails.id,
        orderNumber: selectedTask.value.orderDetails.orderNumber,
        customerName:
          selectedTask.value.orderDetails.customerName || "No Customer",
      },
      otherDetails: {
        requiredSkills: "",
        dress: "",
        language: "",
        teamLeadDescription: "",
        teamLeadContactPerson: "",
        notificationTemplate: "",
      },
      resources: {
        devices: [],
        users: [],
        vehicles: [],
      },
      mappedResources: generateDefaultResources(
        {
          devices: [],
          users: [],
          vehicles: [],
        },
        {
          employees: selectedTask.value.taskTemplate.employees,
          vehicle: selectedTask.value.taskTemplate.vehicle,
          devices: selectedTask.value.taskTemplate.devices,
        }
      ),
    });
    const savedTaskId = await updateTask(id, singleTask);
    const newTask = {
      id: savedTaskId,
      title: singleTask.taskTemplate.title,
      startTime: dateTime.startTime,
      endTime: dateTime.endTime,
      description: singleTask.taskTemplate.description,
      date: dateTime.startDate,
      color: singleTask.color,
      deviceCount: singleTask.taskTemplate.devices_count,
      allDeviceCount: singleTask.taskTemplate.devices,
      employeeCount: singleTask.taskTemplate.employees_count,
      allEmployeeCount: singleTask.taskTemplate.employees,
      vehicleCount: singleTask.taskTemplate.vehicle_count,
      allVehicleCount: singleTask.taskTemplate.vehicle,
      orderId: singleTask.orderDetails.id,
      users: singleTask.users,
      address: singleTask.address,
      customer: singleTask.customer
        ? singleTask.customer.customer_name || "No Customer"
        : "No Customer",
    };
    addTask(newTask);
  }
  function createTask() {
    globalStore.setLoadingApi(true);
    const onSuccess = async (res) => {
      const newTasks = [];
      selectedTask.value.relatedTasks.forEach((item, index) => {
        const newTask: TaskDisplayType = {
          id: res.task_ids[index],
          title: item.details.title,
          description: item.details.description,
          date: item.details.date,
          color: item.details.color || "#e5e7eb",
          deviceCount: item.details.devicesCount,
          allDeviceCount: item.details.allDevicesCount,
          employeeCount: item.details.employeesCount,
          allEmployeeCount: item.details.allEmployeesCount,
          vehicleCount: item.details.vehiclesCount,
          allVehicleCount: item.details.allVehiclesCount,
          startTime: item.details.startTime,
          endTime: item.details.endTime,
          customer: item.details.customerName || "No Customer",
          orderId: item.details.orderId,
          users: item.details.users,
          address: item.details.location,
        };
        newTasks.push(newTask);
      });
      setSelectedTask(null);

      tasks.value = [...tasks.value, ...newTasks];
      globalStore.setLoadingApi(false);
    };
    taskApi.create(
      generateTaskCreateBody(
        selectedTask,
        selectedTaskTemplate,
        selectedOrderDetails
      ),
      { onSuccess }
    );
  }
  function addTask(newTask: TaskDisplayType) {
    tasks.value.push(newTask);
  }

  async function updateTask(id: string, taskData: Partial<Task>) {
    globalStore.setLoadingApi(true);
    const mockTask = {
      extra_emp: [],
      id: taskData.taskTemplate.id,
      task_template_value: null,
      order_id: taskData.orderDetails.id,
      rep_task_ids: selectedTask.value.relatedTasks.map((task) => {
        return task.details.id || null;
      }),
      task_title: taskData.title,
      permission: taskData.taskTemplate.permission,
      date_type: "duration",
      duration: "3",
      start_time: taskData.startTime,
      end_time: taskData.endTime,
      resource_location_category_value:
        taskData.taskTemplate.resource_location_category || null,
      task_description: taskData.description,
      invoice_text: null,
      required_skills: taskData.otherDetails.requiredSkills,
      dress: null,
      color: taskData.taskTemplate.color,
      date: taskData.date,
      previous_date: "2025-05-29",
      is_edit: true,
      location: taskData.taskTemplate.location,
      location_description: taskData.taskTemplate.locationDescription || null,
      latitude: taskData.latitude || null,
      longitude: taskData.longitude || null,
      repetitions: "1",
      teamlead_description: null,
      teamlead_contact_person: null,
      emp_rep: selectedTask.value.relatedTasks.map(
        (task) => task.details.employeesIds || []
      ),
      e_count_rep: selectedTask.value.relatedTasks.map(
        (task) => task.details.employees || 0
      ),
      veh_rep: selectedTask.value.relatedTasks.map(
        (task) => task.details.vehiclesIds || []
      ),
      v_count_rep: selectedTask.value.relatedTasks.map(
        (task) => task.details.vehicle || 0
      ),
      dev_rep: selectedTask.value.relatedTasks.map(
        (task) => task.details.devicesIds || []
      ),
      d_count_rep: selectedTask.value.relatedTasks.map(
        (task) => task.details.devices || 0
      ),
      language: [],
      predecessor: [],
      successor: [],
      predecessor_hour: null,
      successor_hour: null,
      start_date: taskData.date,
      end_date: "2025-06-01",
      repetition_value: 0,
      rates_rep: selectedTask.value.relatedTasks.map((task) => "0.00"),
      base_wage_rep: selectedTask.value.relatedTasks.map((task) => "0.00"),
      plan_start_time_rep: selectedTask.value.relatedTasks.map(
        (task) => task.details.startTime || "00:00"
      ),
      plan_end_time_rep: selectedTask.value.relatedTasks.map(
        (task) => task.details.endTime || "00:00"
      ),
      plan_pause_time_rep: selectedTask.value.relatedTasks.map(
        (task) => "00:00"
      ),
      travel_charges_rep: selectedTask.value.relatedTasks.map((task) => 0),
      is_add_date: true,
      updated_date: selectedTask.value.relatedTasks.map(
        (task) => task.date || taskData.date
      ),
      custom_count_rep: selectedTask.value.relatedTasks.map((task) => 0),
      custom_emp_rep: selectedTask.value.relatedTasks.map((task) => []),
      custom_open_rep: selectedTask.value.relatedTasks.map((task) => []),
      primary_color: "task_template",
      notification_template_id: null,
      task_status: null,
      task_status_id: null,
      end_series: false,
    };
    const onSuccess = () => {
      globalStore.setLoadingApi(false);
      taskData.relatedTasks.forEach((relatedTask) => {
        const oldTask = tasks.value.find((item) => {
          if (item.id == relatedTask.taskTemplate.id) {
            return item;
          }
        });
        if (oldTask) {
          tasks.value = tasks.value.map((task) => {
            if (task.id == id) {
              const updatedTask: Task = {
                id,
                title: oldTask.title,
                description: oldTask.description,
                date: oldTask.date,
                deviceCount: Number(oldTask.taskTemplate.devices_count),
                allDeviceCount: Number(oldTask.taskTemplate.devices),
                employeeCount: Number(oldTask.taskTemplate.employees_count),
                allEmployeeCount: Number(oldTask.taskTemplate.employees),
                vehicleCount: Number(oldTask.taskTemplate.vehicle_count),
                allVehicleCount: Number(oldTask.taskTemplate.vehicle),
                startTime: oldTask.startTime,
                endTime: oldTask.endTime,
                orderId: oldTask.orderDetails.id,
                color: oldTask.taskTemplate.color || "#e5e7eb",
              };
              return {
                ...task,
                ...updatedTask,
              };
            }
            return task;
          });
        } else {
          tasks.value = [
            ...tasks.value,
            {
              id,
              title: relatedTask.title,
              description: relatedTask.description,
              date: taskData.date,
              deviceCount: Number(relatedTask.taskTemplate.devices_count),
              allDeviceCount: Number(relatedTask.taskTemplate.devices),
              employeeCount: Number(relatedTask.taskTemplate.employees_count),
              allEmployeeCount: Number(relatedTask.taskTemplate.employees),
              vehicleCount: Number(relatedTask.taskTemplate.vehicle_count),
              allVehicleCount: Number(relatedTask.taskTemplate.vehicle),
              startTime: relatedTask.startTime,
              endTime: relatedTask.endTime,
              orderId: relatedTask.orderDetails
                ? relatedTask.orderDetails.id
                : null,
              color: relatedTask.taskTemplate.color || "#e5e7eb",
            },
          ];
        }
      });
      saveTasks();
    };
    const res = await taskApi.updateOne(mockTask, { onSuccess });
    return res.task_ids[0];
  }

  function deleteTask(id: string, type: string) {
    globalStore.setLoadingApi(true);
    const onSuccess = () => {
      tasks.value = tasks.value.filter((task) => task.id != id);
      saveTasks();
      setArchiveModalDispay(false);
      globalStore.setLoadingApi(false);
      // history.pushState(null, "", "/monthly-view2");
    };
    const onError = () => {
      setArchiveModalDispay(false);
    };
    taskApi.archive(id, type, { onSuccess, onError });
  }
  async function getTask(id: string) {
    globalStore.setLoadingApi(true);
    const res = await taskApi.getOne(id);

    let relatedTasks: RelatedTaskType = res.data.loop_tasks.map((task) => {
      return {
        details: {
          title: task.task.task_title,
          description: task.task.description,
          date: task.task.date,
          startTime: task.task.start_time,
          endTime: task.task.end_time,
          id: task.task.id,
          color: task.task.color || "#e5e7eb",
          employeesCount: Number(task.task.employee_occupied_count),
          allEmployeesCount: Number(task.task.employee_available_count),
          vehiclesCount: Number(task.task.vehicle_occupied_count),
          allVehiclesCount: Number(task.task.vehicle_available_count),
          devicesCount: Number(task.task.device_occupied_count),
          allDevicesCount: Number(task.task.device_available_count),
        },
        resources: task.resource,
        mappedResources: generateDefaultResources(task.resource, {
          employees: task.task.employee_available_count,
          vehicle: task.task.vehicle_available_count,
          devices: task.task.device_occupied_count,
        }),
      };
    });

    globalStore.setLoadingApi(false);
    selectedTask.value = {
      orderDetails: {
        latitude: "",
        longitude: "",
        id: res.data.project.order_id,
        orderNumber: res.data.project.order_number,
        customerName: res.data.project.customer_name || "No Customer",
      },
      otherDetails: {
        requiredSkills: res.data.task.required_skills,
        dress: res.data.task.dress,
        language: res.data.task.language,
        teamLeadDescription: res.data.task.teamlead_description,
        teamLeadContactPerson: res.data.task.contact_person,
        notificationTemplate: res.data.task.notification_template_id,
      },
      details: {
        title: res.data.project.task_title,
        description: res.data.project.description,
        date: res.data.project.date,
        startTime: res.data.project.start_time,
        endTime: res.data.project.end_time,
        color: res.data.project.color || "#e5e7eb",
        id: res.data.task.id,
        employeesCount: Number(res.data.task.employee_occupied_count),
        allEmployeesCount: Number(res.data.task.employee_available_count),
        vehiclesCount: Number(res.data.task.vehicle_occupied_count),
        allVehiclesCount: Number(res.data.task.vehicle_available_count),
        devicesCount: Number(res.data.task.device_occupied_count),
        allDevicesCount: Number(res.data.task.device_available_count),
        permission: res.data.project.permission,
        resourceLocationCategory:
          res.data.project.resource_location_category_value,
        location: res.data.project.location,
        locationDescription: res.data.project.location_description,
        status: res.data.project.task_status,
      },
      activities: {
        comments: res.data.activities.comments,
        histories: res.data.activities.logs,
      },
      resources: res.data.resource,
      attachments: res.data.attachments,
      relatedTasks,
    };
    return selectedTask.value;
  }
  async function continueToCreate(taskData) {
    const id = generateMinusId();
    const newTask: TaskEditType = {
      orderDetails: {
        latitude: selectedOrderDetails.value.latitude,
        longitude: selectedOrderDetails.value.longitude,
        id: selectedOrderDetails.value.id,
        orderNumber: selectedOrderDetails.value.order_number,
        customerName: selectedOrderDetails.value.customer_name || "No Customer",
      },
      otherDetails: {
        requiredSkills: selectedTaskTemplate.value.required_skills || "",
        dress: selectedTaskTemplate.value.dress || "",
        language: selectedTaskTemplate.value.language || [],
        teamLeadDescription:
          selectedTaskTemplate.value.teamlead_description || "",
        teamLeadContactPerson:
          selectedTaskTemplate.value.teamlead_contact_person || "",
        notificationTemplate:
          selectedTaskTemplate.value.notification_template_id || "",
      },
      details: {
        title: selectedTaskTemplate.value.task_title,
        description: selectedTaskTemplate.value.task_description,
        date: taskData.date,
        startTime: "00:00",
        endTime: "00:00",
        color: selectedTaskTemplate.value.color || "#e5e7eb",
        id,
        employeesCount: Number(selectedTaskTemplate.value.employees) || 0,
        allEmployeesCount:
          Number(selectedTaskTemplate.value.employees_count) || 0,
        vehiclesCount: Number(selectedTaskTemplate.value.vehicle) || 0,
        allVehiclesCount: Number(selectedTaskTemplate.value.vehicle_count) || 0,
        devicesCount: Number(selectedTaskTemplate.value.devices) || 0,
        allDevicesCount: Number(selectedTaskTemplate.value.devices_count) || 0,
        permission: selectedTaskTemplate.value.permission || "",
        resourceLocationCategory:
          selectedTaskTemplate.value.resource_location_category_value || "",
        location: selectedTaskTemplate.value.location || "",
        locationDescription:
          selectedTaskTemplate.value.location_description || "",
        status: "",
        endDate: "",
        employeesIds: [],
        vehiclesIds: [],
        devicesIds: [],
        updateTasks: "",
      },
      activities: {
        comments: [],
        histories: [],
      },
      resources: {
        devices: [],
        users: [],
        vehicles: [],
      },
      mappedResources: generateDefaultResources(
        {
          devices: [],
          users: [],
          vehicles: [],
        },
        {
          employees: Number(selectedTaskTemplate.value.employees_count) || 0,
          vehicle: Number(selectedTaskTemplate.value.vehicle_count) || 0,
          devices: Number(selectedTaskTemplate.value.devices_count) || 0,
        }
      ),
      attachments: [],
      relatedTasks: [
        {
          details: {
            title: selectedTaskTemplate.value.task_title,
            description: selectedTaskTemplate.value.task_description,
            date: taskData.date,
            startTime: "00:00",
            endTime: "00:00",
            color: selectedTaskTemplate.value.color || "#e5e7eb",
            id,
            employeesCount: Number(selectedTaskTemplate.value.employees) || 0,
            allEmployeesCount:
              Number(selectedTaskTemplate.value.employees_count) || 0,
            vehiclesCount: Number(selectedTaskTemplate.value.vehicle) || 0,
            allVehiclesCount:
              Number(selectedTaskTemplate.value.vehicle_count) || 0,
            devicesCount: Number(selectedTaskTemplate.value.devices) || 0,
            allDevicesCount:
              Number(selectedTaskTemplate.value.devices_count) || 0,
            permission: selectedTaskTemplate.value.permission || "",
            resourceLocationCategory:
              selectedTaskTemplate.value.resource_location_category_value || "",
            location: selectedTaskTemplate.value.location || "",
            locationDescription:
              selectedTaskTemplate.value.location_description || "",
            status: "",
            endDate: "",
            customerName: selectedOrderDetails.value.customer_name,
            users: [],
            orderId: selectedOrderDetails.value.id,
          },
          resources: {
            devices: [],
            users: [],
            vehicles: [],
          },
          mappedResources: generateDefaultResources(
            {
              devices: [],
              users: [],
              vehicles: [],
            },
            {
              employees:
                Number(selectedTaskTemplate.value.employees_count) || 0,
              vehicle: Number(selectedTaskTemplate.value.vehicle_count) || 0,
              devices: Number(selectedTaskTemplate.value.devices_count) || 0,
            }
          ),
        },
      ],
    };
    const tempTask: TaskDisplayType = {
      id,
      title: selectedTaskTemplate.value.task_title,
      description: selectedTaskTemplate.value.task_description,
      startTime: "00:00",
      endTime: "00:00",
      date: taskData.date,
      color: "#f00",
      employeeCount: Number(selectedTaskTemplate.value.employees) || 0,
      allEmployeeCount: Number(selectedTaskTemplate.value.employees_count) || 0,
      vehicleCount: Number(selectedTaskTemplate.value.vehicle) || 0,
      allVehicleCount: Number(selectedTaskTemplate.value.vehicle_count) || 0,
      deviceCount: Number(selectedTaskTemplate.value.devices) || 0,
      allDeviceCount: Number(selectedTaskTemplate.value.devices_count) || 0,
      orderId: selectedOrderDetails.value.id,
      users: "",
      address: selectedTaskTemplate.value.location,
      customer: selectedOrderDetails.value.customer_name || "No Customer",
    };
    addTask(tempTask);
    setSelectedTask(newTask);
  }

  function loadTasks(props: any = null) {
    try {
      globalStore.setLoadingApi(true);
      getTasksPerPage(props);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }

  function getTasksPerPage(props: any) {
    if (!props) return;
    if (!props.page) {
      props.page = 1;
    }
    const onSuccess = (response) => {
      const parsedTasks = response.data;
      if (Array.isArray(parsedTasks)) {
        const tasksData: Array<TaskDisplayType> = [];
        parsedTasks.forEach((task) => {
          // Check Duplicated Task
          if (!tasks.value.some((item) => item.id === task.id)) {
            tasksData.push(generateTaskForDisplay(task));
          }
        });
        tasks.value = [...tasks.value, ...tasksData];
      }

      if (props.page < response.meta.last_page) {
        props.page++;
        getTasksPerPage(props);
      } else {
        globalStore.setLoadingApi(false);
      }
    };
    const queryString: string = createQueryString(props);
    taskApi.getAll(queryString, { onSuccess });
  }
  function saveTasks() {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks.value));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }
  // Load tasks initially
  // loadTasks();

  // Watch for changes and save to localStorage
  watch(
    () => tasks.value,
    () => {
      saveTasks();
    },
    { deep: true, immediate: true }
  );

  return {
    tasks,
    taskIndicatorDisplay,
    archiveModalDispay,
    selectedTask,
    setSelectedTask,
    setArchiveModalDispay,
    setTaskIndicatorDisplay,
    addTask,
    createTask,
    updateTask,
    addRelatedDate,
    addRelatedResources,
    removeRelatedTasks,
    addResource,
    addResourcesId,
    addAssignedResource,
    deleteTask,
    loadTasks,
    getTask,
    continueToCreate,
    setTaskTemplate,
    setOrderDetails,
  };
});

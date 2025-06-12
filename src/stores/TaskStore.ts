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
import { generateTaskForDisplay } from "@/utils/TaskUtils";

type TaskIndicatorKey = keyof TaskIndicatorType;

export const useTaskStore = defineStore("task", () => {
  const tasks = ref<TaskDisplayType[]>([]);
  const calendarStore = useCalendarStore();
  const globalStore = useGlobalStore();
  const archiveModalDispay = ref(false);
  const selectedTask = ref<TaskEditType>(null);
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
  function setSelectedTask(task: Task | null) {
    if (!task) {
      selectedTask.value.relatedTasks.forEach((relatedTask) => {
        if (relatedTask.id && relatedTask.id < 0) {
          tasks.value = tasks.value.filter((task) => task.id != relatedTask.id);
        }
      });
    }
    selectedTask.value = task;
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
        updatedTask.deviceCout = Number(updatedTask.deviceCout) + 1;
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
      deviceCout: selectedTask.value.taskTemplate.devices_count || 0,
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
      deviceCout: singleTask.taskTemplate.devices_count,
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
  function createTask(taskData: Omit<Task, "id">) {
    globalStore.setLoadingApi(true);
    const mockTask = {
      task_template_value: taskData.title,
      task_template_id: taskData.taskTemplate.id,
      order_id: taskData.orderDetails.id,
      task_title: taskData.title,
      permission: taskData.taskTemplate.permission,
      date_type: "date",
      duration: null,
      start_time: taskData.startTime,
      end_time: taskData.endTime,
      resource_location_category_value:
        taskData.taskTemplate.resource_location_category,
      task_description: taskData.description,
      required_skills: null,
      dress: null,
      color: taskData.taskTemplate.color,
      date: null,
      location: taskData.taskTemplate.location || null,
      location_description: taskData.taskTemplate.locationDescription,
      latitude: taskData.orderDetails.latitude || "",
      longitude: taskData.orderDetails.longitude || "",
      repetitions: selectedTask.value.relatedTasks.length,
      repetitions_date: selectedTask.value.relatedTasks.map(
        (task) => task.date || ""
      ),
      tasks_contact_person: [null],
      teamlead_description: null,
      teamlead_contact_person: null,
      emp: selectedTask.value.relatedTasks.map(
        (task) => task.details.employeesIds || []
      ),
      e_count: selectedTask.value.relatedTasks.map(
        (task) => task.details.employees || 0
      ),
      veh: selectedTask.value.relatedTasks.map(
        (task) => task.details.vehiclesIds || []
      ),
      v_count: selectedTask.value.relatedTasks.map(
        (task) => task.details.vehicle || 0
      ),
      dev_rep: selectedTask.value.relatedTasks.map(
        (task) => task.details.devicesIds || []
      ),
      d_count: selectedTask.value.relatedTasks.map(
        (task) => task.details.devices || 0
      ),
      language: [],
      predecessor: [],
      successor: [],
      predecessor_hour: null,
      successor_hour: null,
      start_date: format(taskData.date, "yyyy-MM-dd"),
      end_date: null,
      input_start_date: format(taskData.date, "yyyy-MM-dd"),
      input_end_date: null,
      rates: [0],
      base_wage: [0],
      plan_start_time: selectedTask.value.relatedTasks.map(
        (task) => task.details.startTime || "00:00"
      ),
      plan_end_time: selectedTask.value.relatedTasks.map(
        (task) => task.details.endTime || "00:00"
      ),
      pause_time: selectedTask.value.relatedTasks.map((task) => "00:00"),
      repeptition_type: 0,
      travel_charges: selectedTask.value.relatedTasks.map((task) => 0),
      is_add_date: true,
      primary_color: "task_template",
      custom_emp: selectedTask.value.relatedTasks.map((task) => []),
      custom_open: selectedTask.value.relatedTasks.map((task) => []),
      task_status: null,
      task_status_id: null,
    };
    const onSuccess = (res) => {
      taskData.relatedTasks.forEach((item, index) => {
        const newTask: Task = {
          id: res.task_ids[index],
          title: item.title,
          description: item.description,
          date: item.date,
          color: item.taskTemplate.color || "#e5e7eb",
          deviceCout: Number(item.taskTemplate.devices_count) || 0,
          allDeviceCount: Number(item.taskTemplate.devices) || 0,
          employeeCount: Number(item.taskTemplate.employees_count) || 0,
          allEmployeeCount: Number(item.taskTemplate.employees) || 0,
          vehicleCount: Number(item.taskTemplate.vehicle_count) || 0,
          allVehicleCount: Number(item.taskTemplate.vehicle) || 0,
          startTime: item.startTime,
          endTime: item.endTime,
          customer: item.orderDetails.customerName || "No Customer",
          orderId: item.orderDetails.id,
          users: item.users,
          address: item.taskTemplate.location,
        };
        addTask(newTask);
      });
      globalStore.setLoadingApi(false);
    };
    taskApi.create(mockTask, { onSuccess });
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
                deviceCout: Number(oldTask.taskTemplate.devices_count),
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
              deviceCout: Number(relatedTask.taskTemplate.devices_count),
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
          date: task.task.date,
          startTime: task.task.start_time,
          endTime: task.task.end_time,
          id: task.task.id,
          employeesCount: task.task.employee_occupied_count,
          allEmployeesCount: task.task.employee_available_count,
          vehiclesCount: task.task.vehicle_occupied_count,
          allVehiclesCount: task.task.vehicle_available_count,
          devicesCount: task.task.device_occupied_count,
          allDevicesCount: task.task.device_available_count,
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
        employeesCount: res.data.task.employee_occupied_count,
        allEmployeesCount: res.data.task.employee_available_count,
        vehiclesCount: res.data.task.vehicle_occupied_count,
        allVehiclesCount: res.data.task.vehicle_available_count,
        devicesCount: res.data.task.device_occupied_count,
        allDevicesCount: res.data.task.device_available_count,
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
  function continueToCreate(taskData) {
    const id = generateMinusId();
    const newTask = {
      id,
      title: taskData.taskTitle,
      description: taskData.description,
      date: taskData.date,
      startTime: "00:00",
      endTime: "00:00",
      orderDetails: {
        latitude: "",
        longitude: "",
        id: taskData.orderDetails.id,
        orderNumber: taskData.orderDetails.orderNumber,
        customerName: taskData.orderDetails.customerName || "No Customer",
      },
      otherDetails: {
        requiredSkills: "",
        dress: "",
        language: "",
        teamLeadDescription: "",
        teamLeadContactPerson: "",
        notificationTemplate: "",
      },
      taskTemplate: { ...taskData.taskTemplate, id },
      activities: [],
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
          employees: taskData.taskTemplate.employees,
          vehicle: taskData.taskTemplate.vehicle,
          devices: taskData.taskTemplate.devices,
        }
      ),
      attachments: [],
      relatedTasks: [
        {
          id,
          title: taskData.taskTitle,
          description: taskData.description,
          date: taskData.date,
          startTime: "00:00",
          endTime: "00:00",
          orderDetails: {
            latitude: "",
            longitude: "",
            id: taskData.orderDetails.id,
            orderNumber: taskData.orderDetails.orderNumber,
            customerName: taskData.orderDetails.customerName || "No Customer",
          },
          otherDetails: {
            requiredSkills: "",
            dress: "",
            language: "",
            teamLeadDescription: "",
            teamLeadContactPerson: "",
            notificationTemplate: "",
          },
          taskTemplate: { ...taskData.taskTemplate, id },
          activities: [],
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
              employees: taskData.taskTemplate.employees,
              vehicle: taskData.taskTemplate.vehicle,
              devices: taskData.taskTemplate.devices,
            }
          ),
          attachments: [],
        },
      ],
    };
    const tempTask: TaskDisplayType = {
      id,
      title: taskData.taskTitle,
      startTime: taskData.startTime,
      endTime: taskData.endTime,
      description: taskData.description,
      date: taskData.date,
      // color: taskData.taskTemplate.color || "#e5e7eb",
      color: "#f00",
      deviceCout: taskData.taskTemplate.devices_count || 0,
      allDeviceCount: taskData.taskTemplate.devices || 0,
      employeeCount: taskData.taskTemplate.employees_count || 0,
      allEmployeeCount: taskData.taskTemplate.employees || 0,
      vehicleCount: taskData.taskTemplate.vehicle_count || 0,
      allVehicleCount: taskData.taskTemplate.vehicle || 0,
      orderId: taskData.orderDetails.id,
      users: taskData.users,
      address: taskData.taskTemplate.location,
      customer: taskData.orderDetails.customerName || "No Customer",
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
  };
});

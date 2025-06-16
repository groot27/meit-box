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
  generateAssignedResources,
  generateTaskCreateBody,
  generateTaskForDisplay,
  generateUpdateTaskBody,
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
        updatedTask.allEmployeesCount =
          Number(updatedTask.allEmployeesCount) + 1;
        task.details.allEmployeesCount = updatedTask.allEmployeesCount;
        break;
      case "Vehicle":
        updatedTask.allVehiclesCount = Number(updatedTask.allVehiclesCount) + 1;
        task.details.allVehiclesCount = updatedTask.allVehiclesCount;
        break;

      default:
        updatedTask.allDevicesCount = Number(updatedTask.allDevicesCount) + 1;
        task.details.allDevicesCount = updatedTask.allDevicesCount;
        break;
    }
  }
  function addAssignedResource(taskId: number, type: string, rowIndex: number) {
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
    const resource = task.mappedResources.find((item) => (item.id = rowIndex));

    switch (type) {
      case "Employee":
        updatedTask.employeesCount = Number(updatedTask.employeesCount) + 1;
        task.details.employeesCount = updatedTask.employeesCount;
        resource.status = "confirmed";
        task;
        break;
      case "Vehicle":
        updatedTask.vehiclesCount = Number(updatedTask.vehiclesCount) + 1;
        task.details.vehiclesCount = updatedTask.vehiclesCount;
        resource.status = "planned";
        break;

      default:
        updatedTask.devicesCount = Number(updatedTask.devicesCount) + 1;
        task.details.devicesCount = updatedTask.devicesCount;
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
      details: {
        title: selectedTask.value.details.title,
        description: selectedTask.value.details.description,
        date: dateTime.startDate,
        startTime: dateTime.startTime,
        endTime: dateTime.endTime,
        id,
        color: selectedTask.value.details.color || "#e5e7eb",
        employeesCount: selectedTask.value.details.employeesCount,
        allEmployeesCount: selectedTask.value.details.allEmployeesCount,
        vehiclesCount: selectedTask.value.details.vehiclesCount,
        allVehiclesCount: selectedTask.value.details.allVehiclesCount,
        devicesCount: selectedTask.value.details.devicesCount,
        allDevicesCount: selectedTask.value.details.allDevicesCount,
        customer: selectedTask.value.orderDetails.customerName || "No Customer",
        orderId: selectedTask.value.orderDetails.id,
      },
      resources: selectedTask.value.resources,
      mappedResources: generateDefaultResources(selectedTask.value.resources, {
        employees: selectedTask.value.details.allEmployeesCount,
        vehicle: selectedTask.value.details.allVehiclesCount,
        devices: selectedTask.value.details.allDevicesCount,
      }),
    });
    const tempTask = {
      id,
      title: selectedTask.value.title,
      startTime: dateTime.startTime,
      endTime: dateTime.endTime,
      description: selectedTask.value.description,
      date: dateTime.startDate,
      color: "#f00",
      devicesCount: selectedTask.value.details.devicesCount,
      allDevicesCount: selectedTask.value.details.allDevicesCount,
      employeesCount: selectedTask.value.details.employeesCount,
      allEmployeesCount: selectedTask.value.details.allEmployeesCount,
      vehiclesCount: selectedTask.value.details.vehiclesCount,
      allVehiclesCount: selectedTask.value.details.allVehiclesCount,
      orderId: selectedTask.value.orderDetails.id,
      users: selectedTask.value.resources.users || [],
      address: selectedTask.value.taskTemplate.location,
      customer: selectedTask.value.orderDetails.customerName || "No Customer",
    };
    addTask(tempTask);
  }
  async function addRelatedResources(id, singleTask, dateTime) {
    selectedTask.value.relatedTasks.push({
      details: {
        title: selectedTask.value.details.title,
        description: selectedTask.value.details.description,
        date: dateTime.startDate,
        startTime: dateTime.startTime,
        endTime: dateTime.endTime,
        id,
        color: selectedTask.value.details.color || "#e5e7eb",
        employeesCount: selectedTask.value.details.employeesCount,
        allEmployeesCount: selectedTask.value.details.allEmployeesCount,
        vehiclesCount: selectedTask.value.details.vehiclesCount,
        allVehiclesCount: selectedTask.value.details.allVehiclesCount,
        devicesCount: selectedTask.value.details.devicesCount,
        allDevicesCount: selectedTask.value.details.allDevicesCount,
        customer: selectedTask.value.orderDetails.customerName || "No Customer",
        orderId: selectedTask.value.orderDetails.id,
      },
      resources: selectedTask.value.resources,
      mappedResources: generateDefaultResources(selectedTask.value.resources, {
        employees: selectedTask.value.details.allEmployeesCount,
        vehicle: selectedTask.value.details.allVehiclesCount,
        devices: selectedTask.value.details.allDevicesCount,
      }),
    });
    updateTask(id);
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
          devicesCount: item.details.devicesCount,
          allDevicesCount: item.details.allDevicesCount,
          employeesCount: item.details.employeesCount,
          allEmployeesCount: item.details.allEmployeesCount,
          vehiclesCount: item.details.vehiclesCount,
          allVehiclesCount: item.details.allVehiclesCount,
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

  async function updateTask(id: number) {
    globalStore.setLoadingApi(true);
    const onSuccess = () => {
      globalStore.setLoadingApi(false);
      selectedTask.value.relatedTasks.forEach((relatedTask) => {
        const oldTask = tasks.value.find((item) => {
          if (item.details.id == relatedTask.details.id) {
            return item;
          }
        });
        // if (oldTask) {
        //   tasks.value = tasks.value.map((task) => {
        //     if (task.id == id) {
        //       const updatedDisplayTask: TaskDisplayType = {
        //         id,
        //         title: oldTask.title,
        //         description: oldTask.description,
        //         date: oldTask.date,
        //         devicesCount: oldTask.details.devicesCount,
        //         allDevicesCount: oldTask.details.allDevicesCount,
        //         employeesCount: oldTask.details.employeesCount,
        //         allEmployeesCount: oldTask.details.allEmployeesCount,
        //         vehiclesCount: oldTask.details.vehiclesCount,
        //         allVehiclesCount: oldTask.details.allVehiclesCount,
        //         startTime: oldTask.details.startTime,
        //         endTime: oldTask.details.endTime,
        //         orderId: oldTask.orderDetails.id,
        //         color: oldTask.details.color || "#e5e7eb",
        //         users: oldTask.users,
        //         address: oldTask.address,
        //         customer: "string",
        //       };
        //       return {
        //         ...task,
        //         ...updatedDisplayTask,
        //       };
        //     }
        //     return task;
        //   });
        // }
        if (!oldTask) {
          tasks.value = [
            ...tasks.value,
            {
              id,
              title: relatedTask.details.title,
              description: relatedTask.details.description,
              date: relatedTask.details.date,
              devicesCount: relatedTask.details.devicesCount,
              allDevicesCount: relatedTask.details.allDevicesCount,
              employeesCount: relatedTask.details.employeesCount,
              allEmployeesCount: relatedTask.details.allEmployeesCount,
              vehiclesCount: relatedTask.details.vehiclesCount,
              allVehiclesCount: relatedTask.details.allVehiclesCount,
              startTime: relatedTask.details.startTime,
              endTime: relatedTask.details.endTime,
              orderId: relatedTask.orderDetails.id,
              color: relatedTask.details.color || "#e5e7eb",
              users: relatedTask.users,
              address: relatedTask.address,
              customer: "string",
            },
          ];
        }
      });
      saveTasks();
    };
    const res = await taskApi.updateOne(generateUpdateTaskBody(selectedTask), {
      onSuccess,
    });
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
    debugger;
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
          customer: task.task.customer_name || "No Customer",
          orderId: task.task.ored_id,
          resourceLocationCategory: task.task.resource_location_category_value,
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
        employeesCount: selectedTaskTemplate.value.employees
          ? selectedTaskTemplate.value.employees.split("+").length
          : 0,
        allEmployeesCount:
          Number(selectedTaskTemplate.value.employees_count) || 0,
        vehiclesCount: selectedTaskTemplate.value.vehicle
          ? selectedTaskTemplate.value.vehicle.split("+").length
          : 0,
        allVehiclesCount: Number(selectedTaskTemplate.value.vehicle_count) || 0,
        devicesCount: selectedTaskTemplate.value.devices
          ? selectedTaskTemplate.value.devices.split("+").length
          : 0,
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
        devices: selectedTaskTemplate.value.devices
          ? generateAssignedResources(
              selectedTaskTemplate.value.devices,
              calendarStore.defaultData.devices
            )
          : [],
        users: selectedTaskTemplate.value.employees
          ? generateAssignedResources(
              selectedTaskTemplate.value.employees,
              calendarStore.defaultData.employees
            )
          : [],
        vehicles: selectedTaskTemplate.value.vehicle
          ? generateAssignedResources(
              selectedTaskTemplate.value.vehicle,
              calendarStore.defaultData.vehicles
            )
          : [],
      },
      mappedResources: generateDefaultResources(
        {
          devices: selectedTaskTemplate.value.devices
            ? generateAssignedResources(
                selectedTaskTemplate.value.devices,
                calendarStore.defaultData.devices
              )
            : [],
          users: selectedTaskTemplate.value.employees
            ? generateAssignedResources(
                selectedTaskTemplate.value.employees,
                calendarStore.defaultData.employees
              )
            : [],
          vehicles: selectedTaskTemplate.value.vehicle
            ? generateAssignedResources(
                selectedTaskTemplate.value.vehicle,
                calendarStore.defaultData.vehicles
              )
            : [],
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
            employeesCount: selectedTaskTemplate.value.employees
              ? selectedTaskTemplate.value.employees.split("+").length
              : 0,
            allEmployeesCount:
              Number(selectedTaskTemplate.value.employees_count) || 0,
            vehiclesCount: selectedTaskTemplate.value.vehicle
              ? selectedTaskTemplate.value.vehicle.split("+").length
              : 0,
            allVehiclesCount:
              Number(selectedTaskTemplate.value.vehicle_count) || 0,
            devicesCount: selectedTaskTemplate.value.devices
              ? selectedTaskTemplate.value.devices.split("+").length
              : 0,
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
            devices: selectedTaskTemplate.value.devices
              ? generateAssignedResources(
                  selectedTaskTemplate.value.devices,
                  calendarStore.defaultData.devices
                )
              : [],
            users: selectedTaskTemplate.value.employees
              ? generateAssignedResources(
                  selectedTaskTemplate.value.employees,
                  calendarStore.defaultData.employees
                )
              : [],
            vehicles: selectedTaskTemplate.value.vehicle
              ? generateAssignedResources(
                  selectedTaskTemplate.value.vehicle,
                  calendarStore.defaultData.vehicles
                )
              : [],
          },
          mappedResources: generateDefaultResources(
            {
              devices: selectedTaskTemplate.value.devices
                ? generateAssignedResources(
                    selectedTaskTemplate.value.devices,
                    calendarStore.defaultData.devices
                  )
                : [],
              users: selectedTaskTemplate.value.employees
                ? generateAssignedResources(
                    selectedTaskTemplate.value.employees,
                    calendarStore.defaultData.employees
                  )
                : [],
              vehicles: selectedTaskTemplate.value.vehicle
                ? generateAssignedResources(
                    selectedTaskTemplate.value.vehicle,
                    calendarStore.defaultData.vehicles
                  )
                : [],
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
      employeesCount: selectedTaskTemplate.value.employees
        ? selectedTaskTemplate.value.employees.split("+").length
        : 0,
      allEmployeesCount:
        Number(selectedTaskTemplate.value.employees_count) || 0,
      vehiclesCount: selectedTaskTemplate.value.vehicle
        ? selectedTaskTemplate.value.vehicle.split("+").length
        : 0,
      allVehiclesCount: Number(selectedTaskTemplate.value.vehicle_count) || 0,
      devicesCount: selectedTaskTemplate.value.devices
        ? selectedTaskTemplate.value.devices.split("+").length
        : 0,
      allDevicesCount: Number(selectedTaskTemplate.value.devices_count) || 0,
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

  function filterRelatedResources(filter: boolean) {
    debugger;
    if (!filter) {
      return selectedTask.value.relatedTasks;
    }
    return selectedTask.value.relatedTasks.filter((task) => {
      if (task.details.date >= selectedTask.value.details.date) {
        return task;
      }
    });
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
    filterRelatedResources,
  };
});

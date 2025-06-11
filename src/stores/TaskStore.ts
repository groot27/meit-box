import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import { Task, TaskActivity, TaskIndicatorType } from "@/types/TaskTypes";
import {
  createQueryString,
  generateDefaultResources,
  v4 as uuidv4,
} from "@/utils/utils";
import { format, parseISO, setHours, setMinutes } from "date-fns";
import { taskApi } from "@/api/taskApi";
import { useCalendarStore } from "./CalendarStore";
import { useGlobalStore } from "./index";
import { useRouter } from "vue-router";
import ResourcesTab from "@/components/calendar/task/edit/ResourcesTab.vue";

type TaskIndicatorKey = keyof TaskIndicatorType;

export const useTaskStore = defineStore("task", () => {
  const tasks = ref<Task[]>([]);
  const calendarStore = useCalendarStore();
  const globalStore = useGlobalStore();
  const archiveModalDispay = ref(false);
  const selectedTask = ref<Task>(null);
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
    selectedTask.value = task;
  }
  function setTaskIndicatorDisplay(
    displayName: TaskIndicatorKey,
    value: boolean
  ) {
    taskIndicatorDisplay[displayName] = value;
  }
  function addResource(taskId: number, type: string) {
    const updatedTask = tasks.value.find((task) => {
      if (task.id == taskId) {
        return task;
      }
    });
    if (!updatedTask) {
      return;
    }
    const task = selectedTask.value.relatedTasks.find(
      (task) => task.taskTemplate.id == taskId
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
        updatedTask.allEmployeeCount += 1;
        task.taskTemplate.employees = updatedTask.allEmployeeCount;
        break;
      case "Vehicle":
        updatedTask.allVehicleCount += 1;
        task.taskTemplate.vehicle = updatedTask.allVehicleCount;
        break;

      default:
        updatedTask.allDeviceCount += 1;
        task.taskTemplate.devices = updatedTask.allDeviceCount;
        break;
    }
  }
  function addAssignedResource(taskId: number, type: string) {
    const updatedTask = tasks.value.find((task) => {
      if (task.id == taskId) {
        return task;
      }
    });
    if (!updatedTask) {
      return;
    }
    switch (type) {
      case "Employee":
        updatedTask.employeeCount += 1;
        break;
      case "Vehicle":
        updatedTask.vehicleCount += 1;
        break;

      default:
        updatedTask.deviceCout += 1;
        break;
    }
  }
  function addResourcesId(taskId: number, resourceId: number, type: string) {
    const task = selectedTask.value.relatedTasks.find(
      (task) => task.taskTemplate.id == taskId
    );
    if (task) {
      switch (type) {
        case "Employee":
          if (task.taskTemplate.employeesIds) {
            task.taskTemplate.employeesIds.push(resourceId);
          } else {
            task.taskTemplate.employeesIds = [resourceId];
          }
          break;
        case "Vehicle":
          if (task.taskTemplate.vehiclesIds) {
            task.taskTemplate.vehicelesIds.push(resourceId);
          } else {
            task.taskTemplate.vehicelesIds = [resourceId];
          }
          task.taskTemplate.vehicle_count =
            task.taskTemplate.vehicelesIds.length;
          break;

        default:
          if (task.taskTemplate.devicesIds) {
            task.taskTemplate.devicesIds.push(resourceId);
          } else {
            task.taskTemplate.devicesIds = [resourceId];
          }
          break;
      }
    }
  }
  async function addRelatedDate(id, singleTask, dateTime) {
    selectedTask.value.relatedTasks.push({
      date: dateTime.startDate,
      startTime: dateTime.startTime,
      endTime: dateTime.endTime,
      taskTemplate: {
        id: -1,
        employees_count:
          selectedTask.value.taskTemplate.employee_occupied_count,
        employees: selectedTask.value.taskTemplate.employee_available_count,
        vehicle_count: selectedTask.value.taskTemplate.vehicle_occupied_count,
        vehicle: selectedTask.value.taskTemplate.vehicle_available_count,
        devices_count: selectedTask.value.taskTemplate.device_occupied_count,
        devices: selectedTask.value.taskTemplate.device_available_count,
        startTime: dateTime.startTime,
        endTime: dateTime.endTime,
      },
      resources: [],
      mappedResources: [],
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
      start_time: null,
      end_time: null,
      resource_location_category_value: null,
      task_description: taskData.description,
      required_skills: null,
      dress: null,
      color: taskData.taskTemplate.color,
      date: null,
      location: null,
      latitude: taskData.orderDetails.latitude || "",
      longitude: taskData.orderDetails.longitude || "",
      repetitions: 1,
      repetitions_date: ["2025-04-29"],
      tasks_contact_person: [null],
      teamlead_description: null,
      teamlead_contact_person: null,
      emp: [[taskData.taskTemplate.employees_count || ""]],
      e_count: [taskData.taskTemplate.employees || 0],
      veh: [[taskData.taskTemplate.vehicle_count || ""]],
      v_count: [taskData.taskTemplate.vehicle || 0],
      dev: [[taskData.taskTemplate.devices_count || ""]],
      d_count: [taskData.taskTemplate.devices || 0],
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
      plan_start_time: ["00:00"],
      plan_end_time: ["00:00"],
      pause_time: ["00:00"],
      repeptition_type: 0,
      travel_charges: [0],
      is_add_date: true,
      primary_color: "task_template",
      custom_emp: [[]],
      custom_emp_open: [[]],
      task_status: null,
      task_status_id: null,
    };
    const onSuccess = (res) => {
      const newTask: Task = {
        id: res.task_ids[0],
        title: taskData.title,
        description: taskData.description,
        date: taskData.date,
        color: taskData.color || "#e5e7eb",
        deviceCout: Number(taskData.taskTemplate.devices_count),
        allDeviceCount: Number(taskData.taskTemplate.devices),
        employeeCount: Number(taskData.taskTemplate.employees_count),
        allEmployeeCount: Number(taskData.taskTemplate.employees),
        vehicleCount: Number(taskData.taskTemplate.vehicle_count),
        allVehicleCount: Number(taskData.taskTemplate.vehicle),
      };
      addTask(newTask);
      globalStore.setLoadingApi(false);
    };
    taskApi.create(mockTask, { onSuccess });
  }
  function addTask(newTask: Task) {
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
        return task.taskTemplate.id || null;
      }),
      task_title: taskData.title,
      permission: taskData.taskTemplate.permission,
      date_type: "duration",
      duration: "3",
      start_time: taskData.startTime,
      end_time: taskData.endTime,
      resource_location_category_value: taskData.location,
      task_description: taskData.description,
      invoice_text: null,
      required_skills: taskData.otherDetails.requiredSkills,
      dress: null,
      color: taskData.taskTemplate.color,
      date: taskData.date,
      previous_date: "2025-05-29",
      is_edit: true,
      location: taskData.location,
      latitude: taskData.latitude || null,
      longitude: taskData.longitude || null,
      repetitions: "1",
      teamlead_description: null,
      teamlead_contact_person: null,
      emp_rep: selectedTask.value.relatedTasks.map(
        (task) => task.taskTemplate.employeesIds || []
      ),
      e_count_rep: selectedTask.value.relatedTasks.map(
        (task) => task.taskTemplate.employees || 0
      ),
      veh_rep: selectedTask.value.relatedTasks.map(
        (task) => task.taskTemplate.vehiclesIds || []
      ),
      v_count_rep: selectedTask.value.relatedTasks.map(
        (task) => task.taskTemplate.vehicle || 0
      ),
      dev_rep: selectedTask.value.relatedTasks.map(
        (task) => task.taskTemplate.devicesIds || []
      ),
      d_count_rep: selectedTask.value.relatedTasks.map(
        (task) => task.taskTemplate.devices || 0
      ),
      language: [],
      predecessor: [],
      successor: [],
      predecessor_hour: null,
      successor_hour: null,
      start_date: taskData.startDate,
      end_date: "2025-06-01",
      repetition_value: 0,
      rates_rep: selectedTask.value.relatedTasks.map((task) => "0.00"),
      base_wage_rep: selectedTask.value.relatedTasks.map((task) => "0.00"),
      plan_start_time_rep: selectedTask.value.relatedTasks.map(
        (task) => task.taskTemplate.startTime || "00:00"
      ),
      plan_end_time_rep: selectedTask.value.relatedTasks.map(
        (task) => task.taskTemplate.endTime || "00:00"
      ),
      plan_pause_time_rep: selectedTask.value.relatedTasks.map(
        (task) => "00:00"
      ),
      travel_charges_rep: selectedTask.value.relatedTasks.map((task) => 0),
      is_add_date: true,
      updated_date: selectedTask.value.relatedTasks.map((task) => task.date),
      location_description: null,
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
      tasks.value = tasks.value.map((task) => {
        if (task.id == id) {
          const updatedTask: Task = {
            id,
            title: taskData.title,
            description: taskData.description,
            date: taskData.date,
            deviceCout: Number(taskData.taskTemplate.devices_count),
            allDeviceCount: Number(taskData.taskTemplate.devices),
            employeeCount: Number(taskData.taskTemplate.employees_count),
            allEmployeeCount: Number(taskData.taskTemplate.employees),
            vehicleCount: Number(taskData.taskTemplate.vehicle_count),
            allVehicleCount: Number(taskData.taskTemplate.vehicle),
            startTime: taskData.startTime,
            endTime: taskData.endTime,
            orderId: taskData.orderDetails.id,
          };
          return {
            ...task,
            ...updatedTask,
          };
        }
        return task;
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

    let relatedTasks = res.data.loop_tasks.map((task) => {
      return {
        date: task.task.date,
        startTime: task.task.start_time,
        endTime: task.task.end_time,
        taskTemplate: {
          id: task.task.id,
          employees_count: task.task.employee_occupied_count,
          employees: task.task.employee_available_count,
          vehicle_count: task.task.vehicle_occupied_count,
          vehicle: task.task.vehicle_available_count,
          devices_count: task.task.device_occupied_count,
          devices: task.task.device_available_count,
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
      title: res.data.project.task_title,
      description: res.data.project.description,
      date: res.data.project.date,
      startTime: res.data.project.start_time,
      endTime: res.data.project.end_time,
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
      taskTemplate: {
        color: res.data.project.color || "#e5e7eb",
        id: res.data.task.id,
        description: res.data.project.description,
        employees_count: res.data.task.employee_occupied_count,
        employees: res.data.task.employee_available_count,
        vehicle_count: res.data.task.vehicle_occupied_count,
        vehicle: res.data.task.vehicle_available_count,
        devices_count: res.data.task.device_occupied_count,
        devices: res.data.task.device_available_count,
        permission: res.data.project.permission,
        resource_location_category:
          res.data.project.resource_location_category_value,
        location: res.data.project.location,
      },
      activities: res.data.activities,
      resources: res.data.resource,
      attachments: res.data.attachments,
      relatedTasks,
    };
    return selectedTask.value;
  }
  function continueToCreate(taskData) {
    const newTask = {
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
      taskTemplate: taskData.taskTemplate,
      activities: [],
      resources: [],
      attachments: [],
      relatedTasks: [],
    };
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
        const tasksData: Array<Task> = [];
        parsedTasks.forEach((task) => {
          // Check Duplicated Task
          if (!tasks.value.some((item) => item.id === task.id)) {
            tasksData.push({
              id: task.id,
              title: task.task_title,
              startTime: task.start_time,
              endTime: task.end_time,
              description: task.description,
              date: task.date,
              color: task.color || "#e5e7eb",
              deviceCout: task.device_occupied_count,
              allDeviceCount: task.device_available_count,
              employeeCount: task.employee_occupied_count,
              allEmployeeCount: task.employee_available_count,
              vehicleCount: task.vehicle_occupied_count,
              allVehicleCount: task.vehicle_available_count,
              orderId: task.order_id,
              users: task.users,
              address: task.resource_location_category_value,
              customer: task.customer
                ? task.customer.customer_name || "No Customer"
                : "No Customer",
            } as Task);
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
    addResource,
    addResourcesId,
    addAssignedResource,
    deleteTask,
    loadTasks,
    getTask,
    continueToCreate,
  };
});

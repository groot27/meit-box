import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import { Task, TaskActivity, TaskIndicatorType } from "@/types/TaskTypes";
import { createQueryString, v4 as uuidv4 } from "@/utils/utils";
import { format, parseISO, setHours, setMinutes } from "date-fns";
import { taskApi } from "@/api/taskApi";
import { useCalendarStore } from "./CalendarStore";
import { useGlobalStore } from "./index";
import { useRouter } from "vue-router";

type TaskIndicatorKey = keyof TaskIndicatorType;

export const useTaskStore = defineStore("task", () => {
  const tasks = ref<Task[]>([]);
  const calendarStore = useCalendarStore();
  const globalStore = useGlobalStore();
  const archiveModalDispay = ref(false);
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
  function setTaskIndicatorDisplay(
    displayName: TaskIndicatorKey,
    value: boolean
  ) {
    taskIndicatorDisplay[displayName] = value;
  }

  function addTask(taskData: Omit<Task, "id">) {
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
      start_date: "2025-05-19",
      end_date: "2025-06-01",
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
      tasks.value = [...tasks.value, newTask];
      saveTasks();
      globalStore.setLoadingApi(false);
    };
    taskApi.create(mockTask, { onSuccess });
  }

  function updateTask(id: string, taskData: Partial<Task>) {
    globalStore.setLoadingApi(true);
    const mockTask = {
      extra_emp: [],
      id: taskData.taskTemplate.id,
      task_template_value: null,
      order_id: taskData.orderDetails.id,
      rep_task_ids: [],
      task_title: taskData.title,
      permission: taskData.taskTemplate.permission,
      date_type: "duration",
      duration: "3",
      start_time: "00:00",
      end_time: "00:00",
      resource_location_category_value: "Office",
      task_description: taskData.description,
      invoice_text: null,
      required_skills: "Developer",
      dress: null,
      color: taskData.taskTemplate.color,
      date: taskData.date,
      previous_date: "2025-05-29",
      is_edit: true,
      location: null,
      latitude: null,
      longitude: null,
      repetitions: "1",
      teamlead_description: null,
      teamlead_contact_person: null,
      emp_rep: [[]],
      e_count_rep: [1],
      veh_rep: [[]],
      v_count_rep: ["0"],
      dev_rep: [[]],
      d_count_rep: ["0"],
      language: [],
      predecessor: [],
      successor: [],
      predecessor_hour: null,
      successor_hour: null,
      start_date: "2025-05-26",
      end_date: "2025-06-01",
      repetition_value: 0,
      rates_rep: ["0.00"],
      base_wage_rep: ["12.00"],
      plan_start_time_rep: ["00:00"],
      plan_end_time_rep: ["00:00"],
      plan_pause_time_rep: ["00:00"],
      travel_charges_rep: ["0"],
      is_add_date: true,
      updated_date: ["2025-05-29"],
      location_description: null,
      custom_count_rep: [0],
      custom_emp_rep: [[]],
      custom_open_rep: [[]],
      primary_color: "task_template",
      notification_template_id: null,
      task_status: null,
      task_status_id: null,
      end_series: false,
    };
    const onSuccess = () => {
      globalStore.setLoadingApi(true);
      tasks.value = tasks.value.map((task) => {
        if (task.id == id) {
          const updatedTask: Task = {
            id,
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
          return {
            ...task,
            ...updatedTask,
          };
        }
        return task;
      });
      saveTasks();
    };
    taskApi.updateOne(mockTask, { onSuccess });
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
    globalStore.setLoadingApi(false);
    return {
      title: res.data.project.task_title,
      description: res.data.project.description,
      date: res.data.project.date,
      orderDetails: {
        latitude: "",
        longitude: "",
        id: res.data.project.order_id,
        customerName: res.data.project.customer_name || "No Customer",
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
      },
      activities: res.data.activities,
      resources: res.data.resource,
      attachments: res.data.attachments,
    };
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
              description: task.description,
              date: task.date,
              color: task.color || "#e5e7eb",
              deviceCout: task.device_occupied_count,
              allDeviceCount: task.device_available_count,
              employeeCount: task.employee_occupied_count,
              allEmployeeCount: task.employee_available_count,
              vehicleCount: task.vehicle_occupied_count,
              allVehicleCount: task.vehicle_available_count,
              customer: task.customer.customer_name || "No Customer",
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
    { deep: true }
  );

  return {
    tasks,
    taskIndicatorDisplay,
    archiveModalDispay,
    setArchiveModalDispay,
    setTaskIndicatorDisplay,
    addTask,
    updateTask,
    deleteTask,
    loadTasks,
    getTask,
  };
});

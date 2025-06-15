import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import { format } from "date-fns";
import { filterTasksType, SearchTasksType } from "@/types/filters";
import { multifilterTasks } from "@/types/apiRequest";
import { taskApi } from "@/api/taskApi";
import { useGlobalStore } from ".";

type CalendarView = "month" | "week" | "day";
type exportDataType = "daily" | "weekly" | "monthly";
interface defaultDataType {
  skills: any;
  orders: any;
  taskTemplates: any;
  employees: any;
  vehicles: any;
  contactPerson: any;
  notifications: any;
  dresses: any;
  devices: any;
}
type MultifilterKey = keyof multifilterTasks;
export const useCalendarStore = defineStore("calendar", () => {
  const defaultData = reactive<defaultDataType>({
    skills: null,
    orders: null,
    taskTemplates: null,
    employees: null,
    vehicles: null,
    contactPerson: null,
    notifications: null,
    dresses: null,
    devices: null,
  });
  const currentDate = ref(new Date());
  const currentView = ref<CalendarView>("month");
  const startDate = ref<string | null>(null);
  const endDate = ref<string | null>(null);
  const filterTasks = ref<filterTasksType>("");
  const multifilterTasks = reactive<multifilterTasks>({});
  const searchTasksLabel = ref<SearchTasksType>("");
  const searchTasksValue = ref<string | null>("");
  const upCommingTaskDisplay = ref(false);
  const exportTaskDisplay = ref(false);
  const exportTaskType = ref<exportDataType>("daily");
  const globalStore = useGlobalStore();
  function setCurrentDate(date: Date) {
    currentDate.value = date;
  }
  function setUpCommingTaskDisplay(value: boolean) {
    upCommingTaskDisplay.value = value;
  }
  function setExportTaskDisplay(value: boolean) {
    exportTaskDisplay.value = value;
  }
  function setExportTaskType(value: exportDataType) {
    exportTaskType.value = value;
  }

  function setView(view: CalendarView) {
    currentView.value = view;
  }
  function setFilter(filter: filterTasksType) {
    filterTasks.value = filter;
  }
  function setMulltiFilterValue(filter: MultifilterKey, value: number) {
    multifilterTasks[filter] = value;
  }
  function setMulltiFilterKeys(filter: string) {
    multifilterTasks[filter] = 0;
  }
  function setSearch(search: SearchTasksType, searchValue: string) {
    searchTasksLabel.value = search;
    searchTasksValue.value = searchValue;
  }

  function setDateRange(start: Date, end: Date) {
    startDate.value = format(start, "yyyy-MM-dd");
    endDate.value = format(end, "yyyy-MM-dd");
  }
  function setDefaultData(data: defaultDataType) {
    Object.assign(defaultData, data);
  }
  async function getDefaultData() {
    globalStore.setLoadingApi(true);
    const skills = await taskApi.getTaskSkills();
    const orders = await taskApi.getTaskOrders();
    const devices = await taskApi.getTaskDevices();
    const taskTemplates = await taskApi.getTaskTitles();
    const employees = await taskApi.getTaskUsers();
    const vehicles = await taskApi.getTaskVehicles();
    const dresses = await taskApi.getTaskDresses();
    const notifications = await taskApi.getTaskNotificationTemplates();
    const contactPerson = await taskApi.getTaskContactPersons();
    setDefaultData({
      skills: skills.data,
      orders: orders.data,
      devices: devices.data,
      taskTemplates: taskTemplates.data,
      employees: employees.data,
      vehicles: vehicles.data,
      dresses: dresses.data,
      notifications: notifications.data,
      contactPerson: contactPerson.data,
    });
    globalStore.setLoadingApi(false);
  }
  function loadState() {
    const savedView = localStorage.getItem("calendarView");
    const savedDate = localStorage.getItem("calendarDate");

    if (savedView) {
      currentView.value = savedView as CalendarView;
    }

    if (savedDate) {
      currentDate.value = new Date(savedDate);
    }
  }

  function saveState() {
    localStorage.setItem("calendarView", currentView.value);
    localStorage.setItem("calendarDate", currentDate.value.toISOString());
  }

  loadState();

  watch([currentView, currentDate], () => {
    saveState();
  });

  return {
    currentDate,
    currentView,
    startDate,
    endDate,
    filterTasks,
    searchTasksLabel,
    searchTasksValue,
    multifilterTasks,
    defaultData,
    upCommingTaskDisplay,
    exportTaskType,
    exportTaskDisplay,
    setUpCommingTaskDisplay,
    setDefaultData,
    setCurrentDate,
    setView,
    setDateRange,
    setFilter,
    setSearch,
    setMulltiFilterValue,
    setMulltiFilterKeys,
    getDefaultData,
    setExportTaskType,
    setExportTaskDisplay,
  };
});

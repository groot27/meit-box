import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import { format } from "date-fns";
import { filterTasksType, SearchTasksType } from "@/types/filters";
import { multifilterTasks } from "@/types/apiRequest";

type CalendarView = "month" | "week" | "day";

type MultifilterKey = keyof multifilterTasks;
export const useCalendarStore = defineStore("calendar", () => {
  const currentDate = ref(new Date());
  const currentView = ref<CalendarView>("month");
  const startDate = ref<string | null>(null);
  const endDate = ref<string | null>(null);
  const filterTasks = ref<filterTasksType>("");
  const multifilterTasks = reactive<multifilterTasks>({});
  const searchTasksLabel = ref<SearchTasksType>("");
  const searchTasksValue = ref<string | null>("");

  function setCurrentDate(date: Date) {
    currentDate.value = date;
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
    setCurrentDate,
    setView,
    setDateRange,
    setFilter,
    setSearch,
    setMulltiFilterValue,
    setMulltiFilterKeys,
  };
});

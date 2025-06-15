<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from "vue";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  format,
} from "date-fns";
import CalendarHeader from "./CalendarHeader.vue";
import MonthView from "./views/MonthView.vue";
import WeekView from "./views/WeekView.vue";
import DayView from "./views/DayView.vue";
import TaskModal from "./task/TaskModal.vue";
import TaskInfoModal from "./task/TaskInfoModal.vue";
import TaskEditSidebar from "./task/TaskEditSidebar.vue";
import LeftSidebar from "./leftSide/LeftSidebar.vue";
import RightSidebar from "./rightSide/RightSidebar.vue";
import { useCalendarStore } from "@/stores/CalendarStore";
import { useTaskStore } from "@/stores/TaskStore";
import { Task } from "@/types/TaskTypes";
import { useRouter, useRoute } from "vue-router";
import { useGlobalStore } from "@/stores";
import TopBarLoading from "@/components/widgets/TopBarLoading.vue";
import ArchiveTaskModal from "./task/ArchiveTaskModal.vue";
import ExportDataCalendar from "./leftSide/ExportDataCalendar.vue";
const globalStore = useGlobalStore();
const calendarStore = useCalendarStore();
const taskStore = useTaskStore();
const router = useRouter();
const route = useRoute();

const isTaskModalOpen = ref(false);
const isTaskInfoModalOpen = ref(false);
const isTaskEditSidebarOpen = ref(false);
const selectedDate = ref<Date | null>(null);
const selectedTask = ref<Task | null>(null);
const modalPosition = ref<{ x: number; y: number } | null>(null);

const currentView = computed(() => calendarStore.currentView);
const tasks = computed(() => taskStore.tasks);
const currentDate = computed(() => calendarStore.currentDate);
const filterTasks = computed(() => calendarStore.filterTasks);
const searchTaskLabel = computed(() => calendarStore.searchTasksLabel);
const searchTaskValue = computed(() => calendarStore.searchTasksValue);
const multiFilter = computed(() => calendarStore.multifilterTasks);

const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const handleTaksEditDisplay = async (taskId) => {
  if (taskId) {
    const task = await taskStore.getTask(taskId);
    if (task) {
      // selectedTask.value = task;
      isTaskEditSidebarOpen.value = true;
    }
  } else {
    // selectedTask.value = null;
    isTaskEditSidebarOpen.value = false;
  }
};

const setDateByView = () => {
  let start: Date;
  let end: Date;
  switch (currentView.value) {
    case "month":
      start = startOfWeek(startOfMonth(currentDate.value), { weekStartsOn: 1 });
      end = endOfWeek(endOfMonth(currentDate.value), { weekStartsOn: 1 });
      break;
    case "week":
      start = startOfWeek(currentDate.value, { weekStartsOn: 1 });
      end = endOfWeek(currentDate.value, { weekStartsOn: 1 });
      break;
    case "day":
      start = startOfDay(currentDate.value);
      end = endOfDay(currentDate.value);
      break;
  }

  return { start, end };
};

const handleDateClick = (date: Date, event?: MouseEvent) => {
  // Close all other modals/sidebars first
  isTaskInfoModalOpen.value = false;
  isTaskEditSidebarOpen.value = false;

  selectedDate.value = date;

  if (event?.target) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    modalPosition.value = {
      x: rect.left,
      y: rect.top + rect.height + 4,
    };
  } else {
    modalPosition.value = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  }

  isTaskModalOpen.value = true;
};

const handleTaskClick = (task: Task, event: MouseEvent) => {
  // Close all other modals/sidebars first
  isTaskModalOpen.value = false;
  isTaskEditSidebarOpen.value = false;

  selectedTask.value = task;

  const rect = event.target
    ? (event.target as HTMLElement).getBoundingClientRect()
    : null;
  modalPosition.value = rect
    ? {
        x: rect.left,
        y: rect.top + rect.height + 4,
      }
    : {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

  isTaskInfoModalOpen.value = true;
};

const closeTaskModal = () => {
  isTaskModalOpen.value = false;
  // selectedDate.value = null;
  modalPosition.value = null;
};

const closeTaskInfoModal = () => {
  isTaskInfoModalOpen.value = false;
  modalPosition.value = null;
};

const closeTaskEditSidebar = () => {
  isTaskEditSidebarOpen.value = false;
  // selectedTask.value = null;
  // Remove taskId from URL by navigating back to base route
  router.push("/monthly-view2");
};

const handleTaskCreate = (taskData: any) => {
  if (selectedDate.value) {
    taskStore.createTask({
      ...taskData,
      date: selectedDate.value,
    });
    closeTaskModal();
    closeTaskEditSidebar();
  }
};
const handleQuickTaskCreate = async () => {
  if (selectedDate.value) {
    await taskStore.continueToCreate({
      date: format(selectedDate.value, "yyyy-MM-dd"),
    });
    taskStore.createTask({
      date: selectedDate.value,
    });
    closeTaskModal();
    closeTaskEditSidebar();
  }
};

const handleTaskShare = (task: Task) => {
  // Implement share functionality
  console.log("Share task:", task);
};

const handleTaskCopy = (task: Task) => {
  // Implement copy functionality
  console.log("Copy task:", task);
};

const handleTaskEdit = async (task: Task) => {
  // Close info modal before opening sidebar
  isTaskInfoModalOpen.value = false;

  // Add taskId to URL
  if (task.id) {
    router.push(`/monthly-view2/${task.id}`);
  } else {
    // selectedTask.value = task;
    await taskStore.continueToCreate(task);
    isTaskEditSidebarOpen.value = true;
  }
};

const handleTaskUpdate = async (updatedTask: Task) => {
  await taskStore.updateTask(String(route.params.taskId), updatedTask);
  closeTaskEditSidebar();
};

// Update date
watch(
  [
    currentView,
    currentDate,
    filterTasks,
    searchTaskLabel,
    searchTaskValue,
    multiFilter.value,
  ],
  () => {
    let { start, end } = setDateByView();

    calendarStore.setDateRange(start, end);
    taskStore.tasks = [];
    let apiProps: any = {};
    if (calendarStore.startDate && calendarStore.endDate) {
      apiProps.date_between = `${calendarStore.startDate},${calendarStore.endDate}`;
    }
    if (filterTasks.value) {
      apiProps[filterTasks.value] = 1;
    }
    if (searchTaskLabel.value && searchTaskValue.value) {
      apiProps[searchTaskLabel.value] = searchTaskValue.value;
    }
    const selectedSkills = Object.keys(multiFilter.value).filter(
      (key) => multiFilter.value[key]
    );
    if (selectedSkills.length > 0) {
      apiProps["skill"] = selectedSkills;
    }
    taskStore.loadTasks(apiProps);
  }
);

// Watch for route changes to sync task selection
watch(
  () => route.params.taskId,
  (newTaskID) => {
    handleTaksEditDisplay(newTaskID);
  }
);

onMounted(async () => {
  let { start, end } = setDateByView();
  calendarStore.setDateRange(start, end);
  await calendarStore.getDefaultData();
  taskStore.loadTasks({
    date_between: `${calendarStore.startDate},${calendarStore.endDate}`,
  });

  if (route.params.taskId) {
    handleTaksEditDisplay(route.params.taskId);
  }
});
</script>

<style scoped>
.no-drop-cursor * {
  cursor: no-drop !important;
}
</style>
<template>
  <div
    class="h-screen flex flex-col w-full"
    :class="
      globalStore.loadingApi ? 'pointer-events-none' : 'pointer-events-auto'
    "
  >
    <CalendarHeader />

    <top-bar-loading />
    <div class="flex-1 flex h-full">
      <!-- Mini Calendar -->
      <div class="relative">
        <button
          class="absolute z-50 top-4 -right-6 bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300"
          @click="toggleSidebar"
        >
          {{ isSidebarCollapsed ? "▶" : "◀" }}
        </button>
        <div
          :class="[
            'transition-all duration-300 ease-in-out bg-gray-50 border-r overflow-hidden',
            isSidebarCollapsed ? 'w-0 p-0' : 'w-[400px] p-4',
          ]"
        >
          <LeftSidebar v-if="!isSidebarCollapsed" />
        </div>
      </div>

      <!-- Main Calendar -->
      <div class="flex-1 overflow-auto bg-white relative">
        <KeepAlive>
          <component
            :is="
              currentView === 'month'
                ? MonthView
                : currentView === 'week'
                ? WeekView
                : DayView
            "
            @date-click="handleDateClick"
            @task-click="handleTaskClick"
          />
        </KeepAlive>
      </div>
      <div class="relative max-h-full overflow-y-auto">
        <div
          :class="[
            'transition-all duration-300 ease-in-out  border-r overflow-hidden',
            !calendarStore.upCommingTaskDisplay
              ? 'w-0 p-0'
              : 'w-[400px] px-1 py-2',
          ]"
        >
          <RightSidebar v-if="calendarStore.upCommingTaskDisplay" />
        </div>
      </div>
    </div>

    <TaskModal
      v-if="isTaskModalOpen && selectedDate"
      :date="selectedDate"
      :position="modalPosition"
      @close="closeTaskModal"
      @create="handleQuickTaskCreate"
      @continue-to-create="handleTaskEdit"
    />

    <TaskInfoModal
      v-if="isTaskInfoModalOpen && selectedTask"
      :task="selectedTask"
      :position="modalPosition"
      @close="closeTaskInfoModal"
      @share="handleTaskShare"
      @copy="handleTaskCopy"
      @edit="handleTaskEdit"
    />

    <TaskEditSidebar
      v-if="isTaskEditSidebarOpen"
      :show="isTaskEditSidebarOpen"
      @close="closeTaskEditSidebar"
      @update="handleTaskUpdate"
      @create="handleTaskCreate"
    />
    <ArchiveTaskModal />
    <ExportDataCalendar />
  </div>
</template>

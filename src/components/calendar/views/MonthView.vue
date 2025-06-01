<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameMonth,
  isSameDay,
  getWeek,
} from "date-fns";
import { useCalendarStore } from "@/stores/CalendarStore";
import { useTaskStore } from "@/stores/TaskStore";
import { useI18n } from "vue-i18n";
import TaskIndicator from "../task/TaskIndicator.vue";
import { Task } from "@/types/TaskTypes";

const { t } = useI18n();
const calendarStore = useCalendarStore();
const taskStore = useTaskStore();

const emit = defineEmits<{
  (e: "dateClick", date: Date, event: MouseEvent): void;
  (e: "taskClick", task: Task, event: MouseEvent): void;
}>();

const currentDate = computed(() => calendarStore.currentDate);
const tasks = computed(() => taskStore.tasks);

const calendarDays = computed(() => {
  const monthStart = startOfMonth(currentDate.value);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  // Update the date range in the store
  calendarStore.setDateRange(calendarStart, calendarEnd);

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
});

const weeks = computed(() => {
  const days = calendarDays.value;
  const weeksArray = [];
  let week = [];

  days.forEach((day, index) => {
    week.push(day);
    if ((index + 1) % 7 === 0 || index === days.length - 1) {
      weeksArray.push([...week]);
      week = [];
    }
  });

  return weeksArray;
});

const weekNumbers = computed(() => {
  return weeks.value.map((week) => getWeek(week[0]));
});

const weekdays = computed(() => [
  t("calendar.weekdays.short.sun"),
  t("calendar.weekdays.short.mon"),
  t("calendar.weekdays.short.tue"),
  t("calendar.weekdays.short.wed"),
  t("calendar.weekdays.short.thu"),
  t("calendar.weekdays.short.fri"),
  t("calendar.weekdays.short.sat"),
]);

const getTasksForDate = (date: Date) => {
  return tasks.value.filter((task) => {
    const taskDate = new Date(task.date);
    return isSameDay(date, taskDate);
  });
};

const handleDateClick = (date: Date, event: MouseEvent) => {
  const calendarElement = document.querySelector(".calendar-container");
  if (calendarElement) {
    const rect = calendarElement.getBoundingClientRect();
    const modalWidth = 600;
    const modalHeight = 700;

    emit("dateClick", date, {
      ...event,
      clientX: rect.left + (rect.width - modalWidth) / 2,
      clientY: rect.top + (rect.height - modalHeight) / 2,
    });
  } else {
    emit("dateClick", date, event);
  }
};

const handleTaskClick = (task: Task, event: MouseEvent) => {
  emit("taskClick", task, event);
};
</script>

<template>
  <div class="h-full flex flex-col calendar-container">
    <div
      class="grid grid-cols-[auto_repeat(7,1fr)] border-b bg-white sticky top-0 z-10 h-12"
    >
      <div
        class="py-2 px-3 text-center text-xs font-medium text-gray-500 border-r h-full"
      >
        Wk
      </div>
      <div
        v-for="day in weekdays"
        :key="day"
        class="py-2 text-center text-xs font-medium text-gray-500 border-l first:border-l-0"
      >
        {{ day }}
      </div>
    </div>

    <div class="flex flex-col flex-1 h-full">
      <div
        v-for="(week, weekIndex) in weeks"
        :key="weekIndex"
        class="flex-1 min-h-0 grid grid-cols-[auto_repeat(7,1fr)]"
      >
        <div
          class="py-2 px-3 text-xs font-medium text-gray-500 border-r bg-gray-50"
        >
          {{ weekNumbers[weekIndex] }}
        </div>
        <div
          v-for="day in week"
          :key="format(day, 'yyyy-MM-dd')"
          class="border-b border-l first:border-l-0 p-2 overflow-hidden relative"
          :class="[
            isSameMonth(day, currentDate) ? 'bg-white' : 'bg-gray-50',
            isToday(day) ? 'bg-blue-50' : '',
            'hover:bg-gray-50',
          ]"
        >
          <button
            @click="(event) => handleDateClick(day, event)"
            class="w-full flex items-center px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg
              class="w-4 h-4 text-gray-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span
              class="text-lg flex-1 text-center"
              :class="[
                isToday(day)
                  ? 'text-blue-600 font-medium'
                  : isSameMonth(day, currentDate)
                  ? 'text-gray-900'
                  : 'text-gray-400',
              ]"
            >
              {{ format(day, "d") }}
            </span>
          </button>

          <div
            class="mt-2 overflow-y-auto max-h-full absolute inset-x-0 bottom-0 top-[40px] p-2 space-y-1"
          >
            <TaskIndicator
              v-for="task in getTasksForDate(day)"
              :key="task.id"
              :task="task"
              @click="handleTaskClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

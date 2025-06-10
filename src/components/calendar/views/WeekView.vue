<script setup lang="ts">
import { computed, watch, ref } from "vue";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  isSameDay,
  addHours,
  isSameHour,
  isWithinInterval,
  parseISO,
  areIntervalsOverlapping,
} from "date-fns";
import { useCalendarStore } from "@/stores/CalendarStore";
import { useTaskStore } from "@/stores/TaskStore";
import { useI18n } from "vue-i18n";
import TaskEventItem from "../task/TaskEventItem.vue";
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
const loading = ref(true);

const weekDays = computed(() => {
  const weekStart = startOfWeek(currentDate.value, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate.value, { weekStartsOn: 1 });
  return eachDayOfInterval({ start: weekStart, end: weekEnd });
});

const weekdayNames = computed(() => [
  t("calendar.weekdays.short.mon"),
  t("calendar.weekdays.short.tue"),
  t("calendar.weekdays.short.wed"),
  t("calendar.weekdays.short.thu"),
  t("calendar.weekdays.short.fri"),
  t("calendar.weekdays.short.sat"),
  t("calendar.weekdays.short.sun"),
]);

const hours = computed(() => {
  const dayStart = startOfDay(currentDate.value);
  const dayEnd = endOfDay(currentDate.value);
  return eachHourOfInterval({ start: dayStart, end: dayEnd });
});

const getTasksForHourAndDay = (hour: Date, day: Date) => {
  const hourStart = new Date(day);
  hourStart.setHours(hour.getHours(), 0, 0, 0);

  const hourEnd = new Date(day);
  hourEnd.setHours(hour.getHours(), 59, 59, 999);

  const tasksInHour = tasks.value.filter((task) => {
    const taskDate = parseISO(task.date + " " + task.startTime);
    return isWithinInterval(taskDate, { start: hourStart, end: hourEnd });
  });

  // Group overlapping tasks
  const groups: Task[][] = [];
  tasksInHour.forEach((task) => {
    const taskInterval = {
      start: parseISO(task.date + " " + task.startTime),
      end: addHours(parseISO(task.date + " " + task.startTime), 1),
    };

    let added = false;
    for (const group of groups) {
      if (
        group.some((groupTask) => {
          const groupTaskInterval = {
            start: parseISO(groupTask.date),
            end: addHours(parseISO(groupTask.date), 1),
          };
          return areIntervalsOverlapping(taskInterval, groupTaskInterval);
        })
      ) {
        group.push(task);
        added = true;
        break;
      }
    }

    if (!added) {
      groups.push([task]);
    }
  });

  return groups;
};

const getCurrentTimePosition = computed(() => {
  const now = new Date();
  const dayStart = startOfDay(now);
  const hours = (now.getTime() - dayStart.getTime()) / 3600000;
  return `${hours * 48}px`;
});

const isCurrentTime = (hour: Date) => {
  const now = new Date();
  return isSameHour(now, hour);
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
watch(tasks, (newTasks, oldTasks) => {
  if (newTasks.length) {
    loading.value = false;
  }
});
</script>

<template>
  <div class="overflow-x-auto calendar-container">
    <div class="min-w-[800px]">
      <!-- Days header -->
      <div class="grid grid-cols-8 border-b bg-gray-100 sticky top-0 z-10">
        <div class="py-2 pl-16 text-sm font-medium text-gray-500"></div>
        <button
          v-for="(day, index) in weekDays"
          :key="format(day, 'yyyy-MM-dd')"
          class="py-2 text-center border-l hover:bg-gray-50"
          @click="(event) => handleDateClick(day, event)"
        >
          <div class="flex items-center justify-center space-x-1">
            <span
              class="text-sm"
              :class="
                isToday(day) ? 'text-blue-600 font-medium' : 'text-gray-900'
              "
            >
              {{ weekdayNames[index] }} {{ format(day, "d") }}
            </span>
            <svg
              class="w-4 h-4 text-gray-500"
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
          </div>
        </button>
      </div>

      <!-- Time grid -->
      <div class="relative">
        <!-- Current time indicator -->
        <div
          v-if="weekDays.some((day) => isToday(day))"
          class="absolute left-0 right-0 border-t-2 border-red-500 z-30"
          :style="{ top: getCurrentTimePosition }"
        >
          <div
            class="absolute -top-[5px] -left-2 w-3 h-3 rounded-full bg-red-500"
          ></div>
        </div>

        <div
          v-for="hour in hours"
          :key="format(hour, 'HH:mm')"
          class="grid grid-cols-8 relative"
          :class="{ 'border-t': hour.getHours() !== 0 }"
        >
          <!-- Time label -->
          <div
            class="sticky left-0 bg-white py-2 pr-4 text-right text-xs text-gray-500"
            :class="{ 'font-medium': hour.getHours() === 0 }"
          >
            {{ format(hour, hour.getHours() === 0 ? "MMM d" : "h a") }}
          </div>

          <!-- Hour cells for each day -->
          <div
            v-for="day in weekDays"
            :key="`${format(day, 'yyyy-MM-dd')}-${format(hour, 'HH')}`"
            class="relative h-[48px] border-l hover:bg-gray-50 transition-colors duration-200"
            :class="{
              'bg-blue-50': isCurrentTime(hour) && isToday(day),
            }"
          >
            <div class="absolute inset-0 flex items-start p-1" v-if="!loading">
              <div class="flex-1 max-w-full">
                <template
                  v-for="(group, groupIndex) in getTasksForHourAndDay(
                    hour,
                    day
                  )"
                  :key="groupIndex"
                >
                  <TaskEventItem
                    v-for="(task, taskIndex) in group"
                    :key="task.id"
                    :task="task"
                    :index="taskIndex"
                    :total="group.length"
                    @click="handleTaskClick"
                  />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
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
  addMinutes,
} from "date-fns";
import { useCalendarStore } from "@/stores/CalendarStore";
import { useTaskStore } from "@/stores/TaskStore";
import { useI18n } from "vue-i18n";
import TaskEventItem from "../task/TaskEventItem.vue";
import { Task } from "@/types/TaskTypes";

const { t } = useI18n();
const calendarStore = useCalendarStore();
const taskStore = useTaskStore();
const loading = ref(true);

const emit = defineEmits<{
  (e: "dateClick", date: Date, event: MouseEvent): void;
  (e: "taskClick", task: Task, event: MouseEvent): void;
}>();

const currentDate = computed(() => calendarStore.currentDate);
const tasks = computed(() => taskStore.tasks);

const hours = computed(() => {
  const dayStart = startOfDay(currentDate.value);
  const dayEnd = endOfDay(currentDate.value);
  return eachHourOfInterval({ start: dayStart, end: dayEnd });
});

const formattedDate = computed(() => {
  const weekday = t(
    `calendar.weekdays.long.${format(currentDate.value, "eee").toLowerCase()}`
  );
  const month = t(
    `calendar.months.long.${format(currentDate.value, "LLLL").toLowerCase()}`
  );
  return `${weekday}, ${month} ${format(currentDate.value, "d, yyyy")}`;
});

const getTasksForHour = (hour: Date) => {
  const hourStart = hour;
  const hourEnd = addMinutes(hour, 59);
  const tasksInHour = tasks.value.filter((task) => {
    const taskDate = new Date(task.date + " " + task.startTime);
    return (
      isSameDay(currentDate.value, taskDate) &&
      isWithinInterval(taskDate, { start: hourStart, end: hourEnd })
    );
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
  return `${hours * 60}px`;
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
  if (newTasks.length && loading.value) {
    loading.value = false;
    console.log("🚀 ~ watch ~ loading.value:", loading.value);
  }
});
</script>

<template>
  <div class="calendar-container">
    <div class="grid grid-cols-1 border-b">
      <button
        class="px-4 py-3 hover:bg-gray-50 flex items-center justify-center space-x-2 bg-gray-100"
        @click="(event) => handleDateClick(currentDate, event)"
      >
        <span
          class="text-center"
          :class="
            isToday(currentDate)
              ? 'text-primary-500 font-semibold'
              : 'text-gray-700'
          "
        >
          {{ formattedDate }}
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
      </button>
    </div>

    <div class="relative">
      <div
        v-if="isToday(currentDate)"
        class="absolute left-0 right-0 border-t border-primary-500 z-30"
        :style="{ top: getCurrentTimePosition }"
      >
        <div
          class="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-primary-500"
        ></div>
      </div>

      <div
        v-for="hour in hours"
        :key="format(hour, 'HH:mm')"
        class="grid grid-cols-6 border-b last:border-b-0"
      >
        <div
          class="p-2 text-right pr-4 text-sm text-gray-500 font-medium border-r"
        >
          {{ format(hour, "h a") }}
        </div>

        <div
          class="col-span-5 relative min-h-[60px] hover:bg-gray-50 transition-colors duration-200"
          :class="
            isCurrentTime(hour) && isToday(currentDate) ? 'bg-blue-50' : ''
          "
        >
          <div class="absolute inset-0 flex items-start p-2" v-if="!loading">
            <div class="flex-1 max-w-full">
              <template
                v-for="(group, groupIndex) in getTasksForHour(hour)"
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
</template>

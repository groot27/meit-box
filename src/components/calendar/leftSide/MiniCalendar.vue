<script setup lang="ts">
import { computed } from "vue";
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
} from "date-fns";
import { useCalendarStore } from "@/stores/CalendarStore";

const calendarStore = useCalendarStore();

const currentDate = computed(() => calendarStore.currentDate);

const calendarDays = computed(() => {
  const monthStart = startOfMonth(currentDate.value);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

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

const handleDateClick = (date: Date) => {
  calendarStore.setCurrentDate(date);
};
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4 w-full">
    <div class="text-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900">
        {{ format(currentDate, "MMMM yyyy") }}
      </h3>
    </div>

    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="day in ['M', 'T', 'W', 'T', 'F', 'S', 'S']"
        :key="day"
        class="text-center text-xs font-medium text-gray-500"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="day in calendarDays"
        :key="format(day, 'yyyy-MM-dd')"
        @click="handleDateClick(day)"
        class="aspect-square flex items-center justify-center text-sm rounded-full hover:bg-gray-100"
        :class="[
          isToday(day) ? 'bg-blue-100 text-blue-600 font-medium' : '',
          !isSameMonth(day, currentDate) ? 'text-gray-400' : 'text-gray-900',
          isSameDay(day, currentDate)
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : '',
        ]"
      >
        {{ format(day, "d") }}
      </button>
    </div>
  </div>
</template>

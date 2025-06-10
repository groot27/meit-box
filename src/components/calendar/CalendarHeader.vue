<script setup lang="ts">
import { computed } from "vue";
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from "date-fns";
import { useI18n } from "vue-i18n";
import { useCalendarStore } from "@/stores/CalendarStore";
import LanguageSelector from "../LanguageSelector.vue";

const { t } = useI18n();
const calendarStore = useCalendarStore();

const currentView = computed(() => calendarStore.currentView);
const currentDate = computed(() => calendarStore.currentDate);

const formattedTitle = computed(() => {
  const monthNames = {
    0: t("calendar.months.long.january"),
    1: t("calendar.months.long.february"),
    2: t("calendar.months.long.march"),
    3: t("calendar.months.long.april"),
    4: t("calendar.months.long.may"),
    5: t("calendar.months.long.june"),
    6: t("calendar.months.long.july"),
    7: t("calendar.months.long.august"),
    8: t("calendar.months.long.september"),
    9: t("calendar.months.long.october"),
    10: t("calendar.months.long.november"),
    11: t("calendar.months.long.december"),
  };

  switch (currentView.value) {
    case "month":
      return t("calendar.dateFormats.monthAndYear", {
        month: monthNames[currentDate.value.getMonth()],
        year: currentDate.value.getFullYear(),
      });
    case "week":
      return t("calendar.dateFormats.weekOf", {
        date: format(currentDate.value, "MMM d, yyyy"),
      });
    case "day":
      const weekday = t(
        `calendar.weekdays.long.${format(
          currentDate.value,
          "eee"
        ).toLowerCase()}`
      );
      const month = monthNames[currentDate.value.getMonth()];
      return `${weekday}, ${month} ${format(currentDate.value, "d, yyyy")}`;
    default:
      return "";
  }
});

const setView = (view: "month" | "week" | "day") => {
  calendarStore.setView(view);
};

const navigateToPrevious = () => {
  switch (currentView.value) {
    case "month":
      calendarStore.setCurrentDate(subMonths(currentDate.value, 1));
      break;
    case "week":
      calendarStore.setCurrentDate(subWeeks(currentDate.value, 1));
      break;
    case "day":
      calendarStore.setCurrentDate(subDays(currentDate.value, 1));
      break;
  }
};

const navigateToNext = () => {
  switch (currentView.value) {
    case "month":
      calendarStore.setCurrentDate(addMonths(currentDate.value, 1));
      break;
    case "week":
      calendarStore.setCurrentDate(addWeeks(currentDate.value, 1));
      break;
    case "day":
      calendarStore.setCurrentDate(addDays(currentDate.value, 1));
      break;
  }
};
const handleRightSideBar = () => {
  calendarStore.setUpCommingTaskDisplay(!calendarStore.upCommingTaskDisplay);
};

const goToToday = () => {
  calendarStore.setCurrentDate(new Date());
};
</script>

<template>
  <header class="bg-[#1c3f52] text-white border-b">
    <div class="flex items-center justify-between px-6 py-3">
      <div class="flex items-center space-x-4">
        <button
          @click="goToToday"
          class="px-4 py-2 text-sm font-medium text-gray-200 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {{ t("calendar.today") }}
        </button>

        <div class="flex items-center space-x-2">
          <button
            @click="navigateToPrevious"
            class="p-2 text-gray-200 hover:bg-gray-100 rounded-full"
          >
            <svg
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            @click="navigateToNext"
            class="p-2 text-gray-200 hover:bg-gray-100 rounded-full"
          >
            <svg
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <h2 class="text-xl font-normal text-gray-100 ml-2">
            {{ formattedTitle }}
          </h2>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <div class="flex rounded-lg border border-gray-300 p-1">
          <button
            v-for="view in ['month', 'week', 'day']"
            :key="view"
            @click="setView(view as 'month' | 'week' | 'day')"
            class="px-4 py-1 text-sm font-medium rounded"
            :class="
              currentView === view
                ? 'bg-[#00ffd924] text-white'
                : 'text-gray-500 hover:text-white'
            "
          >
            {{ t(`calendar.views.${view}`) }}
          </button>
        </div>
        <button
          class="py-1 px-2 rounded-lg border border-gray-300"
          @click="handleRightSideBar"
        >
          <font-awesome-icon :icon="['fas', 'rectangle-list']" />
        </button>

        <!-- <LanguageSelector /> -->
      </div>
    </div>
  </header>
</template>

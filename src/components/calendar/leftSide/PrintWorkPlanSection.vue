<script setup lang="ts">
import { useCalendarStore } from "@/stores/CalendarStore";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const isExpanded = ref(false);
const selectedOption = ref<string | null>(null);
const calendarStore = useCalendarStore();

const options = [
  { key: "daily", label: t("leftSidebar.printWorkPlan.dailySheet") },
  { key: "weekly", label: t("leftSidebar.printWorkPlan.weeklySheet") },
  { key: "monthly", label: t("leftSidebar.printWorkPlan.monthlySheet") },
];

const toggleOption = (key: string) => {
  selectedOption.value = selectedOption.value === key ? null : key;
  calendarStore.setExportTaskType(key);
};
const handleSelectDate = () => {
  calendarStore.setExportTaskDisplay(true);
};
</script>

<template>
  <div class="my-2">
    <button
      class="w-full p-3 text-left font-medium flex items-center justify-between"
      @click="isExpanded = !isExpanded"
    >
      <div class="flex items-center space-x-2">
        <svg
          class="w-5 h-5 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
        <span>{{ t("leftSidebar.printWorkPlan.title") }}</span>
      </div>
      <svg
        class="w-5 h-5 transform transition-transform"
        :class="isExpanded ? 'rotate-180' : ''"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <div v-if="isExpanded" class="p-3 border-t space-y-3">
      <label
        v-for="option in options"
        :key="option.key"
        class="flex items-center justify-between"
      >
        <span>{{ option.label }}</span>
        <div class="relative inline-block w-10 h-6">
          <input
            type="checkbox"
            class="switch-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            :checked="selectedOption === option.key"
            @change="toggleOption(option.key)"
          />
          <label
            class="switch-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
          ></label>
        </div>
      </label>

      <button
        class="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!selectedOption"
        @click="handleSelectDate"
      >
        {{ t("leftSidebar.printWorkPlan.selectData") }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.switch-checkbox:checked {
  right: 0;
  border-color: #2563eb;
}
.switch-checkbox:checked + .switch-label {
  background-color: #93c5fd;
}
.switch-label {
  transition: background-color 0.2s ease-in;
}
</style>

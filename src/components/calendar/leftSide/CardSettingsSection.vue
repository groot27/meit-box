<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useTaskStore } from "@/stores/TaskStore";
import { TaskIndicatorType } from "@/types/TaskTypes";

const { t } = useI18n();
const isExpanded = ref(false);
const taskStore = useTaskStore();
const indicatorDisplay = computed(() => taskStore.taskIndicatorDisplay);
const settings = [
  {
    key: "taskTitle",
    value: "tittle",
    label: t("leftSidebar.cardSettings.taskTitle"),
  },
  {
    key: "showStartTime",
    value: "time",
    label: t("leftSidebar.cardSettings.showStartTime"),
  },
  {
    key: "showEmployees",
    value: "employee",
    label: t("leftSidebar.cardSettings.showEmployees"),
  },
  {
    key: "showDevices",
    value: "devices",
    label: t("leftSidebar.cardSettings.showDevices"),
  },
  {
    key: "customerShort",
    value: "customer",
    label: t("leftSidebar.cardSettings.customerShort"),
  },
  {
    key: "showExtendedData",
    value: "vehicle",
    label: t("leftSidebar.cardSettings.showExtendedData"),
  },
];
function handleClick(value: keyof TaskIndicatorType, checked: boolean) {
  taskStore.setTaskIndicatorDisplay(value, checked);
  console.log("🚀 ~ handleClick ~ taskStore:", indicatorDisplay.value);
}
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
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <span>{{ t("leftSidebar.cardSettings.title") }}</span>
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
        v-for="setting in settings"
        :key="setting.key"
        class="flex items-center justify-between"
      >
        <span>{{ setting.label }}</span>
        <button
          class="relative inline-block w-10 h-6 transition duration-200 ease-in-out"
          @click="handleClick(setting.value, $event.target.checked)"
        >
          <input
            type="checkbox"
            :checked="indicatorDisplay[setting.value as keyof TaskIndicatorType]"
            class="switch-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            class="switch-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
          ></label>
        </button>
      </label>
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

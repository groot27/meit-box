<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { multifilterTasks } from "@/types/apiRequest";
import { useCalendarStore } from "@/stores/CalendarStore";
import { taskApi } from "@/api/taskApi";

const { t } = useI18n();
const isExpanded = ref(false);
const calendarStore = useCalendarStore();
const multiFilter = computed(() => calendarStore.multifilterTasks);
let filters = [
  {
    key: "noSkill",
    value: "without_skills",
    label: t("leftSidebar.taskFilter.noSkill"),
  },
  {
    key: "general",
    value: "has_general_skill",
    label: t("leftSidebar.taskFilter.general"),
  },
  { key: "e2aSkill", value: "", label: t("leftSidebar.taskFilter.e2aSkill") },
  { key: "e2bSkill", value: "", label: t("leftSidebar.taskFilter.e2bSkill") },
];
onMounted(async () => {
  const res = await taskApi.getTaskSkills();
  filters = res.data.map((filter, index) => {
    calendarStore.setMulltiFilterKeys(filter.name);
    return { key: index, value: filter.name, label: filter.name };
  });
});

function handleClick(value: keyof multifilterTasks, checked: boolean) {
  calendarStore.setMulltiFilterValue(value, checked ? 1 : 0);
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
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span>{{ t("leftSidebar.taskFilter.title") }}</span>
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
    <div v-if="isExpanded" class="p-3 border-t space-y-2">
      <label
        v-for="filter in filters"
        :key="filter.key"
        class="flex items-center space-x-2"
      >
        <input
          type="checkbox"
          class="rounded border-gray-300"
          :checked="multiFilter[filter.value] === 1"
          @change="handleClick(filter.value, $event.target.checked)"
        />
        <span>{{ filter.label }}</span>
      </label>
    </div>
  </div>
</template>

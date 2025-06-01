<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useCalendarStore } from "@/stores/CalendarStore";
import { SearchTasksType } from "@/types/filters";
const { t } = useI18n();
const calendarStore = useCalendarStore();

const selectedKey = ref<SearchTasksType>("id"); // default selected option
const searchValue = ref("");

const handleClick = () => {
  calendarStore.setSearch(selectedKey.value, searchValue.value);
};
// Watch for input being cleared
watch(searchValue, (newValue) => {
  if (newValue === "") {
    calendarStore.setSearch(selectedKey.value, ""); // Reset or clear search in store
  }
});

const searchOptions = [
  { value: "id", label: t("leftSidebar.search.options.taskId") },
  { value: "customer_name", label: t("leftSidebar.search.options.customer") },
  { value: "username", label: t("leftSidebar.search.options.userName") },
  {
    value: "resource_location_category_value",
    label: t("leftSidebar.search.options.location"),
  },
];
</script>

<template>
  <div class="flex items-center my-2">
    <select
      v-model="selectedKey"
      class="h-10 rounded-l border-r-0 border-gray-300 bg-gray-50 text-sm"
    >
      <option
        v-for="option in searchOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <div class="relative flex-1">
      <input
        v-model="searchValue"
        type="search"
        :placeholder="t('leftSidebar.search.placeholder')"
        class="h-10 w-full rounded-r border-l-0 border-gray-300 bg-gray-50 pr-10"
      />
      <button
        @click="handleClick"
        class="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700"
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

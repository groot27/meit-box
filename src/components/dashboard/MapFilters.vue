<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDashboardStore } from "@/stores/DashboardStore";

const { t } = useI18n();
const dashboardStore = useDashboardStore();

const filters = computed(() => dashboardStore.filters);
const countrySearch = ref("");
const isSearching = ref(false);

const statusOptions = [
  { value: "", label: "dashboard.filters.allStatus" },
  { value: "pending", label: "orders.status.pending" },
  { value: "in-progress", label: "orders.status.inProgress" },
  { value: "completed", label: "orders.status.completed" },
  { value: "cancelled", label: "orders.status.cancelled" },
];

const handleFilterChange = (key: string, value: any) => {
  dashboardStore.setFilter(key as any, value);
};

const handleDateRangeChange = (key: string, value: string) => {
  const dateRange = { ...filters.value.dateRange };
  dateRange[key] = value;
  dashboardStore.setFilter("dateRange", dateRange);
};

const clearAllFilters = () => {
  dashboardStore.clearFilters();
  countrySearch.value = "";
};

const handleCountrySearchKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    // searchCountry();
  }
};
</script>

<template>
  <div class="bg-white border-r border-gray-200 p-4 w-80">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-medium text-gray-900">
        {{ t("dashboard.filters.title") }}
      </h2>
      <button
        @click="clearAllFilters"
        class="text-sm text-blue-600 hover:text-blue-800"
      >
        {{ t("dashboard.filters.clear") }}
      </button>
    </div>

    <div class="space-y-4">
      <!-- Country Search -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("dashboard.filters.countrySearch") }}
        </label>
        <div class="flex space-x-2">
          <input
            type="text"
            v-model="countrySearch"
            @keypress="handleCountrySearchKeyPress"
            :placeholder="t('dashboard.filters.countrySearchPlaceholder')"
            class="input-field flex-1"
            :disabled="isSearching"
          />
          <!-- <button
            @click="searchCountry"
            :disabled="!countrySearch.trim() || isSearching"
            class="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div
              v-if="isSearching"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
            ></div>
            <svg
              v-else
              class="w-4 h-4"
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
          </button> -->
        </div>
        <p class="text-xs text-gray-500 mt-1">
          {{ t("dashboard.filters.countrySearchHint") }}
        </p>
      </div>

      <!-- Search -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("dashboard.filters.search") }}
        </label>
        <input
          type="text"
          :value="filters.search"
          @input="
            handleFilterChange(
              'search',
              ($event.target as HTMLInputElement).value
            )
          "
          :placeholder="t('dashboard.filters.searchPlaceholder')"
          class="input-field"
        />
      </div>

      <!-- Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("dashboard.filters.status") }}
        </label>
        <select
          :value="filters.status"
          @change="
            handleFilterChange(
              'status',
              ($event.target as HTMLSelectElement).value
            )
          "
          class="input-field"
        >
          <option
            v-for="option in statusOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ t(option.label) }}
          </option>
        </select>
      </div>

      <!-- Date Range -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("dashboard.filters.dateRange") }}
        </label>
        <div class="space-y-2">
          <input
            type="date"
            :value="filters.dateRange.start"
            @input="
              handleDateRangeChange(
                'start',
                ($event.target as HTMLInputElement).value
              )
            "
            class="input-field"
            :placeholder="t('dashboard.filters.startDate')"
          />
          <input
            type="date"
            :value="filters.dateRange.end"
            @input="
              handleDateRangeChange(
                'end',
                ($event.target as HTMLInputElement).value
              )
            "
            class="input-field"
            :placeholder="t('dashboard.filters.endDate')"
          />
        </div>
      </div>

      <!-- Map Settings -->
      <div class="border-t pt-4">
        <h3 class="text-sm font-medium text-gray-700 mb-3">
          {{ t("dashboard.filters.mapSettings") }}
        </h3>

        <div class="space-y-3">
          <label class="flex items-center">
            <input
              type="checkbox"
              :checked="dashboardStore.mapSettings.showLabels"
              @change="
                dashboardStore.updateMapSettings({
                  showLabels: ($event.target as HTMLInputElement).checked,
                })
              "
              class="rounded border-gray-300"
            />
            <span class="ml-2 text-sm text-gray-700">
              {{ t("dashboard.filters.showLabels") }}
            </span>
          </label>

          <label class="flex items-center">
            <input
              type="checkbox"
              :checked="dashboardStore.mapSettings.clusterMarkers"
              @change="
                dashboardStore.updateMapSettings({
                  clusterMarkers: ($event.target as HTMLInputElement).checked,
                })
              "
              class="rounded border-gray-300"
            />
            <span class="ml-2 text-sm text-gray-700">
              {{ t("dashboard.filters.clusterMarkers") }}
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

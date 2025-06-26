<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useDashboardStore } from "@/stores/DashboardStore";

const { t } = useI18n();
const dashboardStore = useDashboardStore();

const ordersByStatus = computed(() => dashboardStore.ordersByStatus);
const totalOrderValue = computed(() => dashboardStore.totalOrderValue);
const dashboardWidgets = computed(() => dashboardStore.dashboardWidgets);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const getStatusColor = (status: string) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};
</script>

<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        {{ t("dashboard.header.title") }}
      </h1>

      <div class="flex items-center space-x-4">
        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {{ t("dashboard.header.export") }}
        </button>
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          {{ t("dashboard.header.refresh") }}
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="w-full flex flex-wrap gap-4">
      <!-- Total Value Card -->

      <!-- Status Cards -->
      <div
        v-for="widget in dashboardWidgets"
        :key="widget"
        class="bg-white rounded-lg p-2 shadow-lg border border-gray-100 flex-auto"
      >
        <router-link :to="widget.url">
          <div class="flex flex-col items-center justify-between h-full">
            <div class="w-full flex justify-between items-start">
              <h3 class="font-medium text-gray-900">
                <!-- {{ t(`dashboard.stats.${widget}`) }} -->
                {{ widget.title }}
              </h3>
              <router-link :to="widget.url + widget.plusUrl">
                <font-awesome-icon
                  v-if="widget.plusIcon"
                  :icon="['fas', 'circle-plus']"
                  class="text-gray-400 mt-4 w-6 h-6"
                />
              </router-link>
            </div>
            <div class="w-full flex justify-between items-end">
              <font-awesome-icon
                :icon="['fas', `${widget.icon}`]"
                class="text-gray-200 w-1/6 h-auto mt-4"
              />
              <p
                :class="widget.count === 0 ? 'text-gray-200' : 'text-blue-500'"
                class="text-2xl font-bold"
              >
                {{ widget.count }}
              </p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </header>
</template>

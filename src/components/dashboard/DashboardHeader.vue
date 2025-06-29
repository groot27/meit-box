<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDashboardStore } from "@/stores/DashboardStore";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import NotificationButton from "../buttons/NotificationButton.vue";

const { t } = useI18n();
const dashboardStore = useDashboardStore();
const searchType = ref("Order");
const searchValue = ref("");
const searchLoading = ref(false);

const searchTypeOptions = ["Order", "Offer", "Invoice", "User"];
const searchOptions = ref<string[]>([]);

// Mock search options based on type
const mockSearchData = {
  Order: ["ORD-001", "ORD-002", "ORD-003", "ORD-004", "ORD-005"],
  Offer: ["OFF-001", "OFF-002", "OFF-003", "OFF-004", "OFF-005"],
  Invoice: ["INV-001", "INV-002", "INV-003", "INV-004", "INV-005"],
  User: [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "David Brown",
  ],
};

const dashboardWidgets = computed(() => dashboardStore.dashboardWidgets);

// Search functionality
const handleSearchTypeChange = (newType: string) => {
  searchType.value = newType;
  searchValue.value = "";
  searchOptions.value = mockSearchData[newType] || [];
};

const handleSearch = (query: string) => {
  searchLoading.value = true;

  // Simulate API call
  setTimeout(() => {
    const allOptions = mockSearchData[searchType.value] || [];
    searchOptions.value = allOptions.filter((option) =>
      option.toLowerCase().includes(query.toLowerCase())
    );
    searchLoading.value = false;
  }, 300);
};
</script>

<template>
  <header class="bg-white border-b border-gray-200">
    <div class="flex items-center justify-between mb-6 bg-[#1c3f52] p-4">
      <!-- Left side - Title, Icon Buttons, and Search -->
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-semibold text-white">
          {{ t("dashboard.header.title") }}
        </h1>

        <!-- Icon Buttons -->
        <div class="flex items-center space-x-1">
          <router-link
            :to="`/order-list2`"
            class="py-2 px-3 text-white bg-white bg-opacity-10 hover:bg-opacity-50 rounded-md transition-colors"
            title="Order List"
          >
            <font-awesome-icon
              :icon="['fas', 'rectangle-list']"
              class="text-white"
            />
          </router-link>

          <router-link
            :to="'/monthly-view2'"
            class="py-2 px-3 text-white bg-white bg-opacity-10 hover:bg-opacity-50 rounded-md transition-colors"
            title="Monthly View"
          >
            <font-awesome-icon :icon="['fas', 'calendar']" class="text-white" />
          </router-link>

          <router-link
            :to="`/finance-dashboard`"
            class="py-2 px-3 text-white bg-white bg-opacity-10 hover:bg-opacity-50 rounded-md transition-colors"
            title="Finance Dashboard"
          >
            <font-awesome-icon
              :icon="['fas', 'calculator']"
              class="text-white"
            />
          </router-link>

          <router-link
            :to="'/users'"
            class="py-2 px-3 text-white bg-white bg-opacity-10 hover:bg-opacity-50 rounded-md transition-colors"
            title="User List"
          >
            <font-awesome-icon :icon="['fas', 'user']" class="text-white" />
          </router-link>
        </div>

        <!-- Search with Dropdown - Right next to icons -->
        <div class="flex items-center space-x-0 ml-2">
          <!-- Search Type Dropdown -->
          <select
            v-model="searchType"
            @change="handleSearchTypeChange(searchType)"
            class="px-3 py-2 text-sm font-medium bg-white bg-opacity-10 hover:bg-opacity-50 rounded-l-md transition-colors min-w-[100px] border-r-0 text-white h-full"
          >
            <option v-for="type in searchTypeOptions" :key="type" :value="type">
              {{ type }}
            </option>
          </select>

          <!-- Search Input -->
          <div class="w-64">
            <AsyncSelect
              v-model="searchValue"
              :options="searchOptions"
              :placeholder="`Search ${searchType.toLowerCase()}...`"
              :loading="searchLoading"
              @search="handleSearch"
              class="bg-black bg-opacity-10 hover:bg-opacity-50"
            />
          </div>
        </div>
      </div>

      <!-- Right side - Create Order Button -->
      <div class="flex items-center">
        <NotificationButton />
        <router-link
          :to="`/add-order/`"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          {{ t("orders.header.createOrder") }}
        </router-link>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="w-full flex flex-wrap gap-4 p-4">
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

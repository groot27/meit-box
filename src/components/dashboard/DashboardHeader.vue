<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDashboardStore } from "@/stores/DashboardStore";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import NotificationButton from "../buttons/NotificationButton.vue";
import { useRouter } from "vue-router";
import CreateOrderButton from "../buttons/CreateOrderButton.vue";

const { t } = useI18n();
const dashboardStore = useDashboardStore();
const searchType = ref("order");
const searchValue = ref("");
const searchLoading = ref(false);
const router = useRouter();

const searchTypeOptions = ["order", "offer", "invoice", "user"];
const searchOptions = computed(
  () => dashboardStore.headerSearch[searchType.value].data
);

const dashboardWidgets = computed(() => dashboardStore.dashboardWidgets);

// Search functionality
const handleSearchTypeChange = (newType: string) => {
  searchType.value = newType;
  searchValue.value = "";
  searchOptions.value = [];
};
const handleRedirect = (option) => {
  switch (searchType.value) {
    case "offer":
      router.push(`/create-offer/${option.key}`);
      break;
    case "user":
      router.push(`/users/${option.key}`);
      break;
    case "invoice":
      router.push(`/new-invoice/${option.key}`);
      break;

    default:
      router.push(`/new-edit-order/${option.key}`);
      break;
  }
  debugger;
};
const handleSearch = async (query: string | object) => {
  searchLoading.value = true;
  // Simulate API call
  await dashboardStore.fetchHeaderSearch(searchType.value, query);
  searchLoading.value = false;
};
</script>

<template>
  <header class="bg-white border-b border-gray-200">
    <div class="flex items-center justify-between mb-6 bg-[#1c3f52] p-4">
      <!-- Left side - Title, Icon Buttons, and Search -->
      <div class="flex items-center space-x-4 flex-wrap">
        <h1 class="text-2xl font-semibold text-white">
          {{ t("dashboard.header.title") }}
        </h1>

        <!-- Icon Buttons -->
        <div class="items-center space-x-1 sm:hidden md:flex">
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
        <div class="items-center space-x-0 ml-2 sm:hidden md:flex">
          <!-- Search Type Dropdown -->
          <select
            v-model="searchType"
            @change="handleSearchTypeChange(searchType)"
            class="px-3 py-3 text-sm font-medium bg-white bg-opacity-10 hover:bg-opacity-50 rounded-l-md transition-colors min-w-[100px] border-r-0 text-white h-full"
          >
            <option
              v-for="type in searchTypeOptions"
              :key="type"
              :value="type"
              class="text-black"
            >
              {{ t(`dashboard.header.search.${type}`) }}
            </option>
          </select>

          <!-- Search Input -->
          <div class="w-64">
            <AsyncSelect
              v-model="searchValue"
              :options="searchOptions"
              :placeholder="`${t(`dashboard.header.search.title`)} ${t(
                `dashboard.header.search.${searchType}`
              )}...`"
              :loading="searchLoading"
              @search="handleSearch"
              @update:model-value="handleRedirect($event)"
              class="bg-black bg-opacity-10 hover:bg-opacity-50"
            />
          </div>
        </div>
      </div>

      <!-- Right side - Create Order Button -->
      <div class="flex items-center">
        <NotificationButton />
        <CreateOrderButton />
      </div>
    </div>

    <!-- Search with Dropdown - Right next to icons -->
    <div class="items-center space-x-0 sm:flex md:hidden w-full m-2">
      <!-- Search Type Dropdown -->
      <select
        v-model="searchType"
        @change="handleSearchTypeChange(searchType)"
        class="px-3 py-2 text-sm font-medium bg-white bg-opacity-10 hover:bg-opacity-50 rounded-l-md transition-colors border-r-0 text-black h-full border border-gray-400 w-2/5"
      >
        <option v-for="type in searchTypeOptions" :key="type" :value="type">
          {{ t(`dashboard.header.search.${type}`) }}
        </option>
      </select>

      <!-- Search Input -->
      <div class="w-3/5">
        <AsyncSelect
          v-model="searchValue"
          :options="searchOptions"
          :placeholder="`${t(`dashboard.header.search.title`)} ${t(
            `dashboard.header.search.${searchType}`
          )}...`"
          :loading="searchLoading"
          @search="handleSearch"
          @update:model-value="handleRedirect($event)"
          class="bg-black bg-opacity-10 hover:bg-opacity-50"
        />
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="w-full flex sm:flex-col lg:flex-row gap-4 p-4">
      <!-- Total Value Card -->

      <!-- Status Cards -->
      <div
        v-for="widget in dashboardWidgets"
        :key="widget"
        class="bg-white rounded-lg p-2 shadow-lg border border-gray-100 flex-1"
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

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useOrderStore } from "@/stores/OrderStore";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { format } from "date-fns";

const { t } = useI18n();
const orderStore = useOrderStore();
const searchValue = ref("");

const filters = computed(() => orderStore.filters);

// Mock options for dropdowns
const orderStatusOptions = [
  { value: "", label: t("orders.filters.allOrderStatus") },
  { value: "pending", label: t("orders.status.pending") },
  { value: "in-progress", label: t("orders.status.inProgress") },
  { value: "completed", label: t("orders.status.completed") },
  { value: "cancelled", label: t("orders.status.cancelled") },
];

const orderCategoryOptions = [
  { value: "", label: t("orders.filters.allCategories") },
  { value: "development", label: t("orders.categories.development") },
  { value: "maintenance", label: t("orders.categories.maintenance") },
  { value: "consulting", label: t("orders.categories.consulting") },
  { value: "support", label: t("orders.categories.support") },
];

const projectManagerOptions = [
  "Manager 1",
  "Manager 2",
  "Manager 3",
  "Manager 4",
  "Manager 5",
];

const customerOptions = [
  "Customer 1",
  "Customer 2",
  "Customer 3",
  "Customer 4",
  "Customer 5",
];

const contactPersonOptions = [
  "Contact 1",
  "Contact 2",
  "Contact 3",
  "Contact 4",
  "Contact 5",
];

const handleFilterChange = (key: string, value: string) => {
  if (key === "startDate" || key === "endDate") {
    orderStore.setFilter(key as any, format(new Date(value), "yyyy-MM-dd"));
  } else if (key === "search") {
    onChange(value);
  } else {
    orderStore.setFilter(key as any, value);
  }
};

const onChange = (query: string) => {
  searchValue.value = query;
  setTimeout(() => {
    onSearch(query);
  }, 700);
};

const onSearch = (query: string) => {
  if (query === searchValue.value) {
    orderStore.setFilter("search", query);
  }
};

const clearAllFilters = () => {
  orderStore.clearFilters();
};
</script>

<template>
  <div class="bg-white border-r border-gray-200 p-6 w-full h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-medium text-gray-900">
        {{ t("orders.filters.title") }}
      </h2>
      <button
        @click="clearAllFilters"
        class="text-sm text-blue-600 hover:text-blue-800"
      >
        {{ t("orders.filters.clear") }}
      </button>
    </div>

    <div class="space-y-4">
      <!-- Search -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("orders.filters.search") }}
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
          :placeholder="t('orders.filters.searchPlaceholder')"
          class="input-field"
        />
      </div>

      <!-- Start Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("orders.filters.startDate") }}
        </label>
        <input
          type="date"
          :value="filters.startDate"
          @change="
            handleFilterChange(
              'startDate',
              ($event.target as HTMLInputElement).value
            )
          "
          class="input-field"
        />
      </div>

      <!-- End Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("orders.filters.endDate") }}
        </label>
        <input
          type="date"
          :value="filters.endDate"
          @change="
            handleFilterChange(
              'endDate',
              ($event.target as HTMLInputElement).value
            )
          "
          class="input-field"
        />
      </div>

      <!-- Order Status -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("orders.filters.orderStatus") }}
        </label>
        <select
          :value="filters.orderStatus"
          @change="
            handleFilterChange(
              'orderStatus',
              ($event.target as HTMLSelectElement).value
            )
          "
          class="input-field"
        >
          <option
            v-for="option in orderStatusOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Order Category -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("orders.filters.orderCategory") }}
        </label>
        <select
          :value="filters.orderCategory"
          @change="
            handleFilterChange(
              'orderCategory',
              ($event.target as HTMLSelectElement).value
            )
          "
          class="input-field"
        >
          <option
            v-for="option in orderCategoryOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Project Manager -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("orders.filters.projectManager") }}
        </label>
        <AsyncSelect
          :model-value="filters.projectManager"
          :options="projectManagerOptions"
          :placeholder="t('orders.filters.selectProjectManager')"
          :loading="false"
          @update:model-value="handleFilterChange('projectManager', $event)"
        />
      </div>

      <!-- Customer -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("orders.filters.customer") }}
        </label>
        <AsyncSelect
          :model-value="filters.customer"
          :options="customerOptions"
          :placeholder="t('orders.filters.selectCustomer')"
          :loading="false"
          @update:model-value="handleFilterChange('customer', $event)"
        />
      </div>

      <!-- Contact Person -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("orders.filters.contactPerson") }}
        </label>
        <AsyncSelect
          :model-value="filters.contactPerson"
          :options="contactPersonOptions"
          :placeholder="t('orders.filters.selectContactPerson')"
          :loading="false"
          @update:model-value="handleFilterChange('contactPerson', $event)"
        />
      </div>
    </div>
  </div>
</template>

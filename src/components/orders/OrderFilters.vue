<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useOrderStore } from "@/stores/OrderStore";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { format } from "date-fns";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";

const { t } = useI18n();
const orderStore = useOrderStore();
const searchValue = ref("");

const filters = computed(() => orderStore.filters);
const filtersData = computed(() => orderStore.defaultData);
const customerSearchLoading = ref(false);
const contactPersonSearchLoading = ref(false);

const handleFilterChange = (key: string, value: string | object) => {
  if (key === "startDate" || key === "endDate") {
    orderStore.setFilter(
      key as any,
      format(new Date(value as string), "yyyy-MM-dd")
    );
  } else if (key === "search") {
    onChange(value as string);
  } else if (key === "contactPerson") {
    orderStore.setFilter(key as any, value);
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
const handleCustomerSearch = async (customer) => {
  customerSearchLoading.value = true;
  await orderStore.fetchCustomers(customer);
  customerSearchLoading.value = false;
};
const handleContactPersonsSearch = async (contactPerson) => {
  contactPersonSearchLoading.value = true;
  await orderStore.fetchContactPersons(contactPerson);
  contactPersonSearchLoading.value = false;
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
      <div v-if="filtersData && filtersData.statuses">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("orders.filters.orderStatus") }}
        </label>
        <async-select
          :model-value="filters.orderStatus"
          :options="filtersData.statuses"
          :loading="false"
          :isMultiple="true"
          placeholder="Pick one or more"
          @update:model-value="handleFilterChange('orderStatus', $event)"
        />
        <!-- <select
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
            v-for="option in filtersData.statuses"
            :key="option.key"
            :value="option.value"
          >
            {{ option.value }}
          </option>
        </select> -->
      </div>

      <!-- Order Category -->
      <div v-if="filtersData && filtersData.categories">
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
            v-for="option in filtersData.categories"
            :key="option.key"
            :value="option.key"
          >
            {{ option.value }}
          </option>
        </select>
      </div>

      <!-- Project Manager -->
      <div v-if="filtersData && filtersData.managers">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("orders.filters.projectManager") }}
        </label>
        <async-select
          :model-value="filters.projectManager"
          :options="filtersData.managers"
          :placeholder="t('orders.filters.selectProjectManager')"
          :loading="false"
          @update:model-value="handleFilterChange('projectManager', $event)"
        />
      </div>

      <!-- Customer -->
      <div v-if="filtersData && filtersData.customers">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("orders.filters.customer") }}
        </label>
        <async-select
          :model-value="filters.customer"
          :options="filtersData.customers"
          :placeholder="t('orders.filters.selectCustomer')"
          :loading="customerSearchLoading"
          @search="handleCustomerSearch"
          @update:model-value="handleFilterChange('customer', $event)"
        />
      </div>

      <!-- Contact Person -->
      <div v-if="filtersData && filtersData.contactPersons">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("orders.filters.contactPerson") }}
        </label>
        <async-select
          :model-value="filters.contactPerson"
          :options="filtersData.contactPersons"
          :placeholder="t('orders.filters.selectContactPerson')"
          :loading="contactPersonSearchLoading"
          @search="handleContactPersonsSearch"
          @update:model-value="handleFilterChange('contactPerson', $event)"
        />
      </div>
    </div>
  </div>
</template>

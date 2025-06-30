<script setup lang="ts">
import { orderApi } from "@/api/orderApi";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { useTaskStore } from "@/stores/TaskStore";
const { t } = useI18n();
const showModal = ref(false);
const customerSearchLoading = ref(false);
const customer = ref<string | object>("");
const customers = ref([]);
const taskStore = useTaskStore();
const emit = defineEmits<{
  (e: "openSideBar"): void;
}>();

const handleCustomerSearch = async (query) => {
  await fetchCustomers(query);
};

const fetchCustomers = async (query) => {
  customerSearchLoading.value = true;
  const res = await orderApi.getCustomers(query);
  customers.value = res.results.map((customer) => {
    return {
      key: customer.id,
      value: `${customer.text}, ${customer.address}, ${customer.house_number}, ${customer.zip_code}`,
    };
  });

  customerSearchLoading.value = false;
};

const handleCreateOrder = async () => {
  await taskStore.createOrder(customer.value.key);
  emit("openSideBar");

  showModal.value = false;
};
const setCustomer = (selectedCustomer) => {
  customer.value = selectedCustomer;
};
const handleModal = () => {
  showModal.value = !showModal.value;
};
onMounted(() => {
  fetchCustomers("");
});
</script>

<template>
  <div class="w-full h-auto">
    <button
      @click="handleModal"
      class="w-full py-4 rounded-full bg-blue-200 text-blue-500 flex items-center justify-center relative"
    >
      <span class="absolute left-4 top-[50%] translate-y-[-50%] text-2xl"
        >+</span
      >
      <span>Create Order</span>
    </button>

    <div
      class="w-full h-auto relative transition-all ease-in-out py-2"
      v-show="showModal"
    >
      <div>
        <async-select
          :model-value="customer"
          :options="customers"
          :placeholder="t('orders.filters.selectCustomer')"
          :loading="customerSearchLoading"
          @search="handleCustomerSearch"
          @update:model-value="setCustomer($event)"
        />
      </div>
      <div class="flex gap-2">
        <button
          @click="handleCreateOrder"
          class="rounded-full w-2/4 bg-green-300 py-2 mt-4"
        >
          Create Order
        </button>
        <button
          @click="handleModal"
          class="rounded-full w-2/4 bg-red-300 py-2 mt-4"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

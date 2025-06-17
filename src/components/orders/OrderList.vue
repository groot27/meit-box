<script setup lang="ts">
import { onMounted } from "vue";
import { useOrderStore } from "@/stores/OrderStore";
import OrderHeader from "./OrderHeader.vue";
import OrderFilters from "./OrderFilters.vue";
import OrderTable from "./OrderTable.vue";
import TopBarLoading from "@/components/widgets/TopBarLoading.vue";

const orderStore = useOrderStore();

onMounted(() => {
  orderStore.loadOrders();
});
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <OrderHeader />

    <div class="flex-1 flex overflow-hidden relative">
      <top-bar-loading />
      <div class="w-1/6">
        <OrderFilters />
      </div>
      <div class="w-5/6">
        <OrderTable />
      </div>
    </div>
  </div>
</template>

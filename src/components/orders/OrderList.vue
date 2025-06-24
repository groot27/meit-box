<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useOrderStore } from "@/stores/OrderStore";
import OrderHeader from "./OrderHeader.vue";
import OrderFilters from "./OrderFilters.vue";
import OrderTable from "./OrderTable.vue";
import TopBarLoading from "@/components/widgets/TopBarLoading.vue";
import { useGlobalStore } from "@/stores/index";

const orderStore = useOrderStore();
const globalStore = useGlobalStore();
const leftSideDisplay = computed(() => orderStore.leftSideDisplay);
onMounted(async () => {
  await orderStore.loadOrdersHeader();
  await orderStore.loadDefaultData();
  orderStore.loadOrders();
});
</script>

<template>
  <div
    class="h-screen flex flex-col bg-gray-50"
    :class="
      globalStore.loadingApi ? 'pointer-events-none' : 'pointer-events-auto'
    "
  >
    <!-- <OrderHeader /> -->

    <div class="flex-1 flex overflow-hidden relative">
      <top-bar-loading />
      <div
        :class="[
          'transition-all duration-300 ease-in-out overflow-hidden',
          leftSideDisplay ? 'w-1/6' : 'w-0',
        ]"
      >
        <OrderFilters />
      </div>
      <div :class="leftSideDisplay ? 'w-5/6' : 'w-full'">
        <OrderTable />
      </div>
    </div>
  </div>
</template>

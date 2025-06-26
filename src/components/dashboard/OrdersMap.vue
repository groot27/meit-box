<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import DashboardHeader from "./DashboardHeader.vue";
import MapFilters from "./MapFilters.vue";
import TopBarLoading from "@/components/widgets/TopBarLoading.vue";
import GoogleMap from "./GoogleMap.vue";
import PinnedOrderTable from "./PinnedOrderTable.vue";
import { useOrderStore } from "@/stores/OrderStore";
import OrderFilters from "../orders/OrderFilters.vue";
import { useGlobalStore } from "@/stores/index";

const orderStore = useOrderStore();
const globalStore = useGlobalStore();
const leftSideDisplay = computed(() => orderStore.leftSideDisplay);
// const leftSideDisplay = ref(false);

onMounted(async () => {
  await orderStore.loadDefaultData();
  orderStore.setOrderForMap(true);
  await orderStore.loadPinnedOrders();
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
    <DashboardHeader />

    <div class="flex-1 flex overflow-hidden relative min-h-screen">
      <top-bar-loading />
      <div
        :class="[
          'transition-all duration-300 ease-in-out overflow-hidden',
          leftSideDisplay ? 'w-1/6' : 'w-0',
        ]"
      >
        <OrderFilters />
      </div>
      <div
        :class="leftSideDisplay ? 'w-5/6' : 'w-full'"
        class="flex flex-col verflow-hidden h-screen"
      >
        <div class="flex overflow-hidden h-screen">
          <GoogleMap />
        </div>
        <div class="flex h-full">
          <PinnedOrderTable />
        </div>
      </div>
    </div>
  </div>
</template>

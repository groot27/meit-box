<script setup lang="ts">
import { onMounted } from 'vue';
import { useOrderStore } from '@/stores/OrderStore';
import OrderHeader from './OrderHeader.vue';
import OrderFilters from './OrderFilters.vue';
import OrderTable from './OrderTable.vue';

const orderStore = useOrderStore();

onMounted(() => {
  orderStore.loadOrders();
});
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <OrderHeader />
    
    <div class="flex-1 flex overflow-hidden">
      <OrderFilters />
      <OrderTable />
    </div>
  </div>
</template>
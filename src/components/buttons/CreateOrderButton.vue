<script setup lang="ts">
import { useOrderStore } from "@/stores/OrderStore";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const orderStore = useOrderStore();
const router = useRouter();

const handleCreateOrder = async () => {
  const orderId = await orderStore.create();
  router.push(`/new-edit-order/${orderId}`);
};
</script>
<template>
  <button
    @click="handleCreateOrder"
    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
  >
    {{ t("orders.header.createOrder") }}
  </button>
</template>

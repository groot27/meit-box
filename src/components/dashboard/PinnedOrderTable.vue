<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useOrderStore } from "@/stores/OrderStore";
import { format } from "date-fns";
import { useRouter } from "vue-router";
import BaseModal from "@/components/widgets/BaseModal.vue";

const { t } = useI18n();
const orderStore = useOrderStore();
const router = useRouter();
const showRemoveModal = ref(false);
const selectedOrderId = ref(null);

const orders = computed(() => orderStore.pinnedOrders);
const visibleColumns = ref([
  "order_number",
  "order_location",
  "get_customer",
  "start_date",
  "end_date",
]);
const handlePin = (id) => {
  orderStore.togglePinOrder(id);
};
const handleEdit = (id) => {
  router.push(`/new-edit-order/${id}`);
};
const handleRemove = () => {
  showRemoveModal.value = !showRemoveModal.value;
  orderStore.removeOrder(selectedOrderId.value);
  selectedOrderId.value = null;
};
const handleShowMRemoveModal = (orderId = null) => {
  selectedOrderId.value = orderId;
  showRemoveModal.value = !showRemoveModal.value;
};
</script>

<template>
  <h3 class="font-semibold text-2xl mt-4 ml-4">
    {{ t("dashboard.pinnedOrders") }}
  </h3>
  <div class="flex-1 flex flex-col h-full w-full border border-1">
    <!-- Table Container with Horizontal Scroll -->
    <div class="flex-1 max-w-full overflow-scroll">
      <div class="min-w-full">
        <table class="w-full divide-y divide-gray-200 table-fixed min-w-full">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th
                v-for="column in visibleColumns"
                :key="column"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-r border-gray-200 last:border-r-0 w-48"
              >
                <div class="flex items-center space-x-1">
                  <span class="truncate">{{
                    t(`orders.table.headers.${column}`)
                  }}</span>
                  <div class="flex flex-col flex-shrink-0"></div>
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-r border-gray-200 last:border-r-0 w-48"
                key="actions"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200" v-if="orders">
            <tr v-for="order in orders" class="hover:bg-gray-50 transition-all">
              <td
                v-for="column in visibleColumns"
                :key="column"
                class="px-2 text-sm border-r border-gray-100 last:border-r-0 w-full"
              >
                <!-- Default -->
                <span
                  class="text-gray-900 block truncate"
                  :title="String(order[column])"
                >
                  {{ order[column] }}
                </span>
              </td>
              <td
                class="px-6 py-4 text-sm border-r border-gray-100 last:border-r-0 gap-2 flex"
              >
                <button
                  @click="() => handlePin(order.id)"
                  :class="`p-2 rounded-lg bg-purple-200 ${
                    order.isPinned ? 'text-purple-800' : 'text-purple-300'
                  }`"
                >
                  <font-awesome-icon :icon="['fas', 'thumb-tack']" />
                </button>
                <button
                  @click="handleEdit(order.id)"
                  class="p-2 rounded-lg bg-blue-200 text-blue-500"
                >
                  <font-awesome-icon :icon="['fas', 'pencil']" />
                </button>
              </td>
            </tr>
            <span class="text-center my-4" v-if="!orders.length">{{
              t("common.ordersEmpty")
            }}</span>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <BaseModal v-model="showRemoveModal">
    <h2 class="text-xl font-bold mb-2 text-center text-gray-600">Warning</h2>
    <p class="text-center m-4">Are You Sure ?</p>
    <div class="flex w-full gap-4 items-center justify-center">
      <button
        class="w-1/3 text-center p-2 bg-blue-500 text-white rounded-lg"
        @click="handleRemove"
      >
        Yes
      </button>
      <button
        class="absolute top-2 right-2 text-center text-black rounded-lg"
        @click="handleShowMRemoveModal"
      >
        X
      </button>
    </div>
  </BaseModal>
</template>

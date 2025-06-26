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

const showColumnSelector = ref(false);
const showRemoveModal = ref(false);
const selectedOrderId = ref(null);
const inquiryFilterSelected = computed(() => orderStore.inquiryFilterSelected);

const orders = computed(() => orderStore.filteredOrders);
const visibleColumns = computed(() => orderStore.visibleColumns);
const pagination = computed(() => orderStore.pagination);
const sort = computed(() => orderStore.sort);
const tableColumns = computed(() => orderStore.tableColumns);
const tableColumnsCount = computed(() => {
  let count = 0;
  if (orderStore.tableColumns.length) {
    orderStore.tableColumns.forEach((item) => {
      if (item.visible) {
        count++;
      }
    });
  }
  return count;
});
const leftSideDisplay = computed(() => orderStore.leftSideDisplay);

const itemsPerPageOptions = [10, 20, 30, 40, 50];

const handleSort = (field: string) => {
  orderStore.setSort(field as any);
};

const handlePageChange = (page: number) => {
  orderStore.setPage(page);
};

const handleItemsPerPageChange = (itemsPerPage: number) => {
  orderStore.setItemsPerPage(itemsPerPage);
};

const toggleColumnVisibility = (columnKey: string) => {
  orderStore.toggleColumnVisibility(columnKey as any);
};

const handleExport = () => {
  orderStore.exportTable();
};

const handleFilterDiplay = () => {
  orderStore.toggleLeftSideDisplay();
};

const handleInquiryFilter = () => {
  orderStore.setInquiryFilter();
};

const handleTaskOrdersClick = () => {
  router.push(`/order-tasks/`);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMM d, yyyy");
};

const getStatusColor = (status: string) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const getPriorityColor = (priority: string) => {
  const colors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };
  return colors[priority] || "bg-gray-100 text-gray-800";
};

// Calculate visible page numbers for pagination
const visiblePages = computed(() => {
  const current = pagination.value.currentPage;
  const total = pagination.value.totalPages;
  const delta = 2; // Number of pages to show on each side of current page

  let start = Math.max(1, current - delta);
  let end = Math.min(total, current + delta);

  // Adjust if we're near the beginning or end
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4);
    } else if (end === total) {
      start = Math.max(1, end - 4);
    }
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const handlePin = (id) => {
  orderStore.togglePinOrder(id);
};
const handleCopy = (id) => {
  router.push(`/duplicate-order/${id}`);
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
  <div class="flex-1 flex flex-col h-full w-full">
    <!-- Table Header Actions -->
    <div
      class="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 w-full"
    >
      <div class="flex items-center justify-between">
        <!-- Left side - Action buttons -->
        <div class="flex items-center space-x-2">
          <button
            @click="handleFilterDiplay"
            :class="[
              'p-2  hover:bg-gray-100 rounded-lg transition-colors border border-1',
              leftSideDisplay
                ? 'text-green-500 border-green-500'
                : 'text-gray-600 border-gray-600',
            ]"
            :title="t('orders.table.filter')"
          >
            <font-awesome-icon icon="fa-solid fa-list-check" class="w-4 h-4" />
          </button>
          <button
            @click="handleInquiryFilter"
            :class="[
              'p-2  hover:bg-gray-100 rounded-lg transition-colors border border-1',
              inquiryFilterSelected
                ? 'text-green-500 border-green-500'
                : 'text-gray-600 border-gray-600',
            ]"
          >
            <font-awesome-icon icon="fa-solid fa-file-lines" class="w-4 h-4" />
          </button>
          <button
            @click="handleTaskOrdersClick"
            class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          >
            <font-awesome-icon
              icon="fa-solid fa-file-circle-plus"
              class="w-4 h-4"
            />
          </button>
        </div>

        <!-- Right side - Export and Column selector -->
        <div class="flex items-center space-x-4">
          <button
            @click="handleExport"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex gap-2 items-center"
          >
            <font-awesome-icon icon="fa-solid fa-cloud-arrow-down" />{{
              t("orders.table.export")
            }}
          </button>

          <!-- Column Selector -->
          <div class="relative">
            <button
              @click="showColumnSelector = !showColumnSelector"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <span
                >{{ t("orders.table.columns") }}
                {{ ` +${tableColumnsCount}` }}</span
              >
              <font-awesome-icon
                icon="fa-solid fa-chevron-down"
                class="w-3 h-3 transition-transform"
                :class="{ 'rotate-180': showColumnSelector }"
              />
            </button>

            <!-- Column Selector Dropdown -->
            <div
              v-if="showColumnSelector"
              class="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-80 overflow-y-auto"
            >
              <div class="p-4">
                <h3 class="text-sm font-medium text-gray-900 mb-3">
                  {{ t("orders.table.selectColumns") }}
                </h3>
                <div class="space-y-2">
                  <label
                    v-for="column in tableColumns"
                    :key="column.key"
                    class="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :checked="column.visible"
                      @change="toggleColumnVisibility(column.key)"
                      class="rounded border-gray-300"
                    />
                    <span class="text-sm text-gray-700">{{
                      t(`orders.table.headers.${column.key}`)
                    }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Container with Horizontal Scroll -->
    <div class="flex-1 max-w-full overflow-scroll">
      <div class="min-w-full">
        <table class="w-full divide-y divide-gray-200 table-fixed min-w-full">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th
                v-for="column in visibleColumns"
                :key="column.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-r border-gray-200 last:border-r-0 w-48"
                @click="column.sortable && handleSort(column.key)"
              >
                <div class="flex items-center space-x-1">
                  <span class="truncate">{{
                    t(`orders.table.headers.${column.key}`)
                  }}</span>
                  <div
                    v-if="column.sortable"
                    class="flex flex-col flex-shrink-0"
                  >
                    <font-awesome-icon
                      icon="fa-solid fa-chevron-up"
                      class="w-2 h-2"
                      :class="{
                        'text-blue-600':
                          sort.field === column.key && sort.direction === 'asc',
                        'text-gray-400':
                          sort.field !== column.key || sort.direction !== 'asc',
                      }"
                    />
                    <font-awesome-icon
                      icon="fa-solid fa-chevron-down"
                      class="w-2 h-2"
                      :class="{
                        'text-blue-600':
                          sort.field === column.key &&
                          sort.direction === 'desc',
                        'text-gray-400':
                          sort.field !== column.key ||
                          sort.direction !== 'desc',
                      }"
                    />
                  </div>
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
                :key="column.key"
                class="px-2 text-sm border-r border-gray-100 last:border-r-0 w-full"
              >
                <!-- Order Number -->
                <span
                  v-if="column.key === 'orderNumber'"
                  class="font-medium text-blue-600 hover:text-blue-800 cursor-pointer truncate block"
                >
                  {{ order[column.key] }}
                </span>

                <!-- Status -->
                <span
                  v-else-if="column.key === 'orderStatus'"
                  class="inline-flex px-2 py-1 text-sm font-semibold rounded-full whitespace-nowrap"
                  :class="getStatusColor(order[column.key])"
                >
                  {{ t(`orders.status.${order[column.key]}`) }}
                </span>

                <!-- Priority -->
                <span
                  v-else-if="column.key === 'priority'"
                  class="inline-flex px-2 py-1 text-sm font-semibold rounded-full whitespace-nowrap"
                  :class="getPriorityColor(order[column.key])"
                >
                  {{ t(`orders.priority.${order[column.key]}`) }}
                </span>

                <!-- Total Amount -->
                <span
                  v-else-if="column.key === 'totalAmount'"
                  class="font-medium text-gray-900 whitespace-nowrap"
                >
                  {{ formatCurrency(order[column.key]) }}
                </span>

                <!-- Dates -->
                <span
                  v-else-if="
                    column.key === 'startDate' ||
                    column.key === 'endDate' ||
                    column.key === 'createdAt' ||
                    column.key === 'updatedAt'
                  "
                  class="text-gray-500 whitespace-nowrap"
                >
                  {{ formatDate(order[column.key]) }}
                </span>

                <!-- Progress -->
                <div
                  v-else-if="column.key === 'progress'"
                  class="flex items-center space-x-2"
                >
                  <div class="flex-1 bg-gray-200 rounded-full h-2 min-w-0">
                    <div
                      class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${order[column.key]}%` }"
                    ></div>
                  </div>
                  <span
                    class="text-xs text-gray-500 whitespace-nowrap flex-shrink-0"
                    >{{ order[column.key] }}%</span
                  >
                </div>

                <!-- Description -->
                <div
                  v-else-if="column.key === 'description'"
                  class="text-gray-900"
                >
                  <span class="block truncate" :title="order[column.key]">
                    {{ order[column.key] }}
                  </span>
                </div>

                <!-- Default -->
                <span
                  v-else
                  class="text-gray-900 block truncate"
                  :title="String(order[column.key])"
                >
                  {{ order[column.key] }}
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
                  @click="handleCopy(order.id)"
                  class="p-2 rounded-lg bg-green-200 text-green-500"
                >
                  <font-awesome-icon :icon="['fas', 'copy']" />
                </button>
                <button
                  @click="handleEdit(order.id)"
                  class="p-2 rounded-lg bg-blue-200 text-blue-500"
                >
                  <font-awesome-icon :icon="['fas', 'pencil']" />
                </button>
                <button
                  @click="handleShowMRemoveModal(order.id)"
                  class="p-2 rounded-lg bg-red-200 text-red-500"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
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

    <!-- Pagination -->
    <div class="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
      <div class="flex items-center justify-between">
        <!-- Left side - Items per page and showing info -->
        <div class="flex items-center space-x-4">
          <!-- Items per page selector -->
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-700 whitespace-nowrap"
              >{{ t("orders.table.itemsPerPage") }}:</label
            >
            <select
              :value="pagination.itemsPerPage"
              @change="
                handleItemsPerPageChange(
                  parseInt(($event.target as HTMLSelectElement).value)
                )
              "
              class="border border-gray-300 rounded px-2 py-1 text-sm w-16"
            >
              <option
                v-for="option in itemsPerPageOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>

          <!-- Showing info -->
          <div class="text-sm text-gray-700 whitespace-nowrap">
            {{ t("orders.table.showing") }}
            <span class="font-medium">{{
              (pagination.currentPage - 1) * pagination.itemsPerPage + 1
            }}</span>
            {{ t("orders.table.to") }}
            <span class="font-medium">{{
              Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )
            }}</span>
            {{ t("orders.table.of") }}
            <span class="font-medium">{{ pagination.totalItems }}</span>
            {{ t("orders.table.results") }}
          </div>
        </div>

        <!-- Right side - Page navigation -->
        <div class="flex items-center space-x-2">
          <button
            @click="handlePageChange(pagination.currentPage - 1)"
            :disabled="pagination.currentPage === 1"
            class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t("orders.table.previous") }}
          </button>

          <!-- First page -->
          <button
            v-if="visiblePages[0] > 1"
            @click="handlePageChange(1)"
            class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            1
          </button>

          <!-- Ellipsis before -->
          <span
            v-if="visiblePages[0] > 2"
            class="px-2 py-1 text-sm text-gray-500"
          >
            ...
          </span>

          <!-- Visible page numbers -->
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="handlePageChange(page)"
            class="px-3 py-1 text-sm font-medium rounded-md"
            :class="{
              'bg-blue-600 text-white': pagination.currentPage === page,
              'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50':
                pagination.currentPage !== page,
            }"
          >
            {{ page }}
          </button>

          <!-- Ellipsis after -->
          <span
            v-if="
              visiblePages[visiblePages.length - 1] < pagination.totalPages - 1
            "
            class="px-2 py-1 text-sm text-gray-500"
          >
            ...
          </span>

          <!-- Last page -->
          <button
            v-if="visiblePages[visiblePages.length - 1] < pagination.totalPages"
            @click="handlePageChange(pagination.totalPages)"
            class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {{ pagination.totalPages }}
          </button>

          <button
            @click="handlePageChange(pagination.currentPage + 1)"
            :disabled="pagination.currentPage === pagination.totalPages"
            class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t("orders.table.next") }}
          </button>
        </div>
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

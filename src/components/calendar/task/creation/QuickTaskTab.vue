<script setup lang="ts">
import { taskApi } from "@/api/taskApi";
import { ref, computed, onMounted, watch } from "vue";

import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { useI18n } from "vue-i18n";
import { stripHtml } from "@/utils/utils";
import { useCalendarStore } from "@/stores/CalendarStore";
import { format } from "date-fns";
import { useTaskStore } from "@/stores/TaskStore";

const { t } = useI18n();
const porps = defineProps<{
  date: any | null | undefined;
}>();
const emit = defineEmits<{
  (
    e: "continueToEdit",
    taskData: { order: string; taskTitle: string; description: string }
  ): void;
  (
    e: "saveTask",
    event: Event,
    taskData: { order: string; taskTitle: string; description: string }
  ): void;
}>();

const description = ref("");
const orderId = ref("");
const calendarStore = useCalendarStore();
const taskStore = useTaskStore();

const selectedOrder = ref("");
const selectedTask = ref("");
const orderOptions = ref<string[]>([]);
const orderLoading = ref(false);
const taskOptions = ref<string[]>([]);
const taskLoading = ref(false);
const taskTemplates = ref({});
const taskOrders = ref({});
const taskDetails = ref({});
const orderDetails = ref({});

const isValid = computed(() => selectedOrder.value && selectedTask.value);

const handleContinue = () => {
  if (isValid.value) {
    emit("continueToEdit", {
      date: format(porps.date, "yyyy-MM-dd"),
    });
  }
};

const handleSubmit = (event: Event) => {
  if (isValid.value) {
    emit("saveTask", event, {
      taskTitle: selectedTask.value,
      description: description.value,
      taskTemplate: taskDetails.value,
      orderDetails: orderDetails.value,
    });
  }
};
const fetchOrderOptions = async (query: string = "") => {
  orderLoading.value = true;
  try {
    const res = await taskApi.getTaskOrders(query);
    orderOptions.value = [];
    taskOrders.value = res.data;
    calendarStore.defaultData.orders = res.data;
    res?.data.forEach((order) => {
      orderOptions.value.push(
        `${order.order_number} | ${
          order.order_location || "No Location Set"
        } | ${order.customer_name || "No Customer"}`
      );
    });
  } finally {
    orderLoading.value = false;
  }
};

const fetchTaskOptions = async (query: string = "") => {
  taskLoading.value = true;
  try {
    const res = await taskApi.getTaskTitles(query);
    taskOptions.value = [];
    taskTemplates.value = res.data;
    calendarStore.defaultData.taskTemplates = res.data;
    res?.data.forEach((template) => {
      taskOptions.value.push(template.task_title);
    });
  } finally {
    taskLoading.value = false;
  }
};

const fillDescription = () => {
  Object.keys(taskTemplates.value).forEach((template) => {
    if (taskTemplates.value[template].task_title === selectedTask.value) {
      description.value = stripHtml(
        taskTemplates.value[template].task_description
      );
      taskStore.setTaskTemplate(taskTemplates.value[template].id);
    }
  });
};
onMounted(() => {
  taskOptions.value = calendarStore.defaultData.taskTemplates.map(
    (template) => {
      return template.task_title;
    }
  );
  taskTemplates.value = calendarStore.defaultData.taskTemplates;

  orderOptions.value = calendarStore.defaultData.orders.map((order) => {
    return `${order.order_number} | ${
      order.order_location || "No Location Set"
    } | ${order.customer_name || "No Customer"}`;
  });
  taskOrders.value = calendarStore.defaultData.orders;
});

watch(selectedTask, () => {
  console.log("🚀 ~ watch ~ selectedTask:", selectedTask);
  if (selectedTask) {
    fillDescription();
  }
});

watch(selectedOrder, () => {
  if (selectedOrder) {
    Object.keys(taskOrders.value).forEach((order) => {
      if (
        taskOrders.value[order].order_number ==
        selectedOrder.value.split("|")[0].trim()
      ) {
        taskStore.setOrderDetails(taskOrders.value[order].id);
      }
    });
  }
});
</script>

<template>
  <div class="space-y-4">
    <async-select
      v-model="selectedOrder"
      :options="orderOptions"
      :placeholder="t('task.modal.sections.taskDetails.order')"
      :loading="orderLoading"
      @search="fetchOrderOptions"
    />
    <async-select
      v-model="selectedTask"
      :options="taskOptions"
      :placeholder="t('task.modal.sections.taskDetails.taskTitle')"
      :loading="taskLoading"
      @search="fetchTaskOptions"
    />

    <textarea
      v-model="description"
      rows="3"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-3 px-4"
      :placeholder="t('task.modal.sections.taskDetails.description')"
    ></textarea>

    <button
      @click="handleContinue"
      type="button"
      :disabled="!isValid"
      class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ t("task.modal.continueToCreate") }}
    </button>

    <button
      type="submit"
      :disabled="!isValid"
      @click="(event) => handleSubmit(event)"
      class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ t("task.modal.save") }}
    </button>
  </div>
</template>

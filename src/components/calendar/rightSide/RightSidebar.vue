<script setup lang="ts">
import { taskApi } from "@/api/taskApi";
import { useCalendarStore } from "@/stores/CalendarStore";
import { useGlobalStore } from "@/stores/index";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const tasks = ref(null);
const router = useRouter();
const calendarStore = useCalendarStore();
const globalStore = useGlobalStore();
const pageNumber = ref(1);
const lastPage = ref(1);
const search = ref("");

const handelChange = (event) => {
  search.value = event.target.value;
  let searched = event.target.value;
  setTimeout(() => {
    handelSearch(searched);
  }, 1000);
};

const handelSearch = (query) => {
  if (query === search.value) {
    getTasks();
  }
};
const getTasks = () => {
  globalStore.setLoadingApi(true);
  const onSuccess = (res) => {
    const tasksComming = res.data.map((task) => {
      return {
        id: task.id,
        type: task.task_title,
        customer: task.customer_name || "Not set",
        orderNumber: task.order_number || "Not set",
      };
    });
    lastPage.value = res.meta.last_page;
    if (pageNumber.value === 1) {
      tasks.value = tasksComming;
    } else {
      tasks.value = [...tasks.value, ...tasksComming];
    }
    globalStore.setLoadingApi(false);
  };
  taskApi.getUpcommingTasks(
    `per_page=20&page=${pageNumber.value}&search=${search.value}`,
    {
      onSuccess,
    }
  );
};
const showTaskEdit = (taskId) => {
  calendarStore.setUpCommingTaskDisplay(false);
  router.push(`/monthly-view2/${taskId}`);
};
const handelLoadMore = () => {
  pageNumber.value += 1;
  getTasks();
};
onMounted(() => {
  getTasks();
});
</script>

<template>
  <div class="w-full bg-white space-y-4 overflow-y-auto max-h-full">
    <input
      type="search"
      :placeholder="t('calendar.upcoming.search')"
      class="text-sm p-2 border border-gray-300 w-full rounded-lg"
      @input="handelChange"
    />
    <h2 class="text-xl font-semibold mb-4 bg-gray-100 p-2 rounded-lg">
      {{ t("calendar.upcoming.title") }}
    </h2>

    <table class="min-w-full text-sm">
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2 text-left border-b border-gray-300">
            {{ t("calendar.upcoming.type") }}
          </th>
          <th class="px-4 py-2 text-left border-b border-gray-300">
            {{ t("calendar.upcoming.customer") }}
          </th>
          <th class="px-4 py-2 text-left border-b border-gray-300">
            {{ t("calendar.upcoming.orderNumber") }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="task in tasks"
          :key="task.id"
          @click="showTaskEdit(task.id)"
          class="cursor-pointer"
        >
          <td class="px-4 py-2 border-b border-gray-200">{{ task.type }}</td>
          <td class="px-4 py-2 border-b border-gray-200">
            {{ task.customer }}
          </td>
          <td class="px-4 py-2 border-b border-gray-200">
            {{ task.orderNumber }}
          </td>
        </tr>
      </tbody>
    </table>
    <span
      v-if="lastPage > 1"
      class="text-blue-500 cursor-pointer text-sm"
      @click="handelLoadMore"
      >{{ t("calendar.upcoming.loadMore") }}</span
    >
  </div>
</template>

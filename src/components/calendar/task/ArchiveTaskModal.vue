<script setup lang="ts">
import { useCalendarStore } from "@/stores/CalendarStore";
import { useTaskStore } from "@/stores/TaskStore";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const taskStore = useTaskStore();
const calendarStore = useCalendarStore();
const showArchiveConfirm = computed(() => taskStore.archiveModalDispay);
const archived = computed(() => calendarStore.filterTasks);

const handleArchiveConfirm = () => {
  taskStore.deleteTask(
    route.params.taskId as string,
    calendarStore.filterTasks !== "archive_date" ? "archive" : "restore"
  );
};
const handleArchiveClose = () => {
  // send api
  taskStore.setArchiveModalDispay(false);
};
</script>

<template>
  <div
    v-if="showArchiveConfirm"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
  >
    <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        <span v-show="calendarStore.filterTasks !== 'archive_date'">
          {{ t('task.archiveModal.archive') }}
        </span>
        <span v-show="calendarStore.filterTasks === 'archive_date'">
          {{ t('task.archiveModal.restore') }}
        </span>
      </h3>
      <div class="flex justify-end space-x-3">
        <button
          @click="handleArchiveClose"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          {{ t('task.archiveModal.no') }}
        </button>
        <button
          @click="handleArchiveConfirm"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {{ t('task.archiveModal.yes') }}
        </button>
      </div>
    </div>
  </div>
</template>
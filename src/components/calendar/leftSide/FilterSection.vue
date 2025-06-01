<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useCalendarStore } from "@/stores/CalendarStore";
import { filterTasksType } from "@/types/filters";

const { t } = useI18n();
const calendarStore = useCalendarStore();

const selected = ref<string | null>(null);

function handleClick(key: string) {
  if (selected.value === key) {
    selected.value = null;
    calendarStore.setFilter("");
  } else {
    selected.value = key;
    calendarStore.setFilter(key as filterTasksType);
  }
}
</script>

<template>
  <div class="my-2">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ t("leftSidebar.filter.title") }}
    </label>
    <div class="flex justify-between">
      <button
        :class="[
          'p-2 rounded  hover:scale-125',
          selected === 'applied_users' ? 'bg-green-300' : 'bg-gray-50',
        ]"
        :title="t('leftSidebar.filter.appliedUsers')"
        @click="handleClick('applied_users')"
      >
        <font-awesome-icon icon="fa-solid fa-user-tie" class="text-gray-500" />
      </button>

      <button
        :class="[
          'p-2 rounded bg-gray-50 hover:scale-125',
          selected === 'task_without_user' ? 'bg-green-300' : 'bg-gray-50',
        ]"
        :title="t('leftSidebar.filter.missingUsers')"
        @click="handleClick('task_without_user')"
      >
        <font-awesome-icon
          icon="fa-solid fa-user-minus"
          class="text-gray-500"
        />
      </button>

      <button
        :class="[
          'p-2 rounded bg-gray-50 hover:scale-125',
          selected === 'admin_permission' ? 'bg-green-300' : 'bg-gray-50',
        ]"
        :title="t('leftSidebar.filter.confirmed')"
        @click="handleClick('admin_permission')"
      >
        <font-awesome-icon icon="fa-solid fa-eye" class="text-gray-500" />
      </button>

      <button
        :class="[
          'p-2 rounded bg-gray-50 hover:scale-125',
          selected === 'archive_date' ? 'bg-green-300' : 'bg-gray-50',
        ]"
        :title="t('leftSidebar.filter.trash')"
        @click="handleClick('archive_date')"
      >
        <font-awesome-icon icon="fa-solid fa-trash " class="text-gray-500" />
      </button>
    </div>
  </div>
</template>

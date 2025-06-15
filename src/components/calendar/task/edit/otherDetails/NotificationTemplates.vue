<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { taskApi } from "@/api/taskApi";
import { useI18n } from "vue-i18n";
import { useCalendarStore } from "@/stores/CalendarStore";

const { t } = useI18n();
const calendarStore = useCalendarStore();

const props = defineProps<{
  modelValue: string | null | undefined;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const selectedNotificationTemplates = ref(props.modelValue ?? "");
const notificationtemplatesLoading = ref(false);
const notificationtemplatesOptions = ref<string[]>([]);

const fetchNotificationTemplatesOptions = async (query: string = "") => {
  notificationtemplatesLoading.value = true;
  try {
    const res = await taskApi.getTaskNotificationTemplates(query);
    notificationtemplatesOptions.value = res.data.map(
      (template) => template.template_name
    );
  } finally {
    notificationtemplatesLoading.value = false;
  }
};

// Sync parent -> local
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== selectedNotificationTemplates.value) {
      selectedNotificationTemplates.value = newVal ?? "";
    }
  }
);

// Sync local -> parent
watch(selectedNotificationTemplates, (val) => {
  emit("update:modelValue", val);
});

onMounted(() => {
  notificationtemplatesOptions.value =
    calendarStore.defaultData.notifications.map(
      (template) => template.template_name
    );
});
</script>

<template>
  <async-select
    v-model="selectedNotificationTemplates"
    :options="notificationtemplatesOptions"
    :placeholder="t('common.placeholder.notificationTemplate')"
    :loading="notificationtemplatesLoading"
    @search="fetchNotificationTemplatesOptions"
  />
</template>

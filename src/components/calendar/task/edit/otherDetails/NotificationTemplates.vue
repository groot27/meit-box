<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { taskApi } from "@/api/taskApi";
import { useI18n } from "vue-i18n";
import { useCalendarStore } from "@/stores/CalendarStore";

const { t } = useI18n();
const calendarStore = useCalendarStore();
const props = defineProps<{
  notification: string;
}>();

const emit = defineEmits<{
  (e: "update", selectedNotificationTemplates);
}>();

const selectedNotificationTemplates = ref("");
const notificationtemplatesLoading = ref(false);
const notificationtemplatesOptions = ref<string[]>([]);
const notificationData = ref(null);
const fetchNotificationTemplatesOptions = async (query: string = "") => {
  notificationtemplatesLoading.value = true;
  try {
    const res = await taskApi.getTaskNotificationTemplates(query);
    notificationtemplatesOptions.value = res.data.map(
      (notificationtemplates) => notificationtemplates.template_name
    );
    notificationData.value = res.data;
  } finally {
    notificationtemplatesLoading.value = false;
  }
};
watch(selectedNotificationTemplates, () => {
  if (selectedNotificationTemplates) {
    emit("update", selectedNotificationTemplates);
  }
});
onMounted(() => {
  notificationtemplatesOptions.value =
    calendarStore.defaultData.notifications.map(
      (notificationtemplates) => notificationtemplates.template_name
    );
});
watch(
  () => props.notification,
  async (newNotification) => {
    if (newNotification !== selectedNotificationTemplates.value) {
      notificationData.value.forEach((item) => {
        if (item.id == newNotification) {
          selectedNotificationTemplates.value = item.template_name;
        }
      });
    }
  },
  { immediate: true } // Fire once on component mount
);
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

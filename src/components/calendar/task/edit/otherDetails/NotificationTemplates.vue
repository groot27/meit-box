<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { taskApi } from "@/api/taskApi";

// const props = defineProps<{
//   notificationtemplates: string;
//   notificationtemplatess: any;
// }>();
const emit = defineEmits<{
  (e: "update", selectedNotificationTemplates);
}>();

const selectedNotificationTemplates = ref("");
const notificationtemplatesLoading = ref(false);
const notificationtemplatesOptions = ref<string[]>([]);
const fetchNotificationTemplatesOptions = async (query: string = "") => {
  notificationtemplatesLoading.value = true;
  try {
    const res = await taskApi.getTaskNotificationTemplates(query);
    notificationtemplatesOptions.value = res.data.map(
      (notificationtemplates) => notificationtemplates.template_name
    );
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
  fetchNotificationTemplatesOptions();
  // if (props.notificationtemplatess) {
  //   selectedNotificationTemplates.value = props.notificationtemplates;
  //   notificationtemplatesOptions.value = props.notificationtemplatess.map((notificationtemplates) => notificationtemplates.notificationtemplates_number);
  // }
});
</script>
<template>
  <async-select
    v-model="selectedNotificationTemplates"
    :options="notificationtemplatesOptions"
    placeholder="NotificationTemplates"
    :loading="notificationtemplatesLoading"
    @search="fetchNotificationTemplatesOptions"
  />
</template>

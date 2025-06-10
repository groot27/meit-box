<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { taskApi } from "@/api/taskApi";
import { useI18n } from "vue-i18n";
import { useCalendarStore } from "@/stores/CalendarStore";

const { t } = useI18n();
const calendarStore = useCalendarStore();
const props = defineProps<{
  dress: string;
}>();

const emit = defineEmits<{
  (e: "update", selectedDress);
}>();

const selectedDress = ref("");
const dressLoading = ref(false);
const dressOptions = ref<string[]>([]);
const fetchDressOptions = async (query: string = "") => {
  dressLoading.value = true;
  try {
    const res = await taskApi.getTaskDresses(query);
    dressOptions.value = res.data.map((dress) => dress.dress_number);
  } finally {
    dressLoading.value = false;
  }
};
watch(selectedDress, () => {
  if (selectedDress) {
    emit("update", selectedDress);
  }
});
onMounted(() => {
  dressOptions.value = calendarStore.defaultData.dresses.map(
    (dress) => dress.dress_number
  );
});
</script>
<template>
  <async-select
    v-model="selectedDress"
    :options="dressOptions"
    :placeholder="t('common.placeholder.dress')"
    :loading="dressLoading"
    @search="fetchDressOptions"
  />
</template>

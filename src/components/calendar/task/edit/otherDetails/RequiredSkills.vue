<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { taskApi } from "@/api/taskApi";
import { useI18n } from "vue-i18n";
import { useCalendarStore } from "@/stores/CalendarStore";

const { t } = useI18n();
const calendarStore = useCalendarStore();
const props = defineProps<{
  skill: string;
}>();
const emit = defineEmits<{
  (e: "update", selectedRequiredSkill);
}>();

const selectedRequiredSkill = ref("");
const requiredskillLoading = ref(false);
const requiredskillOptions = ref<string[]>([]);
const fetchRequiredSkillOptions = async (query: string = "") => {
  requiredskillLoading.value = true;
  try {
    const res = await taskApi.getTaskSkills();
    requiredskillOptions.value = res.data.map((skill) => skill.name);
  } finally {
    requiredskillLoading.value = false;
  }
};
watch(selectedRequiredSkill, () => {
  if (selectedRequiredSkill) {
    emit("update", selectedRequiredSkill);
  }
});
watch(
  () => props.skill,
  async (newSkill) => {
    if (newSkill !== selectedRequiredSkill.value) {
      selectedRequiredSkill.value = newSkill;
    }
  },
  { immediate: true } // Fire once on component mount
);
onMounted(() => {
  requiredskillOptions.value = calendarStore.defaultData.skills.map(
    (skill) => skill.name
  );
});
</script>
<template>
  <async-select
    v-model="selectedRequiredSkill"
    :options="requiredskillOptions"
    :placeholder="t('common.placeholder.requiredSkill')"
    :loading="requiredskillLoading"
    @search="fetchRequiredSkillOptions"
  />
</template>

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

const selectedRequiredSkill = ref(props.modelValue ?? "");
const requiredskillLoading = ref(false);
const requiredskillOptions = ref<string[]>([]);

// Sync prop -> local ref
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== selectedRequiredSkill.value) {
      selectedRequiredSkill.value = newVal ?? "";
    }
  }
);

// Emit local changes to parent
watch(selectedRequiredSkill, (val) => {
  emit("update:modelValue", val);
});

// Fetch async skills
const fetchRequiredSkillOptions = async (query: string = "") => {
  requiredskillLoading.value = true;
  try {
    const res = await taskApi.getTaskSkills();
    requiredskillOptions.value = res.data.map((skill) => skill.name);
  } finally {
    requiredskillLoading.value = false;
  }
};

// Load defaults from store
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

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { taskApi } from "@/api/taskApi";

// const props = defineProps<{
//   requiredskill: string;
//   requiredskills: any;
// }>();
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
onMounted(() => {
  fetchRequiredSkillOptions();
  // if (props.requiredskills) {
  //   selectedRequiredSkill.value = props.requiredskill;
  //   requiredskillOptions.value = props.requiredskills.map(
  //     (user) => user.username
  //   );
  // }
});
</script>
<template>
  <async-select
    v-model="selectedRequiredSkill"
    :options="requiredskillOptions"
    placeholder="RequiredSkill"
    :loading="requiredskillLoading"
    @search="fetchRequiredSkillOptions"
  />
</template>

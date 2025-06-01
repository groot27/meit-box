<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { taskApi } from "@/api/taskApi";

// const props = defineProps<{
//   contactpersons: string;
//   contactpersonss: any;
// }>();
const emit = defineEmits<{
  (e: "update", selectedContactPersons);
}>();

const selectedContactPersons = ref("");
const contactpersonsLoading = ref(false);
const contactpersonsOptions = ref<string[]>([]);
const fetchContactPersonsOptions = async (query: string = "") => {
  contactpersonsLoading.value = true;
  try {
    const res = await taskApi.getTaskContactPersons(query);
    contactpersonsOptions.value = res.data.map(
      (contactpersons) =>
        `${contactpersons.id} | ${contactpersons.name} | ${contactpersons.phone}`
    );
  } finally {
    contactpersonsLoading.value = false;
  }
};
watch(selectedContactPersons, () => {
  if (selectedContactPersons) {
    emit("update", selectedContactPersons);
  }
});
onMounted(() => {
  fetchContactPersonsOptions();
});
</script>
<template>
  <async-select
    v-model="selectedContactPersons"
    :options="contactpersonsOptions"
    placeholder="ContactPersons"
    :loading="contactpersonsLoading"
    @search="fetchContactPersonsOptions"
  />
</template>

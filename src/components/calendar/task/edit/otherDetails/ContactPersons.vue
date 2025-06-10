<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { taskApi } from "@/api/taskApi";
import { useI18n } from "vue-i18n";
import { useCalendarStore } from "@/stores/CalendarStore";

const { t } = useI18n();
const calendarStore = useCalendarStore();
const props = defineProps<{
  person: string;
}>();

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
  contactpersonsOptions.value = calendarStore.defaultData.contactPerson.map(
    (contactpersons) =>
      `${contactpersons.id} | ${contactpersons.name} | ${contactpersons.phone}`
  );
});
// watch(
//   () => props.person,
//   (newPerson) => {
//     if (newPerson !== selectedContactPersons.value) {
//       debugger;
//       selectedContactPersons.value = newPerson;
//       fetchContactPersonsOptions();
//     }
//   },
//   { immediate: true } // Fire once on component mount
// );
</script>
<template>
  <async-select
    v-model="selectedContactPersons"
    :options="contactpersonsOptions"
    :placeholder="t('common.placeholder.contactPerson')"
    :loading="contactpersonsLoading"
    @search="fetchContactPersonsOptions"
  />
</template>

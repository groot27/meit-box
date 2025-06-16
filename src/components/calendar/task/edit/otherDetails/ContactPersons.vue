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

const selectedContactPersons = ref(props.modelValue ?? "");

const contactpersonsLoading = ref(false);
const contactpersonsOptions = ref<string[]>([]);

const fetchContactPersonsOptions = async (query: string = "") => {
  contactpersonsLoading.value = true;
  try {
    const res = await taskApi.getTaskContactPersons(query);
    contactpersonsOptions.value = res.data.map(
      (person) => `${person.id} | ${person.name} | ${person.phone}`
    );
  } finally {
    contactpersonsLoading.value = false;
  }
};

// Sync incoming modelValue to local state
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== selectedContactPersons.value) {
      selectedContactPersons.value = newVal ?? "";
    }
  }
);

// Emit local state to parent
watch(selectedContactPersons, (val) => {
  emit("update:modelValue", val);
});

onMounted(() => {
  contactpersonsOptions.value = calendarStore.defaultData.contactPerson.map(
    (person) => person.name
  );
});
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

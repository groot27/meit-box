<script setup lang="ts">
import { ref, watch } from "vue";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";

const searchValue = ref("");

defineOptions({
  name: "AsyncSelect",
});

const props = defineProps<{
  modelValue: string | object | null;
  options: Array<string | object>;
  placeholder?: string;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | object | null): void;
  (e: "search", query: string): void;
}>();

const onChange = (query: string) => {
  searchValue.value = query;
  setTimeout(() => {
    onSearch(query);
  }, 700);
};

const onSearch = (query: string) => {
  if (query === searchValue.value) {
    emit("search", query);
  }
};
const internalValue = ref(props.modelValue);

// Watch for external modelValue updates
watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal;
  }
);
watch(internalValue, (val) => {
  emit("update:modelValue", val);
});
</script>
<style>
/* Remove green selection and white text */
.multiselect {
  --multiselect-primary: #4b5563 !important; /* neutral gray */
  --multiselect-highlight: #f3f4f6 !important; /* light gray */
  --multiselect-text: #111827 !important; /* dark text */
}

/* Optional: customize selected option background */
.multiselect__option--highlight {
  background: #e5e7eb !important; /* soft gray */
  color: #111827 !important;
}
.multiselect__option--selected {
  background-color: #dbeafe !important;
  color: #1e3a8a !important;
}
.multiselect__single,
.multiselect__placeholder {
  color: #374151 !important; /* Tailwind gray-700 */
}
/* Optional: customize dropdown borders and appearance */
.multiselect__content-wrapper {
  border: 1px solid #d1d5db !important;
  background-color: white !important;
}

.multiselect__option--selected {
  background-color: #dbeafe !important; /* light blue for selected */
  color: #1e3a8a !important;
}

.multiselect__placeholder,
.multiselect__single {
  color: #6b7280 !important; /* text-gray-500 */
}
.multiselect__option--highlight::after {
  content: none !important;
}
</style>
<template>
  <Multiselect
    v-model="internalValue"
    :options="options"
    :loading="loading"
    :placeholder="placeholder"
    :searchable="true"
    :internal-search="false"
    :clear-on-select="true"
    :preserve-search="true"
    @search-change="onChange"
    class="w-full"
  />
</template>

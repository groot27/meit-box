<template>
  <div>
    <multiselect
      v-model="localSelected"
      :options="options"
      :multiple="true"
      :close-on-select="false"
      placeholder="Pick one or more"
      :option-disabled="isDisabled"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";

// Props and Emits
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["update:modelValue"]);

// Data
const options = ["english", "german", "doesn't matter"];
const localSelected = ref([...props.modelValue]);

// Sync local state to parent
watch(localSelected, (newVal) => {
  emit("update:modelValue", newVal);
});

// Sync parent prop to local
watch(
  () => props.modelValue,
  (newVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(localSelected.value)) {
      localSelected.value = [...newVal];
    }
  }
);

// Optional: Disable already selected items (if needed)
function isDisabled(option) {
  return false; // or remove this prop entirely
}
</script>

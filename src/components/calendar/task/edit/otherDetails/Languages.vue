<!-- MultiSelectLanguage.vue -->
<template>
  <div>
    <label class="block mb-2">Select Languages:</label>
    <multiselect
      v-model="localSelected"
      :options="options"
      :multiple="true"
      :close-on-select="false"
      placeholder="Pick one or more"
      :option-disabled="isDisabled"
      @input="updateSelection"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["update:modelValue"]);

const options = ["english", "german", "doesn't matter"];
const localSelected = ref([...props.modelValue]);

watch(
  () => props.modelValue,
  (newVal) => {
    localSelected.value = [...newVal];
  }
);

function updateSelection() {
  emit("update:modelValue", localSelected.value);
}

// Disable options already selected
function isDisabled(option) {
  return localSelected.value.includes(option);
}
</script>

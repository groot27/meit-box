<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const startDate = ref("");
const startTime = ref("");
const endTime = ref("");

const handleAddDate = () => {
  emit("addDate", {
    startDate: startDate.value,
    startTime: startTime.value,
    endTime: endTime.value,
  });
};
const handleStartDate = (event) => {
  startDate.value = event.target.value;
};
const handleStartTime = (event) => {
  startTime.value = event.target.value;
};
const handleEndTime = (event) => {
  endTime.value = event.target.value;
};
const emit = defineEmits<{
  (e: "addDate", dateAndTime: any): void;
}>();
</script>

<template>
  <div
    class="rounded-lg w-full border border-gray-200 p-2 absolute top-6 left-4"
  >
    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700">{{
        t("task.editSidebar.tabs.project.startEndDate")
      }}</label>
      <div class="gap-4">
        <input
          type="date"
          :value="startDate"
          class="input-field"
          @input="handleStartDate"
        />
      </div>
    </div>

    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700">{{
        t("task.editSidebar.tabs.project.time")
      }}</label>
      <div class="grid grid-cols-2 gap-4">
        <input
          type="time"
          lang="en-GB"
          :value="startTime"
          class="input-field"
          @input="handleStartTime"
        />
        <input
          type="time"
          lang="en-GB"
          :value="endTime"
          class="input-field"
          @input="handleEndTime"
        />
      </div>
    </div>
    <button
      class="bg-gray-200 rounded-lg p-2 w-full text-center"
      :disabled="!startDate"
      @click="handleAddDate"
    >
      + Save Date
    </button>
  </div>
</template>

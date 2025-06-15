<script setup>
import { computed, ref } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { taskApi } from "@/api/taskApi";
import { format } from "date-fns";
import { useCalendarStore } from "@/stores/CalendarStore";

const calendarStore = useCalendarStore();
const showModal = computed(() => calendarStore.exportTaskDisplay);
const range = ref({ start: null, end: null });

const cancel = () => {
  calendarStore.setExportTaskDisplay(false);
  range.value = { start: null, end: null };
};
const exportData = () => {
  taskApi.exportPdfTasks({
    exportType: calendarStore.exportTaskType,
    date: format(range.value[0], "yyyy-MM-dd"),
    toDate: format(range.value[1], "yyyy-MM-dd"),
    orientation: "portrait",
    showHours: true,
  });
  // calendarStore.setExportTaskDisplay(false);
};
</script>
<template>
  <div>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <span class="title">Select date for export</span>
          <button class="close-button" @click="cancel">×</button>
        </div>

        <VueDatePicker
          v-model="range"
          :auto-apply="true"
          range
          inline
          :enable-time-picker="false"
          format="yyyy-MM-dd"
        />

        <div class="button-group">
          <button class="cancel-btn" @click="cancel">Cancel</button>
          <button class="export-btn" @click="exportData">Export Pdf</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.open-button {
  padding: 0.6rem 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  width: 320px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.1rem;
  font-weight: 600;
}

.close-button {
  background: transparent;
  border: none;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.cancel-btn {
  background-color: #fde2e2;
  color: #d62828;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}

.export-btn {
  background-color: #e0e7ff;
  color: #1d4ed8;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}
</style>

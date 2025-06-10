<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeUnmount } from "vue";
import AddDateModal from "./resources/AddDateModal.vue";
import ResourcesTable from "./resources/resourcesTable/ResourcesTable.vue";

const { t } = useI18n();
const props = defineProps<{
  devices: string;
  vehicle: string;
  employees: string;
  resourcesValues: any;
  date: string;
  startTime: string;
  endTime: string;
  relatedTasks: any;
  taskId: number;
}>();
const emit = defineEmits<{
  (e: "update:resourcesIds", id, type: string): void;
  (e: "update:repeatTask", time: any): void;
}>();
const showAddDate = ref(false);

const activeDropdown = ref(null);
const dropdownRefs = ref([]);

const handleClickOutside = (event) => {
  const isClickInsideAnyDropdown = dropdownRefs.value.some(
    (el) => el && el.contains(event.target)
  );
  if (!isClickInsideAnyDropdown) {
    activeDropdown.value = null;
  }
};

const handleAddDate = () => {
  showAddDate.value = !showAddDate.value;
};

const handleAddSubTask = (time) => {
  emit("update:repeatTask", time);
};

const editableTasks = computed(() => {
  return props.relatedTasks.filter((task) => task.date > props.date);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="">
    <resources-table
      v-model:devices="props.devices"
      v-model:vehicle="props.vehicle"
      v-model:employees="props.employees"
      v-model:resourcesValues="props.resourcesValues"
      v-model:date="props.date"
      v-model:startTime="props.startTime"
      v-model:endTime="props.endTime"
      v-model:relatedTasks="props.relatedTasks"
      v-model:taskId="props.taskId"
    />
    <template v-for="task in editableTasks" :key="task.id">
      <resources-table
        v-model:devices="task.taskTemplate.devices"
        v-model:vehicle="task.taskTemplate.vehicle"
        v-model:employees="task.taskTemplate.employees"
        v-model:resourcesValues="task.resources"
        v-model:date="task.date"
        v-model:startTime="task.startTime"
        v-model:endTime="task.endTime"
        v-model:relatedTasks="task.relatedTasks"
        v-model:taskId="task.taskTemplate.id"
      />
    </template>
    <div class="relative">
      <span class="text-blue-500 cursor-pointer" @click="handleAddDate"
        >Add Date</span
      >
      <add-date-modal v-on:add-date="handleAddSubTask" v-if="showAddDate" />
    </div>
  </div>
</template>

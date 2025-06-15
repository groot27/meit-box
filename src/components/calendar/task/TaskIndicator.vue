<script setup lang="ts">
import { computed, watch } from "vue";
import { format } from "date-fns";
import { Task, TaskDisplayType } from "@/types/TaskTypes";
import { useTaskStore } from "@/stores/TaskStore";
import { truncateWords } from "@/utils/utils";
const taskStore = useTaskStore();
const indicatorDisplay = computed(() => taskStore.taskIndicatorDisplay);

const props = defineProps<{
  task?: TaskDisplayType;
}>();

const emit = defineEmits<{
  (e: "click", task: Task, event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  event.stopPropagation();
  emit("click", props.task, event);
};

const customerName = computed(() => {
  return truncateWords(props.task.customer || "No Customer", 3);
});

const taskTitle = computed(() => {
  return truncateWords(props.task.title || "No Title", 3);
});
</script>

<template>
  <div
    class="px-2 py-1 text-xs rounded truncate cursor-pointer"
    :style="{ backgroundColor: task.color, color: 'inherit' }"
    @click="handleClick"
  >
    <div class="flex items-center gap-2">
      <!-- Customer Name -->
      <div
        class="font-medium truncate max-w-[80px]"
        v-show="indicatorDisplay.customer"
      >
        {{ customerName }}
      </div>

      <!-- Task Title -->
      <div class="truncate max-w-[80px]" v-show="indicatorDisplay.tittle">
        {{ taskTitle }}
      </div>

      <!-- Person icon with count -->
      <div class="flex items-center" v-show="indicatorDisplay.employee">
        <font-awesome-icon icon="fa-solid fa-user" />
        <span class="ml-1">{{
          `${task.employeeCount}/${task.allEmployeeCount}`
        }}</span>
      </div>

      <!-- Vehicle icon with count -->
      <div class="flex items-center" v-show="indicatorDisplay.vehicle">
        <font-awesome-icon icon="fa-solid fa-truck" />
        <span class="ml-1">{{
          `${task.vehicleCount}/${task.allVehicleCount}`
        }}</span>
      </div>

      <!-- Device icon with count -->
      <div class="flex items-center" v-show="indicatorDisplay.devices">
        <font-awesome-icon icon="fa-solid fa-tools" />
        <span class="ml-1">{{
          `${task.deviceCount}/${task.allDeviceCount}`
        }}</span>
      </div>

      <!-- Time -->
      <span class="font-medium" v-show="indicatorDisplay.time">{{
        task.startTime
      }}</span>
    </div>
  </div>
</template>

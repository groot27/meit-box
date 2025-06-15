<script setup lang="ts">
import { computed } from "vue";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { Task, TaskDisplayType } from "@/types/TaskTypes";
import { useTaskStore } from "@/stores/TaskStore";
import { truncateWords } from "@/utils/utils";
const taskStore = useTaskStore();
const indicatorDisplay = computed(() => taskStore.taskIndicatorDisplay);

const props = defineProps<{
  task: TaskDisplayType;
  index?: number;
  total?: number;
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
const taskHeight = computed(() => {
  const startTime = props.task.startTime || "";
  const endTime = props.task.endTime || "";

  if (!startTime || !endTime) return "48px"; // Default height for tasks without time range

  const taskDate = parseISO(props.task.date);
  const start = new Date(
    taskDate.setHours(
      parseInt(startTime.split(":")[0]),
      parseInt(startTime.split(":")[1])
    )
  );
  const end = new Date(
    taskDate.setHours(
      parseInt(endTime.split(":")[0]),
      parseInt(endTime.split(":")[1])
    )
  );

  const minutes = differenceInMinutes(end, start);
  return `${minutes}px`;
});

const taskStyle = computed(() => {
  const baseStyle = {
    backgroundColor: props.task.color,
    color: "inherit",
    height: taskHeight.value,
    minHeight: "24px",
  };

  // If this task is part of an overlapping group
  if (props.total && props.total > 1) {
    const width = 100 / props.total;
    const left = (props.index || 0) * width;
    return {
      ...baseStyle,
      width: `${width}%`,
      left: `${left}%`,
      position: "absolute",
    };
  }

  return baseStyle;
});
</script>

<template>
  <div
    v-if="task"
    class="px-2 py-1 text-xs rounded truncate cursor-pointer relative z-20 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg hover:z-30"
    :style="taskStyle"
    @click="handleClick"
  >
    <div class="flex items-center gap-2 w-full">
      <!-- Customer Name -->
      <div
        class="flex-1 font-medium truncate"
        v-show="indicatorDisplay.customer"
      >
        {{ customerName }}
      </div>

      <!-- Task Title -->
      <div class="flex-1 truncate" v-show="indicatorDisplay.tittle">
        {{ taskTitle }}
      </div>

      <!-- Person icon with count -->
      <div class="flex items-center" v-show="indicatorDisplay.employee">
        <font-awesome-icon icon="fa-solid fa-user" />
        <span class="ml-1">{{
          `${task.employeesCount}/${task.allEmployeesCount}`
        }}</span>
      </div>

      <!-- Vehicle icon with count -->
      <div class="flex items-center" v-show="indicatorDisplay.vehicle">
        <font-awesome-icon icon="fa-solid fa-truck" />
        <span class="ml-1">{{
          `${task.vehiclesCount}/${task.allVehiclesCount}`
        }}</span>
      </div>

      <!-- Device icon with count -->
      <div class="flex items-center" v-show="indicatorDisplay.devices">
        <font-awesome-icon icon="fa-solid fa-tools" />
        <span class="ml-1">{{
          `${task.devicesCount}/${task.allDevicesCount}`
        }}</span>
      </div>

      <!-- Time -->
      <span class="flex-1 font-medium" v-show="indicatorDisplay.time">{{
        task.startTime
      }}</span>
    </div>
  </div>
</template>

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { format } from "date-fns";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import QuickTaskTab from "./creation/QuickTaskTab.vue";
import DetailedTaskTab from "./creation/DetailedTaskTab.vue";

const { t } = useI18n();
const router = useRouter();

const props = defineProps<{
  date: Date | null;
  position: { x: number; y: number } | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "create", taskData: any): void;
  (e: "continueToCreate", taskData: any): void;
}>();

const activeTab = ref("task");
const color = ref("#1a73e8");
const detailedTaskRef = ref();

const tooltipStyle = computed(() => {
  if (!props.position) return {};

  const modalWidth = 600;
  const modalHeight = 700;

  let left = props.position.x;
  let top = props.position.y;

  left -= modalWidth / 2;
  top -= modalHeight / 2;

  const padding = 20;
  left = Math.max(
    padding,
    Math.min(left, window.innerWidth - modalWidth - padding)
  );
  top = Math.max(
    padding,
    Math.min(top, window.innerHeight - modalHeight - padding)
  );

  return {
    position: "absolute",
    left: `${left}px`,
    top: `${top}px`,
    width: `${modalWidth}px`,
    height: `${modalHeight}px`,
  };
});

const handleSubmit = (event: Event, taskData?: any) => {
  event.preventDefault();
  if (!props.date) return;

  const taskDate = new Date(props.date);

  if (activeTab.value === "task" && taskData) {
    emit("create", {
      date: taskDate.toISOString(),
      title: taskData.taskTitle,
      description: taskData.description,
      orderDetails: taskData.orderDetails,
      taskTemplate: taskData.taskTemplate,
    });
    handleClose();
  } else if (activeTab.value === "resource" && detailedTaskRef.value) {
    const detailedTask = detailedTaskRef.value;
    if (detailedTask.isValid) {
      const formData = detailedTask.getFormData();
      emit("create", {
        color: color.value,
        date: taskDate.toISOString(),
        title: formData.resourceOrder,
        description: formData.resourceDescription,
        taskDetails: {
          order: formData.resourceOrder,
          location: "",
          address: formData.address,
          taskTemplate: formData.taskTemplate,
          description: formData.resourceDescription,
        },
        resourceDetails: {
          startTime: formData.startTime,
          endTime: formData.endTime,
          skill: formData.skill,
          userQuantity: formData.userQuantity,
          ratePerHour: formData.ratePerHour,
          dress: formData.dress,
        },
      });
      handleClose();
    }
  }
};

const handleClose = () => {
  emit("close");
};

const handleContinueToEdit = (taskData: any) => {
  // Generate a temporary task ID
  const tempTaskId = Math.random().toString(36).substr(2, 9);

  // Close the modal
  handleClose();
  emit("continueToCreate", taskData);
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    handleClose();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <div
    v-if="position"
    class="fixed inset-0 z-50 bg-black/20"
    @click.self="handleClose"
  >
    <div
      class="modal-content bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
      :style="tooltipStyle"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10"
      >
        <h2 class="text-lg font-semibold text-gray-900">
          {{
            t("task.modal.create", {
              date: props.date ? format(props.date, "MMM d, yyyy") : "",
            })
          }}
        </h2>
        <button
          @click="handleClose"
          class="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Tabs -->
      <div class="border-b sticky top-[73px] bg-white z-10">
        <div class="flex">
          <button
            v-for="tab in ['task']"
            :key="tab"
            @click="activeTab = tab"
            class="px-4 py-2 text-sm font-medium"
            :class="
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            {{ t(`task.modal.tabs.${tab}`) }}
          </button>
        </div>
      </div>

      <!-- Form -->
      <div class="flex-1 overflow-y-auto">
        <form @submit.prevent="handleSubmit">
          <div class="p-4">
            <QuickTaskTab
              v-if="activeTab === 'task'"
              @continue-to-edit="handleContinueToEdit"
              @save-task="handleSubmit"
              :date="props.date"
            />

            <DetailedTaskTab
              v-else-if="activeTab === 'resource'"
              ref="detailedTaskRef"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

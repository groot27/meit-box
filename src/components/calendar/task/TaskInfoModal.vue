<script setup lang="ts">
import { computed } from "vue";
import { format } from "date-fns";
import { useI18n } from "vue-i18n";
import { Task } from "@/types/TaskTypes";

const { t } = useI18n();

const props = defineProps<{
  task: Task | null;
  position: { x: number; y: number } | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "share", task: Task): void;
  (e: "copy", task: Task): void;
  (e: "edit", task: Task): void;
}>();

const tooltipStyle = computed(() => {
  if (!props.position) return {};

  const modalWidth = 400;
  const padding = 20;

  let left = props.position.x;
  let top = props.position.y;

  // Check if modal would overflow right edge
  if (left + modalWidth + padding > window.innerWidth) {
    left = window.innerWidth - modalWidth - padding;
  }

  // Check if modal would overflow bottom edge
  const modalHeight = 500; // Approximate max height of modal
  if (top + modalHeight + padding > window.innerHeight) {
    top = window.innerHeight - modalHeight - padding;
  }

  return {
    position: "absolute",
    left: `${left}px`,
    top: `${top}px`,
  };
});

const handleClose = () => {
  emit("close");
};

const handleShare = () => {
  if (props.task) {
    emit("share", props.task);
  }
};

const handleCopy = () => {
  if (props.task) {
    emit("copy", props.task);
  }
};

const handleEdit = () => {
  if (props.task) {
    emit("edit", props.task);
  }
};
</script>

<template>
  <div
    v-if="task && position"
    class="fixed inset-0 z-50 bg-black/20"
    @click.self="handleClose"
  >
    <div
      class="w-[400px] bg-white rounded-lg shadow-2xl overflow-hidden ring-1 ring-black/5"
      :style="tooltipStyle"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-end p-4"
        :style="{ backgroundColor: task.color }"
      >
        <div class="flex items-center space-x-2">
          <button
            @click="handleShare"
            class="p-2 text-white hover:bg-white/20 rounded-full"
            :title="t('task.infoModal.share')"
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </button>

          <button
            @click="handleCopy"
            class="p-2 text-white hover:bg-white/20 rounded-full"
            :title="t('task.infoModal.copy')"
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>

          <button
            @click="handleEdit"
            class="p-2 text-white hover:bg-white/20 rounded-full"
            :title="t('task.infoModal.edit')"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            @click="handleClose"
            class="p-2 text-white hover:bg-white/20 rounded-full"
            :title="t('task.infoModal.close')"
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
      </div>

      <!-- Body -->
      <div class="p-4 space-y-6">
        <!-- Details Box -->
        <div class="bg-gray-50 rounded-lg p-4 shadow-sm ring-1 ring-gray-900/5">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Details</h3>
          <div class="space-y-3">
            <!-- Title -->
            <div class="flex items-center space-x-2">
              <svg
                class="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-gray-900">{{
                task.title || t("task.infoModal.noTitle")
              }}</span>
            </div>

            <!-- Time -->
            <div class="flex items-center space-x-2">
              <svg
                class="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-gray-900">
                {{
                  task.date
                    ? format(new Date(task.date), "h:mm a, MMM d, yyyy")
                    : t("task.infoModal.noTime")
                }}
              </span>
            </div>

            <!-- Address -->
            <div class="flex items-center space-x-2">
              <svg
                class="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="text-gray-900">
                {{
                  task.resourceDetails?.address || t("task.infoModal.noAddress")
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- Resource Box -->
        <div class="bg-gray-50 rounded-lg p-4 shadow-sm ring-1 ring-gray-900/5">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Resources</h3>
          <div class="space-y-3">
            <!-- Skill -->
            <div class="flex items-center space-x-2">
              <svg
                class="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span class="text-gray-900">{{
                task.resourceDetails?.skill || "No skill specified"
              }}</span>
            </div>

            <!-- User Quantity -->
            <div class="flex items-center space-x-2">
              <svg
                class="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span class="text-gray-900"
                >{{ task.resourceDetails?.userQuantity || "1" }} users</span
              >
            </div>

            <!-- Rate per Hour -->
            <div class="flex items-center space-x-2">
              <svg
                class="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-gray-900">{{
                task.resourceDetails?.ratePerHour || "No rate specified"
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

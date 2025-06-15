<script setup lang="ts">
import { computed, ref } from "vue";
import { format } from "date-fns";
import { useI18n } from "vue-i18n";
import { Task } from "@/types/TaskTypes";
import { statusColorClasses } from "@/types/TaskTypes";
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

const copiedTooltipVisible = ref(false);

const handleShare = () => {
  if (!props.task) return;

  const textToCopy = `Job: ${props.task.title} Date: ${props.task.date} from ${props.task.startTime}-${props.task.endTime} Location: ${props.task.address}`;

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      copiedTooltipVisible.value = true;
      setTimeout(() => {
        copiedTooltipVisible.value = false;
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
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
        <div class="flex items-center space-x-2 relative">
          <button
            @click="handleShare"
            class="p-2 text-white hover:bg-white/20 rounded-full"
            :title="t('task.infoModal.share')"
          >
            <font-awesome-icon :icon="['fas', 'share-nodes']" />
          </button>

          <div
            v-if="copiedTooltipVisible"
            class="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-400 text-white text-xs px-2 py-1 rounded shadow"
          >
            copied to clipboard
          </div>

          <router-link
            :to="`/finance-dashboard?order_id=${task.orderId}&activeTab=worktime`"
            class="text-white"
          >
            <font-awesome-icon :icon="['fas', 'clock']" />
          </router-link>

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
          <h3 class="text-sm font-medium text-gray-700 mb-3">
            {{ t("task.infoModal.details") }}
          </h3>
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
                {{ task.startTime }}
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
                {{ task.address || t("task.infoModal.noAddress") }}
              </span>
            </div>
          </div>
        </div>

        <!-- Resource Box -->
        <div
          class="bg-gray-50 rounded-lg p-4 shadow-sm ring-1 ring-gray-900/5"
          v-if="task.users && task.users.length"
        >
          <h3 class="text-sm font-medium text-gray-700 mb-3">
            {{ t("task.infoModal.resources") }}
          </h3>
          <div class="space-y-3">
            <!-- Employee -->
            <div
              class="flex items-center justify-between"
              v-for="user in task.users"
            >
              <div>
                <font-awesome-icon icon="fa-solid fa-user" />
                <span class="text-gray-900">{{
                  `${user.first_name} ${user.last_name}`
                }}</span>
              </div>
              <span :class="statusColorClasses[user.status]">{{
                `${user.status}`
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { TaskDocument } from "@/types/TaskTypes";

const { t } = useI18n();

const props = defineProps<{
  documents: TaskDocument[] | null | undefined;
}>();

const emit = defineEmits<{
  (e: "remove", docId: string): void;
  (e: "add", files: File[]): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (input.files) {
    emit("add", Array.from(input.files));
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  const files = event.dataTransfer?.files;
  if (files) {
    emit("add", Array.from(files));
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
</script>

<template>
  <div class="space-y-4">
    <!-- Upload Area -->
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
      @click="$refs.fileInput.click()"
      @dragover.prevent
      @drop="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*,application/pdf"
        multiple
        class="hidden"
        @change="handleFileSelect"
      />
      <font-awesome-icon icon="fa-solid fa-file-upload" class="text-gray-500" />
      <p class="mt-1 text-sm text-gray-600">
        {{ t("task.modal.sections.documents.dragDrop") }}
      </p>
    </div>

    <!-- Document List -->
    <div v-if="documents?.length" class="space-y-3">
      <div
        v-for="doc in documents"
        :key="doc.id"
        class="flex items-center p-3 bg-gray-50 rounded-lg"
      >
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium text-gray-900">{{ doc.name }}</p>
          <!-- <p class="text-xs text-gray-500">{{ formatFileSize(doc.size) }}</p> -->
        </div>
        <button
          @click="emit('remove', doc.id)"
          class="p-1 text-gray-400 hover:text-gray-600"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
    <p v-else class="text-center text-gray-500 text-sm">
      {{ t("task.modal.sections.documents.noDocuments") }}
    </p>
  </div>
</template>
```

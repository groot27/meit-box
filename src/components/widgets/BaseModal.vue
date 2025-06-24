<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      @click.self="emitClose"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <slot />
        <!-- <button
          @click="emitClose"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Close
        </button> -->
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

function emitClose() {
  emit("update:modelValue", false);
}
</script>

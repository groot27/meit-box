<template>
  <div
    v-show="visible"
    class="fixed top-0 left-0 w-full h-[3px] z-[9999] overflow-hidden bg-red-200"
  >
    <div class="h-full bg-red-500 animate-loading-bar w-1/3"></div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from "vue";
import { useGlobalStore } from "@/stores";

const globalStore = useGlobalStore();
const visible = ref(false);

watch(
  () => globalStore.loadingApi,
  (loading) => {
    visible.value = loading;
  },
  { immediate: true }
);
</script>

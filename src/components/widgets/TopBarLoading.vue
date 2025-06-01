<template>
  <div
    class="fixed top-0 left-0 h-[3px] bg-red-500 z-[9999] transition-all duration-200 ease-out"
    :style="barStyle"
    v-show="visible"
  />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useGlobalStore } from "@/stores";

const visible = ref(false);
const width = ref(0);
let interval: ReturnType<typeof setInterval> | null = null;
const globalStore = useGlobalStore();

const loading = computed(() => globalStore.loadingApi);
const start = () => {
  if (visible.value) return;
  visible.value = true;
  width.value = 0;

  interval = setInterval(() => {
    console.log("interval top bar");
    if (width.value < 90) {
      width.value += Math.random() * 5; // simulate progressive load
    } else {
      clearInterval(interval!);
    }
  }, 200);
};

const finish = () => {
  width.value = 100;
  setTimeout(() => {
    visible.value = false;
    width.value = 0;
  }, 500);
  if (interval) clearInterval(interval);
};

const fail = () => {
  width.value = 100;
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
    width.value = 0;
  }, 800);
  if (interval) clearInterval(interval);
};
const barStyle = computed(() => ({
  width: `${width.value}%`,
}));

watch([loading], () => {
  console.log("🚀 ~ watch ~ globalStore.loadingApi:", loading.value);
  if (globalStore.loadingApi) {
    start();
  } else {
    finish();
  }
});
</script>

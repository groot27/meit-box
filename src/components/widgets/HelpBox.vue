<script setup>
import { useGlobalStore } from "@/stores/index";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
const globalStore = useGlobalStore();
const { t } = useI18n();
const visible = computed(() => globalStore.displayHelper);
const boxRef = ref(null);
const close = () => {
  globalStore.setDisplayHelper(false);
};
// const handleClickOutside = (e) => {
//   if (boxRef.value && !boxRef.value.contains(e.target) && visible.value) {
//     debugger;
//     close();
//   }
// };

// onMounted(() => {
//   document.addEventListener("click", handleClickOutside);
// });

// onBeforeUnmount(() => {
//   document.removeEventListener("click", handleClickOutside);
// });
</script>
<template>
  <transition name="fade">
    <div
      v-if="visible"
      ref="boxRef"
      class="help-box fixed bottom-5 right-5 w-80 bg-white rounded-xl shadow-lg overflow-hidden font-sans z-50 flex-col gap-12"
    >
      <div
        class="bg-red-700 text-white px-4 py-3 flex justify-between items-center font-semibold"
      >
        <span>{{ t("help.title") }}</span>
        <button @click="close" class="text-white text-lg leading-none">
          &times;
        </button>
      </div>

      <div class="p-4 space-y-3">
        <div class="flex items-center gap-2 text-gray-800">
          📞 <span>{{ t("help.call") }}</span>
        </div>
        <div class="flex items-center gap-2 text-gray-800">
          💬 <span>{{ t("help.chat") }}</span>
        </div>
        <div class="flex items-center gap-2 text-gray-800">
          ⚠️ <span>{{ t("help.bug") }}</span>
        </div>

        <div class="mt-4 text-sm text-gray-700">
          <strong class="block mb-1">{{ t("help.support") }}</strong>
          <p>
            Our support Team is available to help you with the software. Number
            0162 15 84 771
          </p>
          <p class="mt-1">
            Mo. - Fr. <span class="font-medium">08:00 - 15:00 Uhr</span>
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

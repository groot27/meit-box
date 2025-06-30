<script setup lang="ts">
import { useDashboardStore } from "@/stores/DashboardStore";
import { useNotificationStore } from "@/stores/NotificationStore";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const dashboardStore = useDashboardStore();
const showOptions = ref(false);
const moreOptions = computed(() => dashboardStore.moreOptions);
const toggleMoreOptions = () => {
  showOptions.value = !showOptions.value;
};

const handleVisible = (key: string) => {
  dashboardStore.toggleMoreOptionVisiblity(key);
};

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  const dropdown = document.querySelector(".more-option-dropdown");
  const button = document.querySelector(".more-option-button");

  if (
    dropdown &&
    button &&
    !dropdown.contains(target) &&
    !button.contains(target)
  ) {
    showOptions.value = false;
  }
};

// Add event listener for clicking outside
if (typeof window !== "undefined") {
  document.addEventListener("click", handleClickOutside);
}
</script>
<template>
  <div class="relative">
    <button
      @click="toggleMoreOptions"
      class="more-option-button relative py-2 px-3 text-white hover:bg-opacity-50 rounded-lg transition-colors bg-black bg-opacity-20 justify-center items-center h-full ml-2"
    >
      <font-awesome-icon icon="fa-solid fa-ellipsis" class="text-white" />
    </button>

    <div
      v-if="showOptions"
      class="more-option-dropdown absolute sm:translate-x-[-40%] md:translate-x-0 right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
    >
      <div class="max-h-80 overflow-y-auto divide-y divide-gray-300">
        <div
          v-for="(option, key) in moreOptions"
          :key="option.title"
          @click="handleVisible(key)"
          class="px-4 py-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
          :class="{ 'bg-blue-50': option.visible }"
        >
          {{ option.title }}
        </div>
      </div>
    </div>
  </div>
</template>

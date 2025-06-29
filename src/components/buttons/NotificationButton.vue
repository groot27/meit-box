<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const notificationCount = ref(20);
const handleNotifications = () => {};
</script>
<template>
  <button
    @click="handleNotifications"
    class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
  >
    <font-awesome-icon icon="fa-solid fa-bell" class="w-5 h-5" />
    <span
      v-if="notificationCount > 0"
      class="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
    >
      {{ notificationCount }}
    </span>
  </button>
</template>

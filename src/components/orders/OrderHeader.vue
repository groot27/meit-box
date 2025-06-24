<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();

const notificationCount = ref(5);
const router = useRouter();

const handleMoreOptions = () => {
  console.log("More options clicked");
};

const handleCreateOrder = () => {
  router.push(`/add-order/`);
};

const handleNotifications = () => {
  console.log("Notifications clicked");
};
</script>

<template>
  <header class="bg-[#1c3f52] border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Left side - Title -->
      <h1 class="text-2xl font-semibold text-white">
        {{ t("orders.header.title") }}
      </h1>

      <!-- Right side - Actions -->
      <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <!-- <button
          @click="handleNotifications"
          class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <font-awesome-icon icon="fa-solid fa-bell" class="w-5 h-5" />
          <span
            v-if="notificationCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          >
            {{ notificationCount }}
          </span>
        </button> -->

        <!-- More Options -->
        <button
          @click="handleMoreOptions"
          class="px-4 py-2 text-sm font-medium text-white bg-opacity-10 bg-black rounded-md hover:bg-gray-50 transition-colors"
        >
          {{ t("orders.header.moreOptions") }}
        </button>

        <!-- Create Order -->
        <button
          @click="handleCreateOrder"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          {{ t("orders.header.createOrder") }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import NotificationButton from "@/components/buttons/NotificationButton.vue";
import CreateOrderButton from "@/components/buttons/CreateOrderButton.vue";

const { t } = useI18n();
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
        <NotificationButton />

        <!-- More Options -->
        <router-link
          :to="`/import-orders/`"
          class="px-4 py-2 text-sm font-medium text-white bg-opacity-10 bg-black rounded-md hover:bg-opacity-50 transition-colors"
        >
          {{ t("orders.header.moreOptions") }}
        </router-link>

        <!-- Create Order -->
        <CreateOrderButton />
      </div>
    </div>
  </header>
</template>

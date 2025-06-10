<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<template>
  <router-link to="/price-and-salary?skillRequest=true">
    <button
      class="w-full my-2 p-3 text-left font-medium flex items-center space-x-2 hover:bg-gray-50"
    >
      <font-awesome-icon icon="fa-solid fa-cog" class="text-gray-500" />
      <span>{{ t("leftSidebar.settings.title") }}</span>
    </button>
  </router-link>
</template>

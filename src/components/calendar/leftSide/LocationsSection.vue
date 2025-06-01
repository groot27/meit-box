<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isExpanded = ref(false)

const locations = [
  { key: 'dessau', label: t('leftSidebar.locations.dessau') },
  { key: 'berlin', label: t('leftSidebar.locations.berlin') },
  { key: 'all', label: t('leftSidebar.locations.all') }
]
</script>

<template>
  <div class="my-2">
    <button 
      class="w-full p-3 text-left font-medium flex items-center justify-between"
      @click="isExpanded = !isExpanded"
    >
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{{ t('leftSidebar.locations.title') }}</span>
      </div>
      <svg 
        class="w-5 h-5 transform transition-transform"
        :class="isExpanded ? 'rotate-180' : ''"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div v-if="isExpanded" class="p-3 border-t space-y-2">
      <label 
        v-for="location in locations" 
        :key="location.key" 
        class="flex items-center space-x-2"
      >
        <input type="checkbox" class="rounded border-gray-300">
        <span>{{ location.label }}</span>
      </label>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isExpanded = ref(false)

const items = [
  { key: 'order', label: t('leftSidebar.extendedData.order') },
  { key: 'vehicleCustomField', label: t('leftSidebar.extendedData.vehicleCustomField') },
  { key: 'validityFormDocument', label: t('leftSidebar.extendedData.validityFormDocument') }
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>{{ t('leftSidebar.extendedData.title') }}</span>
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
      <div 
        v-for="item in items" 
        :key="item.key" 
        class="p-2 bg-white rounded border hover:bg-gray-50 cursor-pointer"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>
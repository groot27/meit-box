<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'

const { locale } = useI18n()

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' }
]

const toggleLanguage = () => {
  const newLocale = locale.value === 'en' ? 'de' : 'en'
  locale.value = newLocale
  localStorage.setItem('selectedLanguage', newLocale)
}

onMounted(() => {
  const savedLanguage = localStorage.getItem('selectedLanguage')
  if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
    locale.value = savedLanguage
  }
})
</script>

<template>
  <button 
    @click="toggleLanguage"
    class="btn btn-secondary flex items-center space-x-2"
  >
    <span>{{ languages.find(lang => lang.code === locale)?.name }}</span>
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  </button>
</template>
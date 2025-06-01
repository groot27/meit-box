<script setup lang="ts">
import SearchSection from './SearchSection.vue'
import FilterSection from './FilterSection.vue'
import TaskFilterSection from './TaskFilterSection.vue'
import LocationsSection from './LocationsSection.vue'
import SettingsSection from './SettingsSection.vue'
import PrintWorkPlanSection from './PrintWorkPlanSection.vue'
import CardSettingsSection from './CardSettingsSection.vue'
import ExtendedDataSection from './ExtendedDataSection.vue'
import MiniCalendar from './MiniCalendar.vue'
</script>

<template>
  <div class="w-full bg-white border-r p-4 space-y-4 overflow-y-auto divide-y">
    <MiniCalendar />
    <SearchSection />
    <FilterSection />
    <TaskFilterSection />
    <!-- <LocationsSection /> -->
    <SettingsSection />
    <PrintWorkPlanSection />
    <CardSettingsSection />
    <!-- <ExtendedDataSection /> -->
  </div>
</template>

```vue
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  appointmentName: string
  username: string
  adminGuest: string
}>()

const emit = defineEmits<{
  (e: 'update:appointmentName', value: string): void
  (e: 'update:username', value: string): void
  (e: 'update:adminGuest', value: string): void
}>()
</script>

<template>
  <div class="space-y-6">
    <div class="form-group">
      <select 
        :value="appointmentName"
        @input="emit('update:appointmentName', ($event.target as HTMLSelectElement).value)"
        class="input-field"
      >
        <option value="" disabled>{{ t('task.modal.sections.appointmentDetails.name') }}</option>
        <option value="appointment1">Appointment 1</option>
        <option value="appointment2">Appointment 2</option>
      </select>
    </div>

    <div class="form-group">
      <select 
        :value="username"
        @input="emit('update:username', ($event.target as HTMLSelectElement).value)"
        class="input-field"
      >
        <option value="" disabled>{{ t('task.modal.sections.appointmentDetails.username') }}</option>
        <option value="user1">User 1</option>
        <option value="user2">User 2</option>
      </select>
    </div>

    <div class="form-group">
      <select 
        :value="adminGuest"
        @input="emit('update:adminGuest', ($event.target as HTMLSelectElement).value)"
        class="input-field"
      >
        <option value="" disabled>{{ t('task.modal.sections.appointmentDetails.adminGuest') }}</option>
        <option value="admin1">Admin 1</option>
        <option value="guest1">Guest 1</option>
      </select>
    </div>
  </div>
</template>
```
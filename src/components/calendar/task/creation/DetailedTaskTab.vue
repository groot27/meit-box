<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const startTime = ref('')
const endTime = ref('')
const resourceOrder = ref('')
const address = ref('')
const taskTemplate = ref('')
const resourceDescription = ref('')
const skill = ref('')
const userQuantity = ref(1)
const ratePerHour = ref('')
const dress = ref('')

const isValid = computed(() => {
  return resourceOrder.value && startTime.value && endTime.value
})

const getFormData = () => {
  return {
    startTime: startTime.value,
    endTime: endTime.value,
    resourceOrder: resourceOrder.value,
    address: address.value,
    taskTemplate: taskTemplate.value,
    resourceDescription: resourceDescription.value,
    skill: skill.value,
    userQuantity: userQuantity.value,
    ratePerHour: ratePerHour.value,
    dress: dress.value
  }
}

defineExpose({
  startTime,
  endTime,
  resourceOrder,
  address,
  taskTemplate,
  resourceDescription,
  skill,
  userQuantity,
  ratePerHour,
  dress,
  isValid,
  getFormData
})
</script>

<template>
  <div class="space-y-6">
    <!-- Time Range Section -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900">{{ t('task.modal.sections.resourceDetails.timeRange.title') }}</h3>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('task.modal.sections.resourceDetails.timeRange.start') }}</label>
          <input
            v-model="startTime"
            type="time"
            class="block w-full rounded-md border-gray-300 shadow-sm py-3 px-4"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('task.modal.sections.resourceDetails.timeRange.end') }}</label>
          <input
            v-model="endTime"
            type="time"
            class="block w-full rounded-md border-gray-300 shadow-sm py-3 px-4"
          />
        </div>
      </div>
    </div>

    <!-- Task Details Section -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900">{{ t('task.modal.sections.resourceDetails.taskDetails.title') }}</h3>
      
      <select 
        v-model="resourceOrder" 
        class="block w-full rounded-md border-gray-300 shadow-sm py-3 px-4"
      >
        <option value="" disabled>{{ t('task.modal.sections.resourceDetails.taskDetails.order') }}</option>
        <option value="location1">Location 1</option>
        <option value="location2">Location 2</option>
      </select>

      <input
        type="text"
        v-model="address"
        class="block w-full rounded-md border-gray-300 shadow-sm py-3 px-4"
        :placeholder="t('task.modal.sections.resourceDetails.taskDetails.address')"
      />

      <select 
        v-model="taskTemplate" 
        class="block w-full rounded-md border-gray-300 shadow-sm py-3 px-4"
      >
        <option value="" disabled>{{ t('task.modal.sections.resourceDetails.taskDetails.taskTemplate') }}</option>
        <option value="template1">Template 1</option>
        <option value="template2">Template 2</option>
      </select>

      <textarea
        v-model="resourceDescription"
        rows="3"
        class="block w-full rounded-md border-gray-300 shadow-sm py-3 px-4"
        :placeholder="t('task.modal.sections.resourceDetails.taskDetails.description')"
      ></textarea>
    </div>

    <!-- Resources Section -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900">{{ t('task.modal.sections.resourceDetails.resources.title') }}</h3>
      
      <select 
        v-model="skill" 
        class="block w-full rounded-md border-gray-300 shadow-sm py-3 px-4"
      >
        <option value="" disabled>{{ t('task.modal.sections.resourceDetails.resources.skill') }}</option>
        <option value="skill1">Skill 1</option>
        <option value="skill2">Skill 2</option>
      </select>

      <input
        type="number"
        v-model="userQuantity"
        min="1"
        class="block w-full rounded-md border-gray-300 shadow-sm py-3 px-4"
        :placeholder="t('task.modal.sections.resourceDetails.resources.userQuantity')"
      />

      <select 
        v-model="ratePerHour" 
        class="block w-full rounded-md border-gray-300 shadow-sm py-3 px-4"
      >
        <option value="" disabled>{{ t('task.modal.sections.resourceDetails.resources.ratePerHour') }}</option>
        <option value="rate1">Rate 1</option>
        <option value="rate2">Rate 2</option>
      </select>

      <select 
        v-model="dress" 
        class="block w-full rounded-md border-gray-300 shadow-sm py-3 px-4"
      >
        <option value="" disabled>{{ t('task.modal.sections.resourceDetails.resources.dress') }}</option>
        <option value="dress1">Dress 1</option>
        <option value="dress2">Dress 2</option>
      </select>
    </div>

    <button
      type="submit"
      :disabled="!isValid"
      class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ t('task.modal.save') }}
    </button>
  </div>
</template>
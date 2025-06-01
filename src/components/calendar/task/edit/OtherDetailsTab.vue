<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { useI18n } from "vue-i18n";
import Dresses from "./otherDetails/Dresses.vue";
import RequiredSkills from "./otherDetails/RequiredSkills.vue";
import ContactPersons from "./otherDetails/ContactPersons.vue";
import NotificationTemplates from "./otherDetails/NotificationTemplates.vue";

const { t } = useI18n();

const props = defineProps<{
  requiredSkills: string;
  dress: string;
  language: string;
  teamLeadDescription: string;
  teamLeadContactPerson: string;
  notificationTemplate: string;
}>();

const emit = defineEmits<{
  (e: "update:requiredSkills", value: string): void;
  (e: "update:dress", value: string): void;
  (e: "update:language", value: string): void;
  (e: "update:teamLeadDescription", value: string): void;
  (e: "update:teamLeadContactPerson", value: string): void;
  (e: "update:notificationTemplate", value: string): void;
}>();
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <!-- Required Skills -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.otherDetails.requiredSkills")
        }}</label>
        <!-- <select
          :value="requiredSkills"
          @input="
            emit(
              'update:requiredSkills',
              ($event.target as HTMLSelectElement).value
            )
          "
          class="input-field"
        >
          <option value="" disabled>
            {{ t("task.editSidebar.tabs.otherDetails.requiredSkills") }}
          </option>
          <option value="skill1">Skill 1</option>
          <option value="skill2">Skill 2</option>
          <option value="skill3">Skill 3</option>
        </select> -->
        <required-skills />
      </div>

      <!-- Dress -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.otherDetails.dress")
        }}</label>
        <!-- <select 
          :value="dress"
          @input="emit('update:dress', ($event.target as HTMLSelectElement).value)"
          class="input-field"
        >
          <option value="" disabled>{{ t('task.editSidebar.tabs.otherDetails.dress') }}</option>
          <option value="dress1">Dress 1</option>
          <option value="dress2">Dress 2</option>
          <option value="dress3">Dress 3</option>
        </select> -->
        <dresses />
      </div>

      <!-- Language -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.otherDetails.language")
        }}</label>
        <select
          :value="language"
          @input="
            emit('update:language', ($event.target as HTMLSelectElement).value)
          "
          class="input-field"
        >
          <option value="doesntMatter">
            {{ t("task.editSidebar.tabs.otherDetails.languages.doesntMatter") }}
          </option>
          <option value="english">
            {{ t("task.editSidebar.tabs.otherDetails.languages.english") }}
          </option>
          <option value="german">
            {{ t("task.editSidebar.tabs.otherDetails.languages.german") }}
          </option>
        </select>
      </div>

      <!-- Team Lead Description -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.otherDetails.teamLeadDescription")
        }}</label>
        <textarea
          :value="teamLeadDescription"
          @input="
            emit(
              'update:teamLeadDescription',
              ($event.target as HTMLTextAreaElement).value
            )
          "
          rows="4"
          class="input-field"
          :placeholder="
            t('task.editSidebar.tabs.otherDetails.teamLeadDescription')
          "
        ></textarea>
      </div>

      <!-- Team Lead Contact Person -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.otherDetails.teamLeadContactPerson")
        }}</label>
        <!-- <select
          :value="teamLeadContactPerson"
          @input="
            emit(
              'update:teamLeadContactPerson',
              ($event.target as HTMLSelectElement).value
            )
          "
          class="input-field"
        >
          <option value="" disabled>
            {{ t("task.editSidebar.tabs.otherDetails.teamLeadContactPerson") }}
          </option>
          <option value="person1">Person 1</option>
          <option value="person2">Person 2</option>
          <option value="person3">Person 3</option>
        </select> -->
        <contact-persons />
      </div>

      <!-- Notification Template -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.otherDetails.notificationTemplate")
        }}</label>
        <!-- <select
          :value="notificationTemplate"
          @input="
            emit(
              'update:notificationTemplate',
              ($event.target as HTMLSelectElement).value
            )
          "
          class="input-field"
        >
          <option value="" disabled>
            {{ t("task.editSidebar.tabs.otherDetails.notificationTemplate") }}
          </option>
          <option value="template1">Template 1</option>
          <option value="template2">Template 2</option>
          <option value="template3">Template 3</option>
        </select> -->
        <notification-templates />
      </div>
    </div>
  </div>
</template>

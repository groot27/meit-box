<script setup lang="ts">
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import Dresses from "./otherDetails/Dresses.vue";
import RequiredSkills from "./otherDetails/RequiredSkills.vue";
import ContactPersons from "./otherDetails/ContactPersons.vue";
import Languages from "./otherDetails/Languages.vue";
import NotificationTemplates from "./otherDetails/NotificationTemplates.vue";

const { t } = useI18n();

const props = defineProps<{
  requiredSkills: string | null | undefined;
  dress: string | null | undefined;
  language: Array<string> | null | undefined;
  teamLeadDescription: string | null | undefined;
  teamLeadContactPerson: string | null | undefined;
  notificationTemplate: string | null | undefined;
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

        <required-skills :skill="props.requiredSkills" />
      </div>

      <!-- Dress -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.otherDetails.dress")
        }}</label>
        <dresses :dress="dress" />
      </div>

      <!-- Language -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.otherDetails.language")
        }}</label>
        <languages v-model="props.language" />
      </div>

      <!-- Team Lead Description -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.otherDetails.teamLeadDescription")
        }}</label>
        <textarea
          :value="props.teamLeadDescription"
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
        <contact-persons :person="props.teamLeadContactPerson" />
      </div>

      <!-- Notification Template -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.otherDetails.notificationTemplate")
        }}</label>
        <notification-templates :notification="props.notificationTemplate" />
      </div>
    </div>
  </div>
</template>

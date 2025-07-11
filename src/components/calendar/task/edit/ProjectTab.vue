<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { PermissionType } from "@/types/TaskTypes";
import AddressInput from "@/components/widgets/AddressInput.vue";
import "jodit/build/jodit.min.css";
import { JoditEditor } from "jodit-vue";
import { useRoute } from "vue-router";
import { useCalendarStore } from "@/stores/CalendarStore";

const { t } = useI18n();

const props = defineProps<{
  order: string | null | undefined;
  customer: string | null | undefined;
  taskTitle: string | null | undefined;
  status: string | null | undefined;
  permission: string | null | undefined;
  locationCategory: string | null | undefined;
  location: string | null | undefined;
  locationDescription: string | null | undefined;
  updateTasks: string | null | undefined;
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  startTime: string | null | undefined;
  endTime: string | null | undefined;
  description: string | null | undefined;
}>();

const emit = defineEmits<{
  (e: "update:order", value: string): void;
  (e: "update:taskTitle", value: string): void;
  (e: "update:status", value: string): void;
  (e: "update:permission", value: string): void;
  (e: "update:locationCategory", value: string): void;
  (e: "update:location", value: any): void;
  (e: "update:locationDescription", value: any): void;
  (e: "update:address", value: any): void;
  (e: "update:updateTasks", value: string): void;
  (e: "update:startDate", value: string): void;
  (e: "update:endDate", value: string): void;
  (e: "update:startTime", value: string): void;
  (e: "update:endTime", value: string): void;
  (e: "update:description", value: string): void;
}>();
const calendarStore = useCalendarStore();
const selectedPermission = ref("");
const address = ref("");
const showLocaltionDescription = ref(false);
const locations = computed(() => calendarStore.defaultData.locations);
const allPermissions = ref<PermissionType>({
  admin: 0,
  employee: 0,
  manager: 0,
  all: 0,
});
const route = useRoute();
const displayGoogleInput = ref(false);
const content = computed(() => props.description);
const modules = {
  toolbar: ["bold", "italic", "underline", "ol", "ul"],
  config: {
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
  },
};
const updatePermission = (event) => {
  const value = event.target.value;
  selectedPermission.value = value;
  emit("update:permission", value);
};
// Function to format key names into readable labels
const formatLabel = (key) => {
  const labels = {
    admin: t("task.editSidebar.tabs.project.permissions.admin"),
    employee: t("task.editSidebar.tabs.project.permissions.employee"),
    manager: t("task.editSidebar.tabs.project.permissions.manager"),
    all: t("task.editSidebar.tabs.project.permissions.all"),
  };
  return labels[key] || key;
};
const GOOGLE_API_KEY = "AIzaSyD7fBBrfAmRTdLCO549jxZP3ofuw763zuQ";

const onPlaceChanged = (place: any) => {
  console.log("Selected place:", place);
  emit("update:location", place);
};
const handleShowDescription = () => {
  showLocaltionDescription.value = !showLocaltionDescription.value;
};
watch(
  props,
  () => {
    selectedPermission.value = props.permission;
    allPermissions[selectedPermission.value] = 1;
    if (props.location) {
      address.value = props.location;
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="space-y-6 divide-y">
    <!-- First Section -->
    <div class="space-y-4 pb-6">
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.project.order")
        }}</label>
        <div class="flex gap-x-2">
          <div class="p-3 bg-gray-100 rounded w-1/3">{{ order }}</div>
          <div class="p-3 bg-gray-100 rounded w-2/3">{{ customer }}</div>
        </div>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.project.taskTitle")
        }}</label>
        <input
          type="text"
          :value="taskTitle"
          @input="
            emit('update:taskTitle', ($event.target as HTMLInputElement).value)
          "
          class="input-field"
          :placeholder="t('task.editSidebar.tabs.project.taskTitle')"
        />
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.project.taskStatus")
        }}</label>
        <select
          :value="status"
          @input="
            emit('update:status', ($event.target as HTMLSelectElement).value)
          "
          class="input-field"
        >
          <option value="done">
            {{ t("task.editSidebar.tabs.project.status.done") }}
          </option>
          <option value="not_confirmed">
            {{ t("task.editSidebar.tabs.project.status.notConfirmed") }}
          </option>
          <option value="confirmed">
            {{ t("task.editSidebar.tabs.project.status.confirmed") }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.project.permission")
        }}</label>
        <select
          :value="selectedPermission"
          @change="updatePermission($event)"
          class="input-field"
        >
          <option
            v-for="(label, key) in allPermissions"
            :value="key"
            v-bind:key="key"
          >
            {{ formatLabel(key) }}
          </option>
        </select>
      </div>
    </div>

    <!-- Second Section -->
    <div class="space-y-4 py-6">
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.project.locationCategory")
        }}</label>
        <select
          :value="locationCategory"
          @input="
            emit(
              'update:locationCategory',
              ($event.target as HTMLSelectElement).value
            )
          "
          class="input-field"
        >
          <option
            v-for="locationCat in locations"
            :key="locationCat.name"
            :value="locationCat.name"
          >
            {{ locationCat.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.project.location")
        }}</label>
        <div class="w-full h-auto relative" v-show="!displayGoogleInput">
          <input
            type="text"
            :value="location"
            @input="
              emit('update:location', ($event.target as HTMLInputElement).value)
            "
            class="input-field"
            :placeholder="t('task.editSidebar.tabs.project.location')"
          />
          <button
            class="text-lg h-full absolute right-0"
            @click="
              () => {
                displayGoogleInput = !displayGoogleInput;
              }
            "
          >
            <font-awesome-icon :icon="['fas', 'pencil']" class="mr-2" />
          </button>
        </div>
        <AddressInput
          v-show="displayGoogleInput"
          :apiKey="GOOGLE_API_KEY"
          :address="location"
          @placeChanged="onPlaceChanged"
        />
        <button class="text-blue-500 text-sm" @click="handleShowDescription">
          {{ t("task.editSidebar.tabs.project.showDesc") }}
        </button>
      </div>
      <div class="form-group" v-show="showLocaltionDescription">
        <label class="block text-sm font-medium text-gray-700"
          >Location Description</label
        >

        <input
          type="text"
          :value="locationDescription"
          @input="
            emit(
              'update:locationDescription',
              ($event.target as HTMLInputElement).value
            )
          "
          class="input-field"
          :placeholder="t('task.editSidebar.tabs.project.location')"
        />
      </div>
    </div>

    <!-- Third Section -->
    <div class="space-y-4 py-6">
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.project.updateTasks")
        }}</label>
        <select
          :value="updateTasks"
          @input="
            emit(
              'update:updateTasks',
              ($event.target as HTMLSelectElement).value
            )
          "
          class="input-field"
        >
          <option value="all">
            {{ t("task.editSidebar.tabs.project.updateOptions.all") }}
          </option>
          <option value="current">
            {{ t("task.editSidebar.tabs.project.updateOptions.current") }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.project.startEndDate")
        }}</label>
        <div class="grid grid-cols-2 gap-4">
          <input
            type="date"
            :value="startDate"
            @change="
              emit(
                'update:startDate',
                ($event.target as HTMLInputElement).value
              )
            "
            class="input-field"
          />
          <input
            v-show="!route.params.taskId"
            type="date"
            :value="endDate"
            :min="startDate"
            @change="
              emit('update:endDate', ($event.target as HTMLInputElement).value)
            "
            class="input-field"
          />
        </div>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.project.time")
        }}</label>
        <div class="grid grid-cols-2 gap-4">
          <input
            type="time"
            lang="en-GB"
            :value="startTime"
            @input="
              emit(
                'update:startTime',
                ($event.target as HTMLInputElement).value
              )
            "
            class="input-field"
          />
          <input
            type="time"
            lang="en-GB"
            :value="endTime"
            :min="startTime"
            @input="
              emit('update:endTime', ($event.target as HTMLInputElement).value)
            "
            class="input-field"
          />
        </div>
      </div>
    </div>

    <!-- Fourth Section -->
    <div class="space-y-4 pt-6">
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.project.taskDescription")
        }}</label>
        <jodit-editor
          v-model="content"
          :buttons="modules.toolbar"
          :config="modules.config"
          @update:model-value="emit('update:description', $event)"
        />
      </div>
    </div>
  </div>
</template>

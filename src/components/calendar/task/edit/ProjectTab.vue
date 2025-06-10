<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { PermissionType } from "@/types/TaskTypes";
import AddressInput from "@/components/widgets/AddressInput.vue";
import "jodit/build/jodit.min.css";
import { JoditEditor } from "jodit-vue";

const { t } = useI18n();

const props = defineProps<{
  order: string;
  customer: string;
  taskTitle: string;
  status: string;
  permission: string;
  locationCategory: string;
  location: string;
  locationDescription: string;
  updateTasks: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
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

const selectedPermission = ref("");
const address = ref("");
const showLocaltionDescription = ref(false);
const allPermissions = ref<PermissionType>({
  admin: 0,
  employee: 0,
  manager: 0,
  all: 0,
});

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
    admin: "Admin",
    employee: "Employee",
    manager: "Manager",
    all: "All Access",
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
watch(props, () => {
  selectedPermission.value = props.permission;
  allPermissions[selectedPermission.value] = 1;
  if (props.location) {
    address.value = props.location;
  }
});
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
          <option :value="locationCategory">
            {{ locationCategory }}
          </option>
          <option value="berlin">
            {{ t("task.editSidebar.tabs.project.locations.berlin") }}
          </option>
          <option value="dessau">
            {{ t("task.editSidebar.tabs.project.locations.dessau") }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700">{{
          t("task.editSidebar.tabs.project.location")
        }}</label>

        <AddressInput
          :apiKey="GOOGLE_API_KEY"
          :address="props.location"
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
            @input="
              emit(
                'update:startDate',
                ($event.target as HTMLInputElement).value
              )
            "
            class="input-field"
          />
          <input
            type="date"
            :value="endDate"
            @input="
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
        />
      </div>
    </div>
  </div>
</template>

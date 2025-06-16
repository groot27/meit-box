<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Task, TaskEditType } from "@/types/TaskTypes";
import ProjectTab from "./edit/ProjectTab.vue";
import ResourcesTab from "./edit/ResourcesTab.vue";
import OtherDetailsTab from "./edit/OtherDetailsTab.vue";
import ActivityTab from "./edit/ActivityTab.vue";
import DocumentsTab from "./edit/DocumentsTab.vue";
import { useTaskStore } from "@/stores/TaskStore";
import { useCalendarStore } from "@/stores/CalendarStore";
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { taskApi } from "@/api/taskApi";
import { useGlobalStore } from "@/stores/index";
import { addDays, format } from "date-fns";
const taskStore = useTaskStore();
const globalStore = useGlobalStore();
const calendarStore = useCalendarStore();

const { t } = useI18n();

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "update", task: Task): void;
  (e: "create", task: Task): void;
}>();

const activeTab = ref("project");

const singleTask = computed<TaskEditType | undefined>(
  () => taskStore.selectedTask
);
const route = useRoute();
const router = useRouter();
const comments = ref([]);
const histories = ref([]);
const handleSubmit = () => {
  if (!singleTask) return;
  if (route.params.taskId) {
    console.log("🚀 ~ handleSubmit ~ update");
    emit("update", singleTask);
  } else {
    console.log("🚀 ~ handleSubmit ~ create");
    emit("create", singleTask);
  }
};
const addRelatedTasks = () => {
  taskStore.removeRelatedTasks();
  let currentDate = new Date(singleTask.value.details.date);
  const endDate = new Date(singleTask.value.details.endDate);
  currentDate = addDays(currentDate, 1);
  while (currentDate <= endDate) {
    taskStore.addRelatedDate({
      startDate: format(currentDate, "yyyy-MM-dd"),
      startTime: singleTask.value.details.startTime,
      endTime: singleTask.value.details.endTime,
    });
    currentDate = addDays(currentDate, 1);
  }
};

const handleClose = () => {
  taskStore.setSelectedTask(null);
  emit("close");
};

const handleAddDocuments = (files: File[]) => {
  const formData = new FormData();
  formData.append("order_id", singleTask.value.orderDetails.id.toString());
  formData.append("task_id", singleTask.value.details.id.toString());
  formData.append("file", files[0]);
  const fileName = files[0].name.split(".")[0];
  globalStore.setLoadingApi(true);
  const onSuccess = (res) => {
    singleTask.value.attachments.push({ id: res.document_id, name: fileName });
    globalStore.setLoadingApi(false);
  };
  taskApi.addDocument(formData, { onSuccess });
};

const handleRemoveDocument = (docId: string) => {
  const onSuccess = () => {
    singleTask.value.attachments = singleTask.value.attachments.filter(
      (file) => file.id != docId
    );
    globalStore.setLoadingApi(false);
  };
  globalStore.setLoadingApi(true);
  taskApi.removeDocument(docId, { onSuccess });
};
const handleArchiveClick = () => {
  taskStore.setArchiveModalDispay(true);
};

const updateResourcesIdsTask = (id, type) => {
  switch (type) {
    case "Employee":
      if (singleTask.value.details.employeesIds) {
        singleTask.value.details.employeesIds.push(id);
      } else {
        singleTask.value.details.employeesIds = [id];
      }
      singleTask.value.details.employeesCount =
        singleTask.value.details.employeesIds.length;
      break;
    case "Vehicle":
      if (singleTask.value.details.vehiclesIds) {
        singleTask.value.details.vehiclesIds.push(id);
      } else {
        singleTask.value.details.vehiclesIds = [id];
      }
      singleTask.value.details.vehiclesCount =
        singleTask.value.details.vehiclesIds.length;
      break;
    default:
      if (singleTask.value.details.devicesIds) {
        singleTask.value.details.devicesIds.push(id);
      } else {
        singleTask.value.details.devicesIds = [id];
      }
      break;
  }
  // emit("update", singleTask);
};
const updateLocation = (place) => {
  const onSuccess = (res) => {
    globalStore.setLoadingApi(false);
    if (!res.resource_category_id) {
      singleTask.value.details.resourceLocationCategory = "";
    }
    singleTask.value.details.resourceLocationCategory =
      calendarStore.defaultData.locations.find(
        (location) => location.id === res.resource_category_id
      ).name;
  };
  if (place.geometry) {
    singleTask.value.orderDetails.latitude = place.geometry.location.lat();
    singleTask.value.orderDetails.longitude = place.geometry.location.lng();
    singleTask.value.details.location = place.formatted_address;
    globalStore.setLoadingApi(true);
    taskApi.getLocationCategory(
      {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      },
      { onSuccess }
    );
  } else if (place) {
    singleTask.value.details.location = place;
  }
};
const updateRepeatTask = async (dateTime) => {
  await taskStore.addRelatedResources(
    route.params.taskId,
    singleTask,
    dateTime
  );
  // window.location = "/monthly-view2";
  router.push("/monthly-view2");
};
const updateRelatedTask = () => {
  singleTask.value.relatedTasks.forEach((task) => {
    if (task.details.id === singleTask.value.details.id) {
      task.details.date = singleTask.value.details.date;
      task.details.startTime = singleTask.value.details.startTime;
      task.details.endTime = singleTask.value.details.endTime;
    }
  });
};
</script>

<template>
  <div
    class="fixed inset-y-0 right-0 w-[600px] bg-white shadow-xl transform transition-transform duration-300 z-50"
    :class="show ? 'translate-x-0' : 'translate-x-full'"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b">
      <button
        class="rounded border-gray-400 border-2 text-center p-2"
        @click="handleArchiveClick"
      >
        <font-awesome-icon
          v-show="calendarStore.filterTasks !== 'archive_date'"
          icon="fa-solid fa-inbox"
          class="w-5 h-5 text-gray-400"
        />
        <font-awesome-icon
          v-show="calendarStore.filterTasks === 'archive_date'"
          icon="fa-solid fa-trash-arrow-up"
          class="w-5 h-5 text-gray-400"
        />
      </button>

      <div class="pt-2 flex gap-x-2">
        <button
          @click="handleClose"
          class="w-full px-2 py-3 text-sm font-medium text-white bg-red-400 rounded-md hover:bg-red-500"
        >
          {{ t("task.editSidebar.discard") }}
        </button>
        <button
          @click="handleSubmit"
          type="submit"
          class="w-full px-2 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {{ t("task.editSidebar.saveChanges") }}
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b px-4">
      <div class="flex items-center justify-between">
        <button
          v-for="tab in [
            'project',
            'resources',
            'otherDetails',
            'activity',
            'documents',
          ]"
          :key="tab"
          @click="activeTab = tab"
          class="px-3 py-2 text-sm font-medium whitespace-nowrap"
          :class="
            activeTab === tab
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          "
        >
          {{ t(`task.modal.tabs.${tab}`) }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-128px)] h-full">
      <!-- Project Tab -->
      <ProjectTab
        v-if="activeTab === 'project'"
        v-model:order="singleTask.orderDetails.orderNumber"
        v-model:customer="singleTask.orderDetails.customerName"
        v-model:taskTitle="singleTask.details.title"
        v-model:status="singleTask.details.status"
        v-model:permission="singleTask.details.permission"
        v-model:locationCategory="singleTask.details.resourceLocationCategory"
        v-model:location="singleTask.details.location"
        v-model:locationDescription="singleTask.details.locationDescription"
        v-model:updateTasks="singleTask.details.updateTasks"
        v-model:startDate="singleTask.details.date"
        v-model:endDate="singleTask.details.endDate"
        v-model:startTime="singleTask.details.startTime"
        v-model:endTime="singleTask.details.endTime"
        v-model:description="singleTask.details.description"
        @update:location="updateLocation"
        @update:endDate="addRelatedTasks"
        @update:startDate="updateRelatedTask"
        @update:startTime="updateRelatedTask"
        @update:endTime="updateRelatedTask"
      />

      <!-- Resources Tab -->
      <ResourcesTab
        v-if="activeTab === 'resources'"
        v-model:devices="singleTask.details.allDevicesCount"
        v-model:vehicle="singleTask.details.allVehiclesCount"
        v-model:employees="singleTask.details.allEmployeesCount"
        v-model:resourcesValues="singleTask.resources"
        v-model:date="singleTask.details.date"
        v-model:startTime="singleTask.details.startTime"
        v-model:endTime="singleTask.details.endTime"
        v-model:relatedTasks="singleTask.relatedTasks"
        v-model:taskId="singleTask.details.id"
        @update:resourcesIds="updateResourcesIdsTask"
        @update:repeatTask="updateRepeatTask"
      />
      <!-- Other Details Tab -->
      <OtherDetailsTab
        v-if="activeTab === 'otherDetails'"
        v-model:requiredSkills="singleTask.otherDetails.requiredSkills"
        v-model:dress="singleTask.otherDetails.dress"
        v-model:language="singleTask.otherDetails.language"
        v-model:teamLeadDescription="
          singleTask.otherDetails.teamLeadDescription
        "
        v-model:teamLeadContactPerson="
          singleTask.otherDetails.teamLeadContactPerson
        "
        v-model:notificationTemplate="
          singleTask.otherDetails.notificationTemplate
        "
      />

      <!-- Activity Tab -->
      <ActivityTab
        v-if="activeTab === 'activity'"
        :comments="singleTask.activities.comments"
        :history="singleTask.activities.histories"
      />

      <!-- Documents Tab -->
      <DocumentsTab
        v-if="activeTab === 'documents'"
        :documents="singleTask.attachments || []"
        @add="handleAddDocuments"
        @remove="handleRemoveDocument"
      />
    </div>
  </div>
</template>

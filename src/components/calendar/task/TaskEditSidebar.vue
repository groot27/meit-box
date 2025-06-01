<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Task } from "@/types/TaskTypes";
import ProjectTab from "./edit/ProjectTab.vue";
import ResourcesTab from "./edit/ResourcesTab.vue";
import OtherDetailsTab from "./edit/OtherDetailsTab.vue";
import ActivityTab from "./edit/ActivityTab.vue";
import DocumentsTab from "./edit/DocumentsTab.vue";
import { useTaskStore } from "@/stores/TaskStore";
import { useCalendarStore } from "@/stores/CalendarStore";
import { reactive } from "vue";
import { useRoute } from "vue-router";
import { taskApi } from "@/api/taskApi";
import { useGlobalStore } from "@/stores/index";
const taskStore = useTaskStore();
const globalStore = useGlobalStore();
const calendarStore = useCalendarStore();

const { t } = useI18n();

const props = defineProps<{
  task: Task | null;
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "update", task: Task): void;
  (e: "create", task: Task): void;
}>();

const activeTab = ref("project");

const singleTask = reactive<any>({
  title: "",
  description: "",
  date: "",
  orderDetails: {},
  taskTemplate: {},
  activities: {},
});
const route = useRoute();
// Other Details tab state
const requiredSkills = ref("");
const dress = ref("");
const language = ref("doesntMatter");
const teamLeadDescription = ref("");
const teamLeadContactPerson = ref("");
const notificationTemplate = ref("");
const comments = ref([]);
const histories = ref([]);
// Mock data for activity
const mockComments = [
  {
    id: "1",
    author: "John Doe",
    content: "Added new resource requirements",
    timestamp: "2025-03-15T10:30:00Z",
    avatarUrl: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "2",
    author: "Jane Smith",
    content: "Updated location details",
    timestamp: "2025-03-15T11:15:00Z",
    avatarUrl: "https://i.pravatar.cc/40?img=2",
  },
];

const mockHistory = [
  {
    id: "1",
    user: "System",
    action: "created",
    timestamp: "2025-03-15T09:00:00Z",
  },
  {
    id: "2",
    user: "John Doe",
    action: "updated",
    field: "title",
    oldValue: "Old Title",
    newValue: "New Title",
    timestamp: "2025-03-15T10:00:00Z",
  },
];

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      activeTab.value = "project";
      Object.assign(singleTask, newTask);

      comments.value = singleTask.activities.comments;
      histories.value = singleTask.activities.logs;
      // Initialize other details
      requiredSkills.value = newTask.otherDetails?.requiredSkills || "";
      dress.value = newTask.otherDetails?.dress || "";
      language.value = newTask.otherDetails?.language || "doesntMatter";
      teamLeadDescription.value =
        newTask.otherDetails?.teamLeadDescription || "";
      teamLeadContactPerson.value =
        newTask.otherDetails?.teamLeadContactPerson || "";
      notificationTemplate.value =
        newTask.otherDetails?.notificationTemplate || "";
    }
  },
  { immediate: true }
);

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

const handleClose = () => {
  emit("close");
};

const handleAddDocuments = (files: File[]) => {
  const formData = new FormData();
  formData.append("order_id", singleTask.orderDetails.id);
  formData.append("task_id", singleTask.taskTemplate.id);
  formData.append("file", files[0]);
  const fileName = files[0].name.split(".")[0];
  globalStore.setLoadingApi(true);
  const onSuccess = (res) => {
    singleTask.attachments.push({ id: res.document_id, name: fileName });
    globalStore.setLoadingApi(false);
  };
  taskApi.addDocument(formData, { onSuccess });
};

const handleRemoveDocument = (docId: string) => {
  const onSuccess = () => {
    singleTask.attachments = singleTask.attachments.filter(
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
          class="w-full px-6 py-3 text-sm font-medium text-white bg-red-400 rounded-md hover:bg-red-500"
        >
          {{ t("task.editSidebar.discard") }}
        </button>
        <button
          @click="handleSubmit"
          type="submit"
          class="w-full px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
    <div class="p-6 space-y-4 overflow-y-auto h-full">
      <!-- Project Tab -->
      <ProjectTab
        v-if="activeTab === 'project'"
        v-model:order="singleTask.orderDetails.id"
        v-model:customer="singleTask.orderDetails.customerName"
        v-model:taskTitle="singleTask.title"
        v-model:status="singleTask.status"
        v-model:permission="singleTask.taskTemplate.permission"
        v-model:locationCategory="singleTask.location"
        v-model:location="singleTask.address"
        v-model:updateTasks="singleTask.updateTasks"
        v-model:startDate="singleTask.startDate"
        v-model:endDate="singleTask.endDate"
        v-model:startTime="singleTask.startTime"
        v-model:endTime="singleTask.endTime"
        v-model:description="singleTask.description"
      />

      <!-- Resources Tab -->
      <ResourcesTab
        v-if="activeTab === 'resources'"
        v-model:devices="singleTask.taskTemplate.devices"
        v-model:vehicle="singleTask.taskTemplate.vehicle"
        v-model:employees="singleTask.taskTemplate.employees"
        v-model:resourcesValues="singleTask.resources"
      />

      <!-- Other Details Tab -->
      <OtherDetailsTab
        v-if="activeTab === 'otherDetails'"
        v-model:requiredSkills="requiredSkills"
        v-model:dress="dress"
        v-model:language="language"
        v-model:teamLeadDescription="teamLeadDescription"
        v-model:teamLeadContactPerson="teamLeadContactPerson"
        v-model:notificationTemplate="notificationTemplate"
      />

      <!-- Activity Tab -->
      <ActivityTab
        v-if="activeTab === 'activity'"
        :comments="comments"
        :history="histories"
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

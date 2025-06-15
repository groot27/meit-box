<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeUnmount } from "vue";
import AddDateModal from "./resources/AddDateModal.vue";
import ResourcesTable from "./resources/resourcesTable/ResourcesTable.vue";
import { useGlobalStore } from "@/stores/index";
import { useToast } from "vue-toastification";
import { taskApi } from "@/api/taskApi";
import { useCalendarStore } from "@/stores/CalendarStore";
import { useTaskStore } from "@/stores/TaskStore";
import { useRoute } from "vue-router";

const { t } = useI18n();
const globalStore = useGlobalStore();
const toast = useToast();
const route = useRoute();
const props = defineProps<{
  devices: number | null | undefined;
  vehicle: number | null | undefined;
  employees: number | null | undefined;
  resourcesValues: any | null | undefined;
  date: string | null | undefined;
  startTime: string | null | undefined;
  endTime: string | null | undefined;
  relatedTasks: any | null | undefined;
  taskId: number | null | undefined;
}>();
const emit = defineEmits<{
  (e: "update:resourcesIds", id, type: string): void;
  (e: "update:repeatTask", time: any): void;
}>();
const showAddDate = ref(false);
const employeeData = ref(null);
const deviceData = ref(null);
const vehicleData = ref(null);
const showIcons = ref(false);
const showHiddens = ref(false);
const selectedRescources = ref([]);
const calendarStore = useCalendarStore();
const taskStore = useTaskStore();
const hiddenResources = ref([
  {
    id: 1,
    name: "",
    number: null,
    resourcesId: null,
    type: "Employee",
    count: 0,
    status: "Open",
  },
]);
const activeDropdown = ref(null);
const dropdownRefs = ref([]);

const handleClickOutside = (event) => {
  const isClickInsideAnyDropdown = dropdownRefs.value.some(
    (el) => el && el.contains(event.target)
  );
  if (!isClickInsideAnyDropdown) {
    activeDropdown.value = null;
  }
};

const addResources = (type: string) => {
  selectedRescources.value.forEach((taskId) => {
    taskStore.addResource(taskId, type);
  });
};
const handleAddDate = () => {
  showAddDate.value = !showAddDate.value;
};

const handleAddSubTask = (time) => {
  emit("update:repeatTask", time);
};

const sendNotification = async (res) => {
  if (res.message == "fail") {
    toast.error("please set task template");
    globalStore.setLoadingApi(false);
    return;
  }
  if (res.data == null) {
    globalStore.setLoadingApi(false);
    return;
  }
  if (res.data.email) {
    if (!res.data.data.notification_template) {
      toast.error("please set Notification Template");
      globalStore.setLoadingApi(false);
      return;
    }
    if (!res.data.data.notification_template.template_content) {
      toast.error(
        "please set Content for selected Notification Template Time Sheet"
      );
      globalStore.setLoadingApi(false);
      return;
    }
    await taskApi.sendOrderNotification({
      orderId: res.data.order_id,
      emails: [res.data.email_address],
      subject: res.data.notification_template.template_name,
      email: true,
      message: res.data.notification_template.template_content,
      notification_template: res.data.notification_template.id,
      documentFiles: [],
      uploadedDocs: [res.data.order_document_id],
      task_id: props.taskId,
    });
    toast[res.data.status === "true" ? "success" : "error"](res.data.msg);
    globalStore.setLoadingApi(false);
  } else {
    toast.error("Order Not Found");
  }
};
const handleTimeSheet = () => {
  const onSuccess = (res) => {
    sendNotification(res);
  };
  globalStore.setLoadingApi(true);
  taskApi.sendTimeSheet(
    {
      task_id: props.taskId,
      "selected_task_id[0]": props.taskId,
    },
    { onSuccess }
  );
};
const handleShowIcons = (taskId, selected: boolean) => {
  if (selected) {
    selectedRescources.value = [...selectedRescources.value, taskId];
  } else {
    selectedRescources.value = selectedRescources.value.filter(
      (item) => item !== taskId
    );
  }
};
const handleHiddenResources = async () => {
  globalStore.setLoadingApi(true);
  const res = await taskApi.getHiddenRscorces(props.taskId);
  if (res.data.rejected_user && res.data.rejected_user.length) {
    hiddenResources.value = [];
    res.data.rejected_user.forEach((resource, index) => {
      hiddenResources.value.push({
        id: index,
        resourcesId: resource.id,
        number: resource.mobile_number,
        name: resource.username,
        type: "Employee",
        count: 0,
        status: "reject",
      });
    });
  }
  globalStore.setLoadingApi(false);
  showHiddens.value = true;
};
const handdleShowResources = () => {
  showHiddens.value = false;
};
watch(
  selectedRescources,
  () => {
    showIcons.value = selectedRescources.value.length > 0;
  },
  { deep: true, immediate: true }
);
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  if (props) {
    employeeData.value = calendarStore.defaultData.employees;
    vehicleData.value = calendarStore.defaultData.vehicles;
    deviceData.value = calendarStore.defaultData.devices;
    let count = 1;
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div
    class="flex items-center justify-between bg-blue-300 p-2 rounded-tl rounded-tr h-[60px]"
  >
    <div class="flex items-center space-x-2 p-2">
      <input type="checkbox" class="rounded border-gray-300" />
      <span class="text-sm font-medium">{{
        t("task.editSidebar.tabs.resources.upcoming")
      }}</span>
    </div>
    <div class="flex items-center space-x-8" v-show="showIcons">
      <div class="flex space-x-2 items-center">
        <button
          class="p-1 hover:bg-gray-100 rounded-full"
          @click="handleTimeSheet"
        >
          <font-awesome-icon
            icon="fa-solid fa-file-pdf"
            class="text-gray-900"
          />
        </button>
        <button
          class="p-1 hover:bg-gray-100 rounded-full"
          @click="handdleShowResources"
        >
          <font-awesome-icon icon="fa-solid fa-user" class="text-gray-900" />
        </button>
        <button
          class="p-1 hover:bg-gray-100 rounded-full"
          @click="handleHiddenResources"
        >
          <font-awesome-icon
            icon="fa-solid fa-user-alt-slash"
            class="text-gray-500"
          />
        </button>
      </div>
      <div class="flex space-x-2 items-center">
        <button
          class="p-1 hover:bg-gray-100 rounded-full"
          @click="addResources('Device')"
        >
          <font-awesome-icon icon="fa-solid fa-tools" class="text-gray-900" />
        </button>
        <button
          class="p-1 hover:bg-gray-100 rounded-full"
          @click="addResources('Vehicle')"
        >
          <font-awesome-icon icon="fa-solid fa-truck" class="text-gray-900" />
        </button>
        <button
          class="p-1 hover:bg-gray-100 rounded-full"
          @click="addResources('Employee')"
        >
          <font-awesome-icon
            icon="fa-solid fa-user-plus"
            class="text-gray-900"
          />
        </button>
      </div>
    </div>
  </div>
  <div class="">
    <template v-for="task in props.relatedTasks" :key="task.id">
      <resources-table
        v-model:devices="task.details.devices"
        v-model:vehicle="task.details.vehicle"
        v-model:employees="task.details.employees"
        v-model:resourcesValues="task.resources"
        v-model:date="task.date"
        v-model:startTime="task.startTime"
        v-model:endTime="task.endTime"
        v-model:taskId="task.details.id"
        v-model:resources="task.mappedResources"
        @show-icons="handleShowIcons"
      />
    </template>
    <div class="relative">
      <span
        v-if="route.params.taskId"
        class="text-blue-500 cursor-pointer"
        @click="handleAddDate"
        >Add Date</span
      >
      <add-date-modal v-on:add-date="handleAddSubTask" v-if="showAddDate" />
    </div>
  </div>
</template>

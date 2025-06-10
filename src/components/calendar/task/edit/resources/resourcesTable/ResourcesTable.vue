<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import EmployeeSelect from "./EmployeeSelect.vue";
import VehicleSelect from "./VehicleSelect.vue";
import DevicesSelect from "./DevicesSelect.vue";
import { taskApi } from "@/api/taskApi";
import { statusColorClasses } from "@/types/TaskTypes";
import { useGlobalStore } from "@/stores";
import { onBeforeUnmount } from "vue";
import { useCalendarStore } from "@/stores/CalendarStore";
import { useTaskStore } from "@/stores/TaskStore";
import { useToast } from "vue-toastification";
const toast = useToast();

const { t } = useI18n();
const taskStore = useTaskStore();
const props = defineProps<{
  devices: string;
  vehicle: string;
  employees: string;
  resourcesValues: any;
  date: string;
  startTime: string;
  endTime: string;
  taskId: number;
}>();
const emit = defineEmits<{
  (e: "update:resourcesIds", id, type: string): void;
  (e: "update:repeatTask", time: any): void;
}>();
const globalStore = useGlobalStore();
const employeeData = ref(null);
const deviceData = ref(null);
const vehicleData = ref(null);
const showIcons = ref(false);
const showHiddens = ref(false);
const calendarStore = useCalendarStore();

const resources = ref([
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
const status = {
  Employee: [
    "open",
    "confirmed",
    "checked_out",
    "no_show",
    "prechecked",
    "checked_in",
    "reject",
  ],
  Vehicle: ["open", "planned"],
  Device: ["open", "planned"],
};
const activeDropdown = ref(null);
const dropdownRefs = ref([]);
const toggleDropdown = (index) => {
  activeDropdown.value = activeDropdown.value === index ? null : index;
};

const setDropdownRef = (el, index) => {
  if (el) dropdownRefs.value[index] = el;
};

const handleClickOutside = (event) => {
  const isClickInsideAnyDropdown = dropdownRefs.value.some(
    (el) => el && el.contains(event.target)
  );
  if (!isClickInsideAnyDropdown) {
    activeDropdown.value = null;
  }
};
const addResources = (type: string) => {
  resources.value.push({
    id: resources.value.length + 1,
    resourcesId: null,
    name: type,
    number: null,
    type: type,
    count: 0,
    status: "open",
  });
  taskStore.addResource(props.taskId, type);
};
const updateStatus = (id, status, type) => {
  if (type == "Employee") {
    updateEmployeeStatus(id, status);
  } else {
    updateVehicleStatus(id, status);
  }
};
const handleWhatsAppLink = async (resource, type) => {
  if (!resource.resourcesId || !resource.number) {
    return;
  }
  const onSuccess = (res) => {
    window.open(res.url, "_blank");
    globalStore.setLoadingApi(false);
    activeDropdown.value = null;
  };
  globalStore.setLoadingApi(true);
  await taskApi.sendToWhatsapp(
    {
      employee_id: resource.resourcesId,
      number: resource.number,
      task_id: props.taskId,
      with_notification_template: type === "notification" ? true : false,
    },
    { onSuccess }
  );
};
const updateEmployeeStatus = async (id, status) => {
  if (!props.taskId) {
    return;
  }
  globalStore.setLoadingApi(true);
  if (status === "reject") {
    await taskApi.removeEmployee({
      task_id: props.taskId,
      type: "emp",
      user_id: id,
    });
    resources.value = resources.value.filter(
      (resource) => resource.resourcesId !== id
    );
  } else {
    await taskApi.updateEmployeeStatus({
      status: status === "confirmed" ? "assigned" : status,
      new_resource: false,
      user_id: id,
      task_id: props.taskId,
      type: "emp",
    });
    resources.value.forEach((resource) => {
      if (resource.resourcesId == id) {
        resource.status = status;
      }
    });
  }
  globalStore.setLoadingApi(false);
};
const updateVehicleStatus = async (id, status) => {
  globalStore.setLoadingApi(true);
  if (!props.taskId) {
    return;
  }
  if (status === "reject") {
    await taskApi.removeEmployee({
      task_id: props.taskId,
      type: "emp",
      user_id: id,
    });
    resources.value = resources.value.filter(
      (resource) => resource.resourcesId !== id
    );
  } else {
    await taskApi.updateEmployeeStatus({
      status: status === "confirmed" ? "assigned" : status,
      new_resource: false,
      user_id: id,
      task_id: props.taskId,
      type: "emp",
    });
    resources.value.forEach((resource) => {
      if (resource.resourcesId == id) {
        resource.status = status;
      }
    });
  }
  globalStore.setLoadingApi(false);
};

const updateIdsOfTask = (id, type) => {
  taskStore.addResourcesId(props.taskId, id, type);
};
const getUserStatus = (status) => {
  let newStatus;
  switch (status) {
    case "assigned":
      newStatus = "confirmed";
      break;
    case "":
      newStatus = "no_show";
      break;
    default:
      newStatus = status;
  }
  return newStatus;
};
const newStatus = (index, type) => {
  taskStore.addAssignedResource(props.taskId, type);
  resources.value.forEach((resource) => {
    if (resource.id === index) {
      resource.status = type === "Employee" ? "confirmed" : "planned";
    }
  });
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

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  if (props) {
    employeeData.value = calendarStore.defaultData.employees;
    vehicleData.value = calendarStore.defaultData.vehicles;
    deviceData.value = calendarStore.defaultData.devices;
    let count = 1;
    resources.value = [];
    for (let i = 1; i <= Number(props.employees); i++) {
      if (
        !props.resourcesValues.users[i - 1] ||
        props.resourcesValues.users[i - 1].status !== "rejected"
      ) {
        resources.value.push({
          id: count,
          resourcesId: props.resourcesValues.users[i - 1]
            ? props.resourcesValues.users[i - 1].id
            : null,
          number: props.resourcesValues.users[i - 1]
            ? props.resourcesValues.users[i - 1].mobile_number
            : null,
          name:
            props.resourcesValues && props.resourcesValues.users[i - 1]
              ? props.resourcesValues.users[i - 1].username
              : "Employee",
          type: "Employee",
          count: 0,
          status:
            props.resourcesValues && props.resourcesValues.users[i - 1]
              ? getUserStatus(props.resourcesValues.users[i - 1].user_status)
              : "open",
        });
        count++;
      }
    }
    for (let i = 1; i <= Number(props.vehicle); i++) {
      resources.value.push({
        id: count,
        resourcesId: props.resourcesValues.vehicles[i - 1]
          ? props.resourcesValues.vehicles[i - 1].id
          : null,
        name:
          props.resourcesValues && props.resourcesValues.vehicles[i - 1]
            ? props.resourcesValues.vehicles[i - 1].number_plate
            : "Vehicle",
        type: "Vehicle",
        count: 0,
        number: 0,
        status:
          props.resourcesValues && props.resourcesValues.vehicles[i - 1]
            ? props.resourcesValues.vehicles[i - 1].status
            : "open",
      });
      count++;
    }
    for (let i = 1; i <= Number(props.devices); i++) {
      resources.value.push({
        id: count,
        resourcesId: null,
        name: "Device",
        type: "Device",
        count: 0,
        number: 0,
        status: "open",
      });
      count++;
    }
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<template>
  <div
    class="flex items-center justify-between bg-blue-300 p-2 rounded-tl rounded-tr h-full"
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

  <div
    class="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 p-2"
  >
    <input
      type="checkbox"
      class="rounded border-gray-300"
      :checked="showIcons"
      @change="() => (showIcons = !showIcons)"
    />
    <div class="flex justify-between w-full">
      <span>{{ date }}</span>
      <div>
        <span>{{ `${startTime}-${endTime}` }}</span>
        <font-awesome-icon
          icon="fa-solid fa-check"
          class="text-gray-500 ml-2"
        />
      </div>
    </div>
  </div>
  <table class="w-full">
    <thead class="text-sm text-gray-600 bg-gray-50">
      <tr>
        <th class="text-left font-medium py-2">
          {{ t("task.editSidebar.tabs.resources.name") }}
        </th>
        <th class="text-center font-medium py-2">
          {{ t("task.editSidebar.tabs.resources.details") }}
        </th>
        <th class="text-right font-medium py-2">
          {{ t("task.editSidebar.tabs.resources.status") }}
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-if="!showHiddens">
        <tr v-for="resource in resources" :key="resource.id" class="border-t">
          <td class="py-2">
            <employee-select
              v-if="resource.type === 'Employee' && employeeData"
              :employee="{ key: resource.resourcesId, value: resource.name }"
              :row="resource.id"
              :employees="employeeData"
              :taskId="props.taskId"
              @update:Ids="updateIdsOfTask"
              @addNewStatus="newStatus"
            />
            <devices-select
              v-if="resource.type === 'Device' && deviceData"
              :device="resource.name"
              :devices="deviceData"
            />
            <vehicle-select
              v-if="resource.type === 'Vehicle' && vehicleData"
              :vehicle="{ key: resource.resourcesId, value: resource.name }"
              :row="resource.id"
              :taskId="props.taskId"
              :vehicles="vehicleData"
              @update:Ids="updateIdsOfTask"
              @addNewStatus="newStatus"
            />
          </td>
          <td class="text-center py-2">
            <div
              class="flex items-center justify-center space-x-1 relative"
              ref="dropdownRefs"
            >
              <button
                class="p-1 hover:bg-gray-100 rounded"
                @click="toggleDropdown(resource.id)"
              >
                <font-awesome-icon
                  :icon="['fab', 'whatsapp']"
                  v-if="resource.type === 'Employee'"
                />
              </button>
              <div
                v-show="activeDropdown == resource.id"
                class="absolute left-12 top-2 rounded p-2 bg-gray-100 textblack space-y-2"
                :ref="(el) => setDropdownRef(el, resource.id)"
              >
                <button
                  class="hover:bg-gray-200 rounded p-2 text-sm"
                  value="whatsapp"
                  @click="handleWhatsAppLink(resource, 'whatsapp')"
                >
                  Whatsapp
                </button>
                <button
                  class="hover:bg-gray-200 rounded p-2 whitespace-nowrap text-sm"
                  value="notification"
                  @click="handleWhatsAppLink(resource, 'notification')"
                >
                  Notification Template
                </button>
              </div>
            </div>
          </td>
          <td class="text-right py-2">
            <select
              v-model="resource.status"
              class="ext-sm"
              :class="statusColorClasses[resource.status]"
              @change="
                updateStatus(
                  resource.resourcesId,
                  resource.status,
                  resource.type
                )
              "
            >
              <option
                v-for="option in status[resource.type]"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </td>
        </tr>
      </template>
      <template v-else>
        <tr
          v-for="resource in hiddenResources"
          :key="resource.id"
          class="border-t"
        >
          <td class="py-2">
            <span>{{ resource.name }}</span>
          </td>
          <td class="text-right py-2">
            <select
              v-model="resource.status"
              class="ext-sm"
              :class="statusColorClasses[resource.status]"
              @change="
                updateStatus(
                  resource.resourcesId,
                  resource.status,
                  resource.type
                )
              "
            >
              <option
                v-for="option in status[resource.type]"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import EmployeeSelect from "./EmployeeSelect.vue";
import VehicleSelect from "./VehicleSelect.vue";
import DevicesSelect from "./DevicesSelect.vue";
import { taskApi } from "@/api/taskApi";
import { statusColorClasses } from "@/types/TaskTypes";
import { useGlobalStore } from "@/stores";
import { useCalendarStore } from "@/stores/CalendarStore";
import { useTaskStore } from "@/stores/TaskStore";
import { useToast } from "vue-toastification";
const toast = useToast();

const { t } = useI18n();
const taskStore = useTaskStore();
const props = defineProps<{
  devices: string | null | undefined;
  vehicle: string | null | undefined;
  employees: string | null | undefined;
  resourcesValues: any | null | undefined;
  date: string | null | undefined;
  startTime: string | null | undefined;
  endTime: string | null | undefined;
  taskId: number | null | undefined;
  resources: any | null | undefined;
}>();
const emit = defineEmits<{
  (e: "update:resourcesIds", id, type: string): void;
  (e: "update:repeatTask", time: any): void;
  (e: "showIcons", taskId: number, selected: boolean): void;
}>();
const globalStore = useGlobalStore();
const employeeData = ref(null);
const deviceData = ref(null);
const vehicleData = ref(null);
const selected = ref(false);
const showHiddens = ref(false);
const calendarStore = useCalendarStore();

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
const toggleDropdown = (index) => {
  activeDropdown.value = activeDropdown.value === index ? null : index;
};
const handleSelected = () => {
  selected.value = !selected.value;
  emit("showIcons", props.taskId, selected.value);
};
const setDropdownRef = (el, index) => {
  if (el) dropdownRefs.value[index] = el;
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
const formatLabel = (key) => {
  const labels = {
    confirmed: t("task.editSidebar.tabs.resources.statuses.confirmed"),
    checked_out: t("task.editSidebar.tabs.resources.statuses.checked_out"),
    no_show: t("task.editSidebar.tabs.resources.statuses.no_show"),
    prechecked: t("task.editSidebar.tabs.resources.statuses.prechecked"),
    open: t("task.editSidebar.tabs.resources.statuses.open"),
    planned: t("task.editSidebar.tabs.resources.statuses.planned"),
    reject: t("task.editSidebar.tabs.resources.statuses.reject"),
    remove: t("task.editSidebar.tabs.resources.statuses.remove"),
    checked_in: t("task.editSidebar.tabs.resources.statuses.checked_in"),
  };
  return labels[key] || key;
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
  } else {
    await taskApi.updateEmployeeStatus({
      status: status === "confirmed" ? "assigned" : status,
      new_resource: false,
      user_id: id,
      task_id: props.taskId,
      type: "emp",
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
  } else {
    await taskApi.updateEmployeeStatus({
      status: status === "confirmed" ? "assigned" : status,
      new_resource: false,
      user_id: id,
      task_id: props.taskId,
      type: "emp",
    });
  }
  globalStore.setLoadingApi(false);
};
const setFirstResources = () => {
  props.resources.forEach((resource) => {
    if (resource.resourcesId) {
      updateIdsOfTask(resource.resourcesId, resource.id, resource.type);
    }
  });
};
const updateIdsOfTask = (id, rowIndex, type) => {
  taskStore.addResourcesId(props.taskId, id, rowIndex, type);
};
onMounted(() => {
  // document.addEventListener("click", handleClickOutside);
  if (props) {
    employeeData.value = calendarStore.defaultData.employees;
    vehicleData.value = calendarStore.defaultData.vehicles;
    deviceData.value = calendarStore.defaultData.devices;
    setFirstResources();
  }
});
</script>
<template>
  <div
    class="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 p-2"
  >
    <input
      type="checkbox"
      class="rounded border-gray-300"
      :checked="selected"
      @change="handleSelected"
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
              :key="resource.id"
              :employee="{ key: resource.resourcesId, value: resource.name }"
              :row="resource.id"
              :employees="employeeData"
              :taskId="props.taskId"
              @update:Ids="updateIdsOfTask"
            />
            <devices-select
              v-if="resource.type === 'Device' && deviceData"
              :device="resource.name"
              :devices="deviceData"
              :row="resource.id"
              :key="resource.id"
              :taskId="props.taskId"
              @update:Ids="updateIdsOfTask"
            />
            <vehicle-select
              v-if="resource.type === 'Vehicle' && vehicleData"
              :vehicle="{ key: resource.resourcesId, value: resource.name }"
              :row="resource.id"
              :key="resource.id"
              :taskId="props.taskId"
              :vehicles="vehicleData"
              @update:Ids="updateIdsOfTask"
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
                {{ formatLabel(option) }}
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
                {{ formatLabel(option) }}
              </option>
            </select>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

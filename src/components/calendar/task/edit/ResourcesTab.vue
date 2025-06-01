<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import EmployeeSelect from "./resources/EmployeeSelect.vue";
import VehicleSelect from "./resources/VehicleSelect.vue";
import DevicesSelect from "./resources/DevicesSelect.vue";
import { taskApi } from "@/api/taskApi";

const { t } = useI18n();
const props = defineProps<{
  devices: string;
  vehicle: string;
  employees: string;
  resourcesValues: any;
}>();
const employeeData = ref(null);
const deviceData = ref(null);
const vehicleData = ref(null);
const fetchEmployeeData = async (query: string = "") => {
  // let loading = true;
  try {
    const res = await taskApi.getTaskUsers(query);
    employeeData.value = res.data;
  } finally {
    // loading = false;
  }
};
const fetchVehicleData = async (query: string = "") => {
  // let loading = true;
  try {
    const res = await taskApi.getTaskVehicles(query);
    vehicleData.value = res.data;
  } finally {
    // loading = false;
  }
};
const fetchDeviceData = async (query: string = "") => {
  // let loading = true;
  try {
    const res = await taskApi.getTaskDevices(query);
    deviceData.value = res.data;
  } finally {
    // loading = false;
  }
};
const resources = ref([
  {
    id: 1,
    name: "",
    type: "Employee",
    count: 0,
    status: "Open",
  },
  {
    id: 2,
    name: "",
    type: "Vehicle",
    count: 0,
    status: "Open",
  },
  {
    id: 3,
    name: "",
    type: "Device",
    count: 0,
    status: "Open",
  },
]);
onMounted(() => {
  if (props) {
    fetchEmployeeData();
    fetchDeviceData();
    fetchVehicleData();
    let count = 1;
    resources.value = [];
    for (let i = 1; i <= Number(props.employees); i++) {
      props.resourcesValues[i - 1];
      resources.value.push({
        id: count,
        name: props.resourcesValues.users[i - 1]
          ? props.resourcesValues.users[i - 1].username
          : "Employee",
        type: "Employee",
        count: 0,
        status: props.resourcesValues.users[i - 1]
          ? props.resourcesValues.users[i - 1].status
          : "Open",
      });
      count++;
    }
    for (let i = 1; i <= Number(props.vehicle); i++) {
      resources.value.push({
        id: count,
        name: props.resourcesValues.vehicles[i - 1]
          ? props.resourcesValues.vehicles[i - 1].number_plate
          : "Vehicle",
        type: "Vehicle",
        count: 0,
        status: props.resourcesValues.vehicles[i - 1]
          ? props.resourcesValues.vehicles[i - 1].status
          : "Open",
      });
      count++;
    }
    for (let i = 1; i <= Number(props.devices); i++) {
      resources.value.push({
        id: count,
        name: "Device",
        type: "Device",
        count: 0,
        status: "Open",
      });
      count++;
    }
  }
});
</script>

<template>
  <div class="">
    <div
      class="flex items-center justify-between bg-blue-300 p-2 rounded-tl rounded-tr h-full"
    >
      <div class="flex items-center space-x-2">
        <input type="checkbox" class="rounded border-gray-300" />
        <span class="text-sm font-medium">{{
          t("task.editSidebar.tabs.resources.upcoming")
        }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <button class="p-2 hover:bg-gray-100 rounded-full">
          <svg
            class="w-5 h-5 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        </button>
        <button class="p-2 hover:bg-gray-100 rounded-full">
          <svg
            class="w-5 h-5 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
        </button>
        <button class="p-2 hover:bg-gray-100 rounded-full">
          <svg
            class="w-5 h-5 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      class="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 p-2"
    >
      <input type="checkbox" class="rounded border-gray-300" />
      <span>08.04.2025</span>
      <span>00:00-00:00</span>
      <button class="p-1 hover:bg-gray-100 rounded">
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </button>
    </div>

    <table class="w-full">
      <thead class="text-sm text-gray-600 bg-gray-50">
        <tr>
          <th class="text-left font-medium py-2">
            {{ t("task.editSidebar.tabs.resources.name") }}
          </th>
          <th class="text-center font-medium py-2">
            {{ t("task.editSidebar.tabs.resources.count") }}
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
        <tr v-for="resource in resources" :key="resource.id" class="border-t">
          <td class="py-2">
            <employee-select
              v-if="resource.type === 'Employee' && employeeData"
              :employee="resource.name"
              :employees="employeeData"
            />
            <devices-select
              v-if="resource.type === 'Device' && deviceData"
              :device="resource.name"
              :devices="deviceData"
            />
            <vehicle-select
              v-if="resource.type === 'Vehicle' && vehicleData"
              :vehicle="resource.name"
              :vehicles="vehicleData"
            />
          </td>
          <td class="text-center py-2">
            <input
              type="number"
              :value="resource.count"
              min="0"
              class="w-12 text-center bg-transparent border-none"
            />
          </td>
          <td class="text-center py-2">
            <div class="flex items-center justify-center space-x-1">
              <font-awesome-icon
                v-if="resource.type === 'Employee'"
                icon="fa-solid fa-user"
                class="text-gray-500"
              />
              <font-awesome-icon
                v-if="resource.type === 'Vehicle'"
                icon="fa-solid fa-car"
                class="text-gray-500"
              />
              <button class="p-1 hover:bg-gray-100 rounded">
                <svg
                  class="w-4 h-4 text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button class="p-1 hover:bg-gray-100 rounded">
                <svg
                  class="w-4 h-4 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
            </div>
          </td>
          <td class="text-right py-2">
            <button
              class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              {{ resource.status }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

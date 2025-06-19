<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { taskApi } from "@/api/taskApi";
import { useI18n } from "vue-i18n";
import { useGlobalStore } from "@/stores/index";
import { useRoute } from "vue-router";

const { t } = useI18n();
const globalStore = useGlobalStore();
const route = useRoute();
type deviceType = {
  key: number;
  value: string;
};
const props = defineProps<{
  device: deviceType | null | undefined;
  devices: any | null | undefined;
  row: number | null | undefined;
  taskId: number | null | undefined;
}>();
const emit = defineEmits<{
  (e: "update", selectedDevice);
  (e: "update:Ids", employeeId, row: number, type: string);
  // (e: "addNewStatus", row: number, type: string);
}>();

const selectedDevice = ref(null);
const oldSelectedDevice = ref(null);
const deviceId = ref(null);
const deviceLoading = ref(false);
const deviceOptions = ref<string[]>([]);
const fetchDeviceOptions = async (query: string = "") => {
  deviceLoading.value = true;
  try {
    const res = await taskApi.getTaskDevices(query);
    deviceOptions.value = res.data.map((device) => {
      return { key: device.id, value: device.device_number };
    });
  } finally {
    deviceLoading.value = false;
  }
};
// const confirmedDevice = async (
//   newDevice: deviceType,
//   oldDevice: deviceType
// ) => {
//   globalStore.setLoadingApi(true);
//   await taskApi.confirmDeviceTask({
//     check_conflict_task: true,
//     replaced_value: oldDevice.key,
//     resource_id: newDevice.key,
//     task_id: props.taskId,
//   });
//   emit("update:Ids", newDevice.key, "Device");
//   emit("addNewStatus", props.row, "Device");
//   globalStore.setLoadingApi(false);
// };

const setNewDevice = (device: deviceType) => {
  if (device.value && device.value != props.device.value) {
    // if (!route.params.taskId) {
    emit("update:Ids", device.key, props.row, "Device");
    // emit("addNewStatus", props.row, "Device");
    return;
    // }
    // confirmedDevice(device, props.device);
  }
};
onMounted(() => {
  if (props.devices) {
    deviceOptions.value = props.devices.map((device) => {
      return { key: device.id, value: device.device_number };
    });
    if (props.device.value !== "Device") {
      selectedDevice.value = props.device;
      deviceId.value = props.device.value;
      // emit("update:Ids", props.device.key, "Device");
    }
    oldSelectedDevice.value = props.device;
  }
});
</script>
<template>
  <async-select
    v-model="selectedDevice"
    :options="deviceOptions"
    :placeholder="t('common.placeholder.device')"
    :loading="deviceLoading"
    @search="fetchDeviceOptions"
    @update:model-value="setNewDevice"
  />
</template>

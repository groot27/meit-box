<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { taskApi } from "@/api/taskApi";

const props = defineProps<{
  device: string;
  devices: any;
}>();
const emit = defineEmits<{
  (e: "update", selectedDevice);
}>();

const selectedDevice = ref("");
const deviceLoading = ref(false);
const deviceOptions = ref<string[]>([]);
const fetchDeviceOptions = async (query: string = "") => {
  deviceLoading.value = true;
  try {
    const res = await taskApi.getTaskDevices(query);
    deviceOptions.value = res.data.map((device) => device.device_number);
  } finally {
    deviceLoading.value = false;
  }
};
watch(selectedDevice, () => {
  if (selectedDevice) {
    emit("update", selectedDevice);
  }
});
onMounted(() => {
  if (props.devices) {
    selectedDevice.value = props.device;
    deviceOptions.value = props.devices.map((device) => device.device_number);
  }
});
</script>
<template>
  <async-select
    v-model="selectedDevice"
    :options="deviceOptions"
    placeholder="Device"
    :loading="deviceLoading"
    @search="fetchDeviceOptions"
  />
</template>

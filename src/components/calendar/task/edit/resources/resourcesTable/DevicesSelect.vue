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
  (e: "update", selectedVehicle);
  (e: "update:Ids", employeeId, type: string);
  (e: "addNewStatus", row: number, type: string);
}>();

const selectedVehicle = ref(null);
const oldSelectedVehicle = ref(null);
const deviceId = ref(null);
const deviceLoading = ref(false);
const deviceOptions = ref<string[]>([]);
const fetchVehicleOptions = async (query: string = "") => {
  deviceLoading.value = true;
  try {
    const res = await taskApi.getTaskVehicles(query);
    deviceOptions.value = res.data.map((device) => device.number_plate);
  } finally {
    deviceLoading.value = false;
  }
};
const confirmedVehicle = async (
  newVehicle: deviceType,
  oldVehicle: deviceType
) => {
  globalStore.setLoadingApi(true);
  await taskApi.confirmVehicleTask({
    check_conflict_task: true,
    replaced_value: oldVehicle.key,
    resource_id: newVehicle.key,
    task_id: props.taskId,
  });
  emit("update:Ids", newVehicle.key, "Vehicle");
  emit("addNewStatus", props.row, "Vehicle");
  globalStore.setLoadingApi(false);
};

const setNewVehicle = (device: deviceType) => {
  if (device.value && device.value != props.device.value) {
    if (!route.params.taskId) {
      emit("update:Ids", device.key, "Vehicle");
      emit("addNewStatus", props.row, "Vehicle");
      return;
    }
    confirmedVehicle(device, props.device);
  }
};
onMounted(() => {
  if (props.devices) {
    deviceOptions.value = props.devices.map((device) => {
      return { key: device.id, value: device.number_plate };
    });
    if (props.device.value !== "Vehicle") {
      selectedVehicle.value = props.device;
      deviceId.value = props.device.value;
      // emit("update:Ids", props.device.key, "Vehicle");
    }
    oldSelectedVehicle.value = props.device;
  }
});
</script>
<template>
  <async-select
    v-model="selectedVehicle"
    :options="deviceOptions"
    :placeholder="t('common.placeholder.device')"
    :loading="deviceLoading"
    @search="fetchVehicleOptions"
    @update:model-value="setNewVehicle"
  />
</template>

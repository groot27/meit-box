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
type vehicleType = {
  key: number;
  value: string;
};
const props = defineProps<{
  vehicle: vehicleType | null | undefined;
  vehicles: any | null | undefined;
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
const vehicleId = ref(null);
const vehicleLoading = ref(false);
const vehicleOptions = ref<string[]>([]);
const fetchVehicleOptions = async (query: string = "") => {
  vehicleLoading.value = true;
  try {
    const res = await taskApi.getTaskVehicles(query);
    vehicleOptions.value = res.data.map((vehicle) => vehicle.number_plate);
  } finally {
    vehicleLoading.value = false;
  }
};
const confirmedVehicle = async (
  newVehicle: vehicleType,
  oldVehicle: vehicleType
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

const setNewVehicle = (vehicle: vehicleType) => {
  if (vehicle.value && vehicle.value != props.vehicle.value) {
    if (!route.params.taskId) {
      emit("update:Ids", vehicle.key, "Vehicle");
      emit("addNewStatus", props.row, "Vehicle");
      return;
    }
    confirmedVehicle(vehicle, props.vehicle);
  }
};
onMounted(() => {
  if (props.vehicles) {
    vehicleOptions.value = props.vehicles.map((vehicle) => {
      return { key: vehicle.id, value: vehicle.number_plate };
    });
    if (props.vehicle.value !== "Vehicle") {
      selectedVehicle.value = props.vehicle;
      vehicleId.value = props.vehicle.value;
      // emit("update:Ids", props.vehicle.key, "Vehicle");
    }
    oldSelectedVehicle.value = props.vehicle;
  }
});
</script>
<template>
  <async-select
    v-model="selectedVehicle"
    :options="vehicleOptions"
    :placeholder="t('common.placeholder.vehicle')"
    :loading="vehicleLoading"
    @search="fetchVehicleOptions"
    @update:model-value="setNewVehicle"
  />
</template>

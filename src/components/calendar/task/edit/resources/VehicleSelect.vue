<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { taskApi } from "@/api/taskApi";

const props = defineProps<{
  vehicle: string;
  vehicles: any;
}>();
const emit = defineEmits<{
  (e: "update", selectedVehicle);
}>();

const selectedVehicle = ref("");
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
watch(selectedVehicle, () => {
  if (selectedVehicle) {
    emit("update", selectedVehicle);
  }
});
onMounted(() => {
  if (props.vehicles) {
    selectedVehicle.value = props.vehicle;
    vehicleOptions.value = props.vehicles.map(
      (vehicle) => vehicle.number_plate
    );
  }
});
</script>
<template>
  <async-select
    v-model="selectedVehicle"
    :options="vehicleOptions"
    placeholder="Vehicle"
    :loading="vehicleLoading"
    @search="fetchVehicleOptions"
  />
</template>

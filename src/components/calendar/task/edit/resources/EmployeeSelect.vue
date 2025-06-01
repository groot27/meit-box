<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { taskApi } from "@/api/taskApi";

const props = defineProps<{
  employee: string;
  employees: any;
}>();
const emit = defineEmits<{
  (e: "update", selectedEmployee);
}>();

const selectedEmployee = ref("");
const employeeLoading = ref(false);
const employeeOptions = ref<string[]>([]);
const fetchEmployeeOptions = async (query: string = "") => {
  employeeLoading.value = true;
  try {
    const res = await taskApi.getTaskUsers(query);
    employeeOptions.value = res.data.map((user) => user.username);
  } finally {
    employeeLoading.value = false;
  }
};
watch(selectedEmployee, () => {
  if (selectedEmployee) {
    emit("update", selectedEmployee);
  }
});
onMounted(() => {
  if (props.employees) {
    selectedEmployee.value = props.employee;
    employeeOptions.value = props.employees.map((user) => user.username);
  }
});
</script>
<template>
  <async-select
    v-model="selectedEmployee"
    :options="employeeOptions"
    placeholder="Employee"
    :loading="employeeLoading"
    @search="fetchEmployeeOptions"
  />
</template>

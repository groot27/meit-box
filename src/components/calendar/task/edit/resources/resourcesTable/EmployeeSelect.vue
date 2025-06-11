<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import AsyncSelect from "@/components/widgets/AsyncSelect.vue";
import { taskApi } from "@/api/taskApi";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useGlobalStore } from "@/stores/index";
import { useToast } from "vue-toastification";

const route = useRoute();
const toast = useToast();
const { t } = useI18n();

const globalStore = useGlobalStore();
type employeeType = {
  key: number;
  value: string;
};
const props = defineProps<{
  employee: employeeType;
  employees: any;
  row: number;
  taskId: number;
}>();
const emit = defineEmits<{
  (e: "update", selectedEmployee);
  (e: "update:Ids", employeeId, type: string);
  (e: "addNewStatus", row: number, type: string);
}>();

const selectedEmployee = ref(null);
const employeeId = ref(null);
const employeeName = ref(null);
const employeeLoading = ref(false);
const employeeOptions = ref<string[]>([]);
const fetchEmployeeOptions = async (query: string = "") => {
  employeeLoading.value = true;
  try {
    const res = await taskApi.getTaskUsers(query);
    employeeOptions.value = res.data.map((user) => {
      return { key: user.id, value: user.username };
    });
  } finally {
    employeeLoading.value = false;
  }
};

const confirmedEmployee = async (employee: employeeType) => {
  if (!route.params.taskId) {
    selectedEmployee.value = employee.value;
    emit("update:Ids", employee.key, "Employee");
    emit("addNewStatus", props.row, "Employee");
    return;
  }
  globalStore.setLoadingApi(true);
  employeeId.value = employee.key;
  employeeName.value = employee.value;
  const onSuccess = (res) => {
    if (res.status == 400) {
      toast.error(res.message);
      selectedEmployee.value = null;
    } else {
      emit("update:Ids", employee.key, "Employee");
      emit("addNewStatus", props.row, "Employee");
    }
  };
  await taskApi.confirmEmployeeTask(
    {
      extra_emp: [[], []],
      new_resource: false,
      resource_id: employee.key,
      task_id: props.taskId,
      type: "emp",
    },
    { onSuccess }
  );
  globalStore.setLoadingApi(false);
};
onMounted(() => {
  if (props.employees) {
    employeeOptions.value = props.employees.map((user) => {
      return { key: user.id, value: user.username };
    });
    if (props.employee.value !== "Employee") {
      selectedEmployee.value = props.employee;
      employeeId.value = props.employee.key;
      employeeName.value = props.employee.value;
      emit("update:Ids", employeeId.value, "Employee");
    }
  }
});
</script>
<template>
  <router-link
    v-if="selectedEmployee"
    class="text-blue-400"
    :to="`/user/${employeeId}`"
    >{{ employeeName }}</router-link
  >
  <async-select
    v-else
    v-model="selectedEmployee"
    :options="employeeOptions"
    :placeholder="t('common.placeholder.employee')"
    :loading="employeeLoading"
    @search="fetchEmployeeOptions"
    @update:model-value="confirmedEmployee"
  />
</template>

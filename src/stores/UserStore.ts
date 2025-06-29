import { defineStore } from "pinia";
import { ref } from "vue";
import { useGlobalStore } from ".";
import { userApi } from "@/api/userApi";

export const useUserStore = defineStore("dashboard", () => {
  const globalStore = useGlobalStore();
  const userRole = ref("");
  const userData = ref(null);
  const loading = ref(false);
  const setRole = (role: string) => {
    userRole.value = role;
  };
  const getRoles = async () => {
    try {
      globalStore.setLoadingApi(true);
      const res = await userApi.getRoles();
      setRole(res.data.role);
      userData.value = res.data;

      globalStore.setLoadingApi(false);
    } catch (error) {
      console.error("Error loading default data:", error);
      globalStore.setLoadingApi(false);
    } finally {
      globalStore.setLoadingApi(false);
      loading.value = false;
    }
  };

  return {
    loading,
    userRole,
    getRoles,
  };
});

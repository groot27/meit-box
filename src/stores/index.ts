import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";

export const useGlobalStore = defineStore("globalStore", () => {
  const loadingApi = ref(false);

  const setLoadingApi = (loading: boolean) => {
    loadingApi.value = loading;
  };

  return {
    loadingApi,
    setLoadingApi,
  };
});

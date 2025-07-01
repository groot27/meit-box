import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";

export const useGlobalStore = defineStore("globalStore", () => {
  const loadingApi = ref(false);
  const displayHelper = ref(false);

  const setLoadingApi = (loading: boolean) => {
    loadingApi.value = loading;
  };
  const setDisplayHelper = (loading: boolean) => {
    displayHelper.value = loading;
  };

  return {
    loadingApi,
    displayHelper,
    setDisplayHelper,
    setLoadingApi,
  };
});

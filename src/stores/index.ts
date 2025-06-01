import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";

export const useGlobalStore = defineStore("globalStore", () => {
  const loadingApi = ref(false);
  function setLoadingApi(loading: boolean) {
    loadingApi.value = loading;
  }

  return {
    loadingApi,
    setLoadingApi,
  };
});

import { api } from "./index";

type Callbacks<T = any> = {
  onSuccess?: (response: T) => void;
  onError?: (error: any) => void;
};

export const dashboardApi = {
  getWidgets: async (callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/dashboard/widgets`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  fetchHeaderSearch: async (
    searchType: string,
    keyword: string = "",
    callbacks?: Callbacks
  ) => {
    try {
      const res = await api.get(
        `/dashboard-fast-landing/${searchType}/${keyword}`
      );
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
};

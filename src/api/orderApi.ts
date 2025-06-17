import { api } from "./index";

type Callbacks<T = any> = {
  onSuccess?: (response: T) => void;
  onError?: (error: any) => void;
};

export const orderApi = {
  getAll: async (queryString: string = "", callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/orders?${queryString}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getHeaders: async (queryString: string = "", callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/orders/headers?${queryString}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
};

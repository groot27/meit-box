import { api } from "./index";

type Callbacks<T = any> = {
  onSuccess?: (response: T) => void;
  onError?: (error: any) => void;
};

export const userApi = {
  getRoles: async (callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/users/show`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
};

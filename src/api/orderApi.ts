import { api } from "./index";

type Callbacks<T = any> = {
  onSuccess?: (response: T) => void;
  onError?: (error: any) => void;
};

export const orderApi = {
  getAll: async (queryString: string = "", callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/orders/search?${queryString}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getExport: async (queryString: string = "", callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/api/get-offers?${queryString}`);
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
  getCustomers: async (keyword: string = "", callbacks?: Callbacks) => {
    try {
      const res = await api.get(
        `/edit-order-paginated-customers?term=${keyword}`
      );
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getContactPersons: async (keyword: string = "", callbacks?: Callbacks) => {
    try {
      const res = await api.get(
        `/v2/contact-persons?filter[keyword]=${keyword}`
      );
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getFiltersData: async (queryString: string = "", callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/orders/data-sources${queryString}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  togglePin: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/api/toggle_is_pinned`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  removeOne: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/api/toggle_is_pinned`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  canRemove: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/can-manager-delete`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  toggleOrderColumn: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.patch(`/v2/orders/toggle-order-column`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  create: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/add-order`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
};

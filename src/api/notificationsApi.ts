import { api } from "./index";

type Callbacks<T = any> = {
  onSuccess?: (response: T) => void;
  onError?: (error: any) => void;
};

export const notificationsApi = {
  getUnread: async (callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/get-offer-status-notifications/`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  markAsRead: async (id: string, callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/mark-as-read/${id}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  markAllAsRead: async (callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/mark-all_notification-as-read`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
};

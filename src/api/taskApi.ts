import { api } from "./index";

type Callbacks<T = any> = {
  onSuccess?: (response: T) => void;
  onError?: (error: any) => void;
};

export const taskApi = {
  getAll: async (queryString: string = "", callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/tasks?${queryString}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getUpcommingTasks: async (
    queryString: string = "",
    callbacks?: Callbacks
  ) => {
    try {
      const res = await api.get(`/v2/tasks/upcoming?${queryString}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getHiddenRscorces: async (id: string, callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/hidden-task/${id}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },

  updateOne: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/task-new/updateDashboard/`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },

  getOne: async (id: string, callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/tasks/${id}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },

  updateDocument: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/task-new/update-task-documents`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  addDocument: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/v2/tasks/documents/add`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  removeDocument: async (id: string, callbacks?: Callbacks) => {
    try {
      const res = await api.delete(`/v2/tasks/documents/${id}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  create: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/task-new-create`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  confirmVehicleTask: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/confirm-vehicle`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  deleteVehicleTask: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/delete-vehicle-task`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  confirmEmployeeTask: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/comfirm-employee-task`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  updateEmployeeStatus: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/task-employee-user-status`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  removeEmployee: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/task-employee-remove-planned`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  archive: async (id: string, type: string, callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/archive-task/${id}?type=${type}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getTaskTitles: async (title: string = "", callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/templates?filter[task_title]=${title}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getTaskOrders: async (keyWord: string = "", callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/orders?filter[keyword]=${keyWord}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getTaskSkills: async (callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/skills?`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getTaskUsers: async (keyWord: string = "", callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/users?filter[keyword]=${keyWord}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getTaskDevices: async (keyWord: string = "", callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/devices?filter[keyword]=${keyWord}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getTaskVehicles: async (keyWord: string = "", callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/vehicles?filter[keyword]=${keyWord}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getTaskContactPersons: async (
    keyWord: string = "",
    callbacks?: Callbacks
  ) => {
    try {
      const res = await api.get(
        `/v2/contact-persons?filter[keyword]=${keyWord}`
      );
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getTaskNotificationTemplates: async (
    keyWord: string = "",
    callbacks?: Callbacks
  ) => {
    try {
      const res = await api.get(
        `/v2/notification-templates?filter[keyword]=${keyWord}`
      );
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  getTaskDresses: async (keyWord: string = "", callbacks?: Callbacks) => {
    try {
      const res = await api.get(`/v2/dresses?filter[keyword]=${keyWord}`);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  sendToWhatsapp: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/send-to-whatsapp`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  sendTimeSheet: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/task/timesheet`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  sendOrderNotification: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/send-order-notification`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
  exportPdfTasks: async (data: any, callbacks?: Callbacks) => {
    try {
      const res = await api.post(`/task-pdf-export`, data);
      callbacks?.onSuccess?.(res);
      return res;
    } catch (err) {
      callbacks?.onError?.(err);
      throw err;
    }
  },
};

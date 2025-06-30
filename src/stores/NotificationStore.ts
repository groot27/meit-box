import { dashboardApi } from "@/api/dashboardApi";
import { notificationsApi } from "@/api/notificationsApi";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificationStore = defineStore("notifications", () => {
  const unreadNotifications = ref(null);

  const getNotifications = async () => {
    const res = await notificationsApi.getUnread();
    unreadNotifications.value = res.map((notif) => {
      return {
        id: notif.id,
        read: false,
        title: `${notif.data.observer_name} ${notif.data.status} Offer`,
        time: notif.data.date,
        orderId: notif.data.order_id,
        orderNumber: notif.data.order_number,
      };
    });
  };
  const markAsRead = async (id) => {
    const res = await notificationsApi.markAsRead(id);
    unreadNotifications.value = unreadNotifications.value.filter(
      (notif) => notif.id !== id
    );
  };
  const markAllAsRead = async (id) => {
    const res = await notificationsApi.markAllAsRead();
    unreadNotifications.value = [];
  };

  return {
    unreadNotifications,
    getNotifications,
    markAllAsRead,
    markAsRead,
  };
});

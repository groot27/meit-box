<script setup lang="ts">
import { useNotificationStore } from "@/stores/NotificationStore";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const notificationStore = useNotificationStore();
const notificationCount = ref(20);
const unreadCount = ref(0);
const showNotifications = ref(false);
const notifications = computed(() => notificationStore.unreadNotifications);
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};
const markAllAsRead = () => {
  notificationStore.markAllAsRead();
};
const markAsRead = (notificationId: string) => {
  notificationStore.markAsRead(notificationId);
};
const handleNotificationClick = (notification) => {};
// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  const dropdown = document.querySelector(".notifications-dropdown");
  const button = document.querySelector(".notifications-button");

  if (
    dropdown &&
    button &&
    !dropdown.contains(target) &&
    !button.contains(target)
  ) {
    showNotifications.value = false;
  }
};

// Add event listener for clicking outside
if (typeof window !== "undefined") {
  document.addEventListener("click", handleClickOutside);
}
onMounted(() => {
  notificationStore.getNotifications();
});
</script>
<template>
  <!-- Notifications Dropdown -->
  <div class="relative">
    <button
      @click="toggleNotifications"
      class="notifications-button relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
    >
      <font-awesome-icon icon="fa-solid fa-bell" class="w-5 h-5" />
      <span
        v-if="notifications && notifications.length > 0"
        class="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
      >
        {{ notifications.length }}
      </span>
    </button>

    <!-- Notifications Dropdown -->
    <div
      v-if="showNotifications"
      class="notifications-dropdown absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
    >
      <!-- Dropdown Header -->
      <div
        v-if="notifications"
        class="flex items-center justify-between p-4 border-b border-gray-200"
      >
        <h3 class="text-lg font-semibold text-gray-900">
          {{ t("common.notifications.title") }}
        </h3>
        <button
          @click="markAllAsRead"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium"
          :disabled="notifications && notifications.length === 0"
          :class="{
            'opacity-50 cursor-not-allowed': notifications.length === 0,
          }"
        >
          {{ t("common.notifications.markAllRead") }}
        </button>
      </div>

      <!-- Notifications List -->
      <div class="max-h-80 overflow-y-auto">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          @click="handleNotificationClick(notification)"
          class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
          :class="{ 'bg-blue-50': !notification.read }"
        >
          <div class="flex items-start space-x-3">
            <!-- Notification Icon -->
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center p-2"
                :class="notification.read ? 'bg-gray-100' : 'bg-blue-100'"
              >
                <font-awesome-icon
                  icon="fa-solid fa-user"
                  class="w-5 h-5 text-gray-400"
                />
              </div>
            </div>

            <!-- Notification Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <p
                  class="text-sm font-medium truncate"
                  :class="notification.read ? 'text-gray-700' : 'text-gray-900'"
                >
                  {{ notification.title }}
                </p>
                <button
                  v-if="!notification.read"
                  @click="markAsRead(notification.id)"
                  class="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0 ml-2"
                ></button>
              </div>
              <router-link
                :to="`/finance-dashboard?order_id=${notification.orderId}`"
                class="text-sm text-gray-600 mt-1 line-clamp-2"
              >
                {{ notification.orderNumber }}
              </router-link>
              <p class="text-xs text-gray-500 mt-1">
                {{ notification.time }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="notifications && notifications.length === 0"
          class="p-8 text-center text-gray-500"
        >
          <svg
            class="w-12 h-12 mx-auto mb-4 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0-15 0v5h5l-5 5-5-5h5V7a9.5 9.5 0 0 1 19 0v10z"
            />
          </svg>
          <p class="text-sm">{{ t("comon.notifications.empty") }}</p>
        </div>
      </div>

      <!-- Dropdown Footer -->
      <div class="p-3 border-t border-gray-200 bg-gray-50">
        <button
          class="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
          @click="showNotifications = false"
        >
          {{ t("orders.notifications.viewAll") }}
        </button>
      </div>
    </div>
  </div>
</template>

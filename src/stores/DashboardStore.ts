import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { MapOrder, MapFilters, MapSettings } from "@/types/DashboardTypes";
import { useGlobalStore } from ".";
import { orderApi } from "@/api/orderApi";
import { getLocation } from "@/utils/OrderUtils";
import { dashboardApi } from "@/api/dashboardApi";

export const useDashboardStore = defineStore("dashboard", () => {
  const globalStore = useGlobalStore();
  const loading = ref(false);
  const selectedOrder = ref<MapOrder | null>(null);
  const mapBounds = ref<google.maps.LatLngBounds | null>(null);
  const filters = reactive<MapFilters>({
    status: "",
    search: "",
    dateRange: {
      start: "",
      end: "",
    },
  });
  const moreOptions = reactive<any>(
    JSON.parse(localStorage.getItem("moreOptions")) || {
      tasks: {
        title: "My Tasks",
        visible: true,
      },
      notification: {
        title: "notification",
        visible: true,
      },
      skillRequests: {
        title: "Skill Requests",
        visible: true,
      },
      newUser: {
        title: "New User",
        visible: true,
      },
      customers: {
        title: "Customers",
        visible: true,
      },
      pinnedOrders: {
        title: "Pinned Order",
        visible: true,
      },
      map: {
        title: "Map",
        visible: true,
      },
      help: {
        title: "Help",
        visible: true,
      },
    }
  );
  const dashboardWidgets = reactive<any>({
    tasks: {
      title: "My Tasks",
      count: 0,
      plusIcon: false,
      icon: "rectangle-list",
      url: "/task-new?date_filter=upcoming_tasks&filter=my_users&has_done=0",
      plusUrl: "",
    },
    notification: {
      title: "notification",
      count: 0,
      plusIcon: false,
      icon: "comment",
      url: "/communication",
      plusUrl: "",
    },
    newUser: {
      title: "New User",
      count: 0,
      plusIcon: true,
      icon: "user",
      url: "/users",
      plusUrl: "?createUser=true",
    },
    skillRequests: {
      title: "Skill Requests",
      count: 0,
      plusIcon: false,
      icon: "user-graduate",
      url: "/price-and-salary?skillRequest=true",
      plusUrl: "?",
    },
    customers: {
      title: "Customers",
      count: 0,
      plusIcon: true,
      icon: "building",
      url: "/customer-list",
      plusUrl: "?createCustomer=true",
    },
  });

  const mapSettings = reactive<MapSettings>({
    zoom: 12,
    center: {
      lat: 52.520008,
      lng: 13.404954,
    },
    showLabels: true,
    clusterMarkers: true,
  });
  const headerSearch = reactive<any>({
    order: {
      label: "Order",
      data: [],
    },
    offer: {
      label: "Offer",
      data: [],
    },
    invoice: {
      label: "Invoice",
      data: [],
    },
    user: {
      label: "User",
      data: [],
    },
  });

  // Actions
  const toggleMoreOptionVisiblity = (optionKey: string) => {
    if (optionKey === "help") {
      globalStore.setDisplayHelper(true);
    } else {
      moreOptions[optionKey].visible = !moreOptions[optionKey].visible;
      localStorage.setItem("moreOptions", JSON.stringify(moreOptions));
    }
  };
  const setFilter = (key: keyof MapFilters, value: any) => {
    if (key === "dateRange") {
      Object.assign(filters.dateRange, value);
    } else {
      filters[key] = value;
    }
  };

  const clearFilters = () => {
    filters.status = "";
    filters.search = "";
    filters.dateRange.start = "";
    filters.dateRange.end = "";
  };

  const selectOrder = (order: MapOrder | null) => {
    selectedOrder.value = order;
  };

  const updateMapSettings = (settings: Partial<MapSettings>) => {
    Object.assign(mapSettings, settings);
  };

  const updateMapBounds = (bounds: google.maps.LatLngBounds) => {
    mapBounds.value = bounds;
  };
  const loadWidgets = async () => {
    try {
      globalStore.setLoadingApi(true);
      const res = await dashboardApi.getWidgets();
      dashboardWidgets.tasks.count = res.data.pending_task_count;
      dashboardWidgets.customers.count = res.data.customer_count;
      dashboardWidgets.newUser.count = res.data.recent_user_count;
      dashboardWidgets.notification.count =
        res.data.unread_message_thread_count;
      // dashboardWidgets.skillRequests.count =
      //   res.data.pending_skill_request_count;

      globalStore.setLoadingApi(false);
    } catch (error) {
      console.error("Error loading default data:", error);
      globalStore.setLoadingApi(false);
    } finally {
      globalStore.setLoadingApi(false);
      loading.value = false;
    }
  };
  const fetchHeaderSearch = async (searchType: string, searchValue: string) => {
    try {
      globalStore.setLoadingApi(true);
      const res = await dashboardApi.fetchHeaderSearch(searchType, searchValue);
      headerSearch[searchType].data = res.list.map((item) => {
        return { key: item.id, value: item.name };
      });

      globalStore.setLoadingApi(false);
    } catch (error) {
      console.error("Error loading default data:", error);
      globalStore.setLoadingApi(false);
    } finally {
      globalStore.setLoadingApi(false);
      loading.value = false;
    }
  };

  return {
    loading,
    selectedOrder,
    filters,
    mapSettings,
    mapBounds,
    dashboardWidgets,
    headerSearch,
    moreOptions,
    toggleMoreOptionVisiblity,
    fetchHeaderSearch,
    loadWidgets,
    setFilter,
    clearFilters,
    selectOrder,
    updateMapSettings,
    updateMapBounds,
  };
});

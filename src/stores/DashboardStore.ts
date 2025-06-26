import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { MapOrder, MapFilters, MapSettings } from "@/types/DashboardTypes";
import { useGlobalStore } from ".";
import { orderApi } from "@/api/orderApi";
import { getLocation } from "@/utils/OrderUtils";

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
  const dashboardWidgets = reactive<any>({
    tasks: {
      title: "My Tasks",
      count: 10,
      plusIcon: false,
      icon: "rectangle-list",
      url: "/task-new?date_filter=upcoming_tasks&filter=my_users&has_done=0",
      plusUrl: "",
    },
    notification: {
      title: "notification",
      count: 10,
      plusIcon: false,
      icon: "comment",
      url: "/communication",
      plusUrl: "",
    },
    newUser: {
      title: "New User",
      count: 10,
      plusIcon: true,
      icon: "user",
      url: "/users",
      plusUrl: "?createUser=true",
    },
    customers: {
      title: "Customers",
      count: 10,
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

  // Actions

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
  const loadWidgets = () => {};

  return {
    loading,
    selectedOrder,
    filters,
    mapSettings,
    mapBounds,
    dashboardWidgets,
    loadWidgets,
    setFilter,
    clearFilters,
    selectOrder,
    updateMapSettings,
    updateMapBounds,
  };
});

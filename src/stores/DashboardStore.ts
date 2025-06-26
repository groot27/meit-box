import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { MapOrder, MapFilters, MapSettings } from "@/types/DashboardTypes";
import { useGlobalStore } from ".";
import { orderApi } from "@/api/orderApi";
import { getLocation } from "@/utils/OrderUtils";

export const useDashboardStore = defineStore("dashboard", () => {
  const globalStore = useGlobalStore();
  const orders = ref<MapOrder[]>([]);
  const loading = ref(false);
  const selectedOrder = ref<MapOrder | null>(null);
  const mapBounds = ref<google.maps.LatLngBounds | null>(null);
  const statuses = ref(null);
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

  const getStatusColor = (label) => {
    const status = statuses.value.find((status) => status.name === label);
    return status ? status.color : "#ff851b";
  };

  const mapSettings = reactive<MapSettings>({
    zoom: 12,
    center: {
      lat: 52.520008,
      lng: 13.404954,
    },
    showLabels: true,
    clusterMarkers: true,
  });

  const filteredOrders = computed(() => {
    let result = [...orders.value];

    // Apply status filter
    if (filters.status) {
      result = result.filter((order) => order.status === filters.status);
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (order) =>
          order.title.toLowerCase().includes(searchTerm) ||
          order.customerName.toLowerCase().includes(searchTerm) ||
          order.orderNumber.toLowerCase().includes(searchTerm)
      );
    }

    // Apply date range filter
    if (filters.dateRange.start) {
      result = result.filter(
        (order) =>
          new Date(order.createdAt) >= new Date(filters.dateRange.start)
      );
    }

    if (filters.dateRange.end) {
      result = result.filter(
        (order) => new Date(order.createdAt) <= new Date(filters.dateRange.end)
      );
    }

    return result;
  });

  const ordersByStatus = computed(() => {
    const statusCounts = {
      pending: 0,
      "in-progress": 0,
      completed: 0,
      cancelled: 0,
    };

    filteredOrders.value.forEach((order) => {
      statusCounts[order.status]++;
    });

    return statusCounts;
  });

  // Actions
  const loadOrders = async () => {
    globalStore.setLoadingApi(true);
    try {
      const defaultRes = await orderApi.getFiltersData();
      statuses.value = defaultRes.data.statuses;
      const res: ResponseType = await orderApi.getAll("per_page=100");

      globalStore.setLoadingApi(false);
      orders.value = res.data.map((order, index) => {
        return (order = {
          id: order.id,
          locationAddress: order.order_location,
          lat: order.latitude || getLocation(index).lat,
          lng: order.longitude || getLocation(index).lng,
          status: order.status,
          statusColor: getStatusColor(order.status),
          customerName: order.customer_name,
          orderNumber: order.order_number,
          createdAt: order.start_date,
        });
      });
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      loading.value = false;
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

  return {
    orders,
    loading,
    selectedOrder,
    filters,
    mapSettings,
    mapBounds,
    filteredOrders,
    ordersByStatus,
    statuses,
    dashboardWidgets,
    loadOrders,
    setFilter,
    clearFilters,
    selectOrder,
    updateMapSettings,
    updateMapBounds,
  };
});

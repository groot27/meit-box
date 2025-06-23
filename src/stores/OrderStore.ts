import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import {
  Order,
  OrderFilters,
  OrderTableColumn,
  OrderPagination,
  OrderSort,
} from "@/types/OrderTypes";
import { orderApi } from "@/api/orderApi";
import { useGlobalStore } from ".";
import { ResponseType } from "@/types/apiRequest";
import { createQueryString } from "@/utils/utils";

export const useOrderStore = defineStore("order", () => {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const leftSideDisplay = ref(true);
  const globalStore = useGlobalStore();
  const defaultData = reactive<any>({
    customers: null,
  });
  const filters = reactive<OrderFilters>({
    search: "",
    startDate: "",
    endDate: "",
    orderStatus: "",
    orderCategory: "",
    projectManager: "",
    customer: "",
    contactPerson: "",
  });

  const pagination = reactive<OrderPagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });

  const sort = reactive<OrderSort>({
    field: "orderNumber",
    direction: "asc",
  });

  const tableColumns = ref<OrderTableColumn[]>([
    { key: "orderNumber", label: "Order #", sortable: true, visible: true },
    { key: "customerName", label: "Customer", sortable: true, visible: true },
    {
      key: "projectManager",
      label: "Project Manager",
      sortable: true,
      visible: true,
    },
    {
      key: "contactPerson",
      label: "Contact Person",
      sortable: true,
      visible: true,
    },
    { key: "orderStatus", label: "Status", sortable: true, visible: true },
    { key: "orderCategory", label: "Category", sortable: true, visible: true },
    { key: "startDate", label: "Start Date", sortable: true, visible: true },
    { key: "endDate", label: "End Date", sortable: true, visible: true },
    {
      key: "totalAmount",
      label: "Total Amount",
      sortable: true,
      visible: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
      visible: true,
    },
    { key: "location", label: "Location", sortable: true, visible: true },
    { key: "priority", label: "Priority", sortable: true, visible: true },
    { key: "createdAt", label: "Created", sortable: true, visible: false },
    { key: "updatedAt", label: "Updated", sortable: true, visible: false },
    { key: "assignedTeam", label: "Team", sortable: true, visible: false },
    {
      key: "estimatedHours",
      label: "Est. Hours",
      sortable: true,
      visible: false,
    },
    {
      key: "actualHours",
      label: "Actual Hours",
      sortable: true,
      visible: false,
    },
    { key: "progress", label: "Progress", sortable: true, visible: false },
  ]);

  const visibleColumns = computed(() =>
    tableColumns.value.filter((col) => col.visible)
  );

  const filteredOrders = computed(() => {
    let result = [...orders.value];

    // Apply search filter
    // if (filters.search) {
    //   const searchTerm = filters.search.toLowerCase();
    // result = result.filter(
    //   (order) =>
    //     order.orderNumber.toLowerCase().includes(searchTerm) ||
    //     order.customerName.toLowerCase().includes(searchTerm) ||
    //     order.description.toLowerCase().includes(searchTerm)
    // );
    // }

    // Apply date filters
    // if (filters.startDate) {
    //   result = result.filter(
    //     (order) => new Date(order.startDate) >= new Date(filters.startDate)
    //   );
    // }

    // if (filters.endDate) {
    //   result = result.filter(
    //     (order) => new Date(order.endDate) <= new Date(filters.endDate)
    //   );
    // }

    // Apply other filters
    if (filters.orderStatus) {
      result = result.filter(
        (order) => order.orderStatus === filters.orderStatus
      );
    }

    if (filters.orderCategory) {
      result = result.filter(
        (order) => order.orderCategory === filters.orderCategory
      );
    }

    if (filters.projectManager) {
      result = result.filter(
        (order) => order.projectManager === filters.projectManager
      );
    }

    if (filters.customer) {
      result = result.filter(
        (order) => order.customerName === filters.customer
      );
    }

    if (filters.contactPerson) {
      result = result.filter(
        (order) => order.contactPerson === filters.contactPerson
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sort.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
    result.sort((a, b) => {
      return (b.isPinned === true) - (a.isPinned === true);
    });

    // Update pagination totals
    // pagination.totalItems = result.length;
    // pagination.totalPages = Math.ceil(result.length / pagination.itemsPerPage);

    return result;
  });

  // const paginatedOrders = computed(() => {
  //   const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
  //   const end = start + pagination.itemsPerPage;
  //   return filteredOrders.value.slice(start, end);
  // });

  // Actions
  const toggleLeftSideDisplay = () => {
    leftSideDisplay.value = !leftSideDisplay.value;
  };

  const loadOrders = async () => {
    let queryProps = {
      per_page: pagination.itemsPerPage,
      page: pagination.currentPage,
      search: filters.search,
    };
    if (filters.startDate && filters.endDate) {
      queryProps["date_between"] = `${filters.startDate},${filters.endDate}`;
    }

    const queryString: string = createQueryString(queryProps);
    try {
      globalStore.setLoadingApi(true);
      const res: ResponseType = await orderApi.getAll(queryString);
      globalStore.setLoadingApi(false);
      debugger;
      orders.value = res.data.map((order) => {
        tableColumns.value.forEach((col) => {
          order[col.key] = order[col.key] || "NotSet";
        });
        return order;
      });

      pagination.currentPage = res.meta.current_page;
      pagination.totalPages = res.meta.last_page;
      pagination.totalItems = res.meta.total;
      pagination.itemsPerPage = res.meta.per_page;
    } catch (error) {
      console.error("Error loading orders:", error);
      globalStore.setLoadingApi(false);
    } finally {
      globalStore.setLoadingApi(false);
      loading.value = false;
    }
  };
  const loadOrdersHeader = async () => {
    globalStore.setLoadingApi(true);
    try {
      const res = await orderApi.getHeaders();
      tableColumns.value = null;
      tableColumns.value = res.data.map((header) => {
        return {
          key: header.column_name,
          label: header.column_label,
          sortable: true,
          visible: header.is_shown,
        };
      });
      globalStore.setLoadingApi(false);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      loading.value = false;
    }
  };
  const loadDefaultData = async () => {
    globalStore.setLoadingApi(true);
    try {
      const res = await orderApi.getCustomers();
      debugger;
      tableColumns.value = null;
      tableColumns.value = res.data.map((header) => {
        return {
          key: header.column_name,
          label: header.column_label,
          sortable: true,
          visible: header.is_shown,
        };
      });
      globalStore.setLoadingApi(false);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      loading.value = false;
    }
  };

  const setFilter = (key: keyof OrderFilters, value: string) => {
    filters[key] = value;
    debugger;
    if (key === "startDate" || key === "endDate") {
      if (filters.startDate && filters.endDate) {
        pagination.currentPage = 1;
        loadOrders();
      } else {
        return;
      }
    } else {
      pagination.currentPage = 1;
      loadOrders();
    }
  };

  const clearFilters = () => {
    Object.keys(filters).forEach((key) => {
      filters[key as keyof OrderFilters] = "";
    });
    pagination.currentPage = 1;
    loadOrders();
  };

  const setSort = (field: keyof Order) => {
    if (sort.field === field) {
      sort.direction = sort.direction === "asc" ? "desc" : "asc";
    } else {
      sort.field = field;
      sort.direction = "asc";
    }
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      pagination.currentPage = page;
      loadOrders();
    }
  };

  const setItemsPerPage = (itemsPerPage: number) => {
    pagination.itemsPerPage = itemsPerPage;
    pagination.currentPage = 1; // Reset to first page when changing items per page
    loadOrders();
  };

  const toggleColumnVisibility = (columnKey: keyof Order) => {
    const column = tableColumns.value.find((col) => col.key === columnKey);
    if (column) {
      column.visible = !column.visible;
    }
  };

  const togglePinOrder = (orderID: number) => {
    // orderApi.togglePin({ id: orderID, tabel: "orders" });
    orders.value.forEach((order) => {
      if (order.id === orderID) {
        order.isPinned = !order.isPinned;
      }
    });
  };

  return {
    orders,
    loading,
    filters,
    pagination,
    sort,
    tableColumns,
    visibleColumns,
    filteredOrders,
    // paginatedOrders,
    leftSideDisplay,
    toggleLeftSideDisplay,
    loadOrders,
    loadOrdersHeader,
    setFilter,
    clearFilters,
    setSort,
    setPage,
    setItemsPerPage,
    toggleColumnVisibility,
    togglePinOrder,
  };
});

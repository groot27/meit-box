import { defineStore } from "pinia";
import { ref, reactive, computed, registerRuntimeCompiler, watch } from "vue";
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
import { setOrderValue } from "@/utils/OrderUtils";
import { useRouter } from "vue-router";

export const useOrderStore = defineStore("order", () => {
  const globalStore = useGlobalStore();
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const leftSideDisplay = ref(true);
  const inquiryFilterSelected = ref(false);
  const router = useRouter();
  const inquiryStatusFilters = ["inquiry", "offer_outstanding"];
  const defaultData = ref({
    customers: null,
    categories: null,
    contactPersons: null,
    statutes: null,
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

  const tableColumns = ref<OrderTableColumn[]>([]);

  const visibleColumns = computed(() =>
    tableColumns.value.filter((col) => col.visible)
  );

  const filteredOrders = computed(() => {
    let result = [...orders.value];

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

    return result;
  });

  // Actions
  const toggleLeftSideDisplay = () => {
    leftSideDisplay.value = !leftSideDisplay.value;
  };
  const generateProps = () => {
    let queryProps = {
      per_page: pagination.itemsPerPage,
      page: pagination.currentPage,
      search: filters.search,
    };
    if (filters.startDate && filters.endDate) {
      queryProps["date_between"] = `${filters.startDate},${filters.endDate}`;
    }
    if (filters.orderCategory) {
      queryProps["category"] = filters.orderCategory;
    }
    if (filters.orderStatus) {
      queryProps["status"] = "";
      filters.orderStatus.forEach((status) => {
        queryProps["status"] += `${status.value},`;
      });
    }
    if (filters.contactPerson) {
      queryProps["contact"] = filters.contactPerson.key;
    }
    if (filters.customer) {
      queryProps["customer"] = filters.customer.key;
    }
    if (filters.projectManager) {
      queryProps["manager"] = filters.projectManager.key;
    }
    return queryProps;
  };
  const loadOrders = async () => {
    const queryString: string = createQueryString(generateProps());

    try {
      globalStore.setLoadingApi(true);
      const res: ResponseType = await orderApi.getAll(queryString);
      globalStore.setLoadingApi(false);
      orders.value = setOrderValue(res.data, tableColumns.value);

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
      await fetchCustomers();
      const res = await orderApi.getFiltersData();
      defaultData.value.categories = res.data.categories.map((category) => {
        return { key: category.id, value: category.name };
      });
      defaultData.value.managers = res.data.managers.map((manager) => {
        return { key: manager.id, value: manager.username };
      });
      // defaultData.value.contactPersons = res.data.contact_persons.map(
      //   (contactPerson) => {
      //     return {
      //       key: contactPerson.id,
      //       value: `${contactPerson.customer} | ${
      //         contactPerson.name || "No Name"
      //       }`,
      //     };
      //   }
      // );
      defaultData.value.statuses = res.data.statuses.map((status) => {
        return { key: status.id, value: status.name };
      });

      globalStore.setLoadingApi(false);
    } catch (error) {
      console.error("Error loading default data:", error);
    } finally {
      loading.value = false;
    }
  };
  const fetchCustomers = async (query: string = "") => {
    const customers = await orderApi.getCustomers(query);
    defaultData.value.customers = customers.results.map((customer) => {
      return { key: customer.id, value: customer.text };
    });
  };

  const setFilter = (key: keyof OrderFilters, value: string | object) => {
    filters[key] = value;
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
  const setInquiryFilter = () => {
    if (inquiryFilterSelected.value) {
      filters.orderStatus = [];
      loadOrders();
      return;
    }
    filters.orderStatus = [];
    inquiryStatusFilters.forEach((status) => {
      filters.orderStatus.push(
        defaultData.value.statuses.find((stat) => stat.key === status)
      );
    });
    loadOrders();
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
    pagination.currentPage = 1;
    loadOrders();
  };

  const toggleColumnVisibility = (columnKey: keyof Order) => {
    const column = tableColumns.value.find((col) => col.key === columnKey);
    if (column) {
      column.visible = !column.visible;
      orderApi.toggleOrderColumn({
        column_name: columnKey,
        is_shown: column.visible,
      });
    }
  };

  const togglePinOrder = (orderID: number) => {
    orderApi.togglePin({ id: orderID, table: "orders" });
    orders.value.forEach((order) => {
      if (order.id === orderID) {
        order.isPinned = !order.isPinned;
      }
    });
  };
  const removeOrder = async (orderId) => {
    globalStore.setLoadingApi(true);
    const res = await orderApi.canRemove({});
    if (res && res["can_delete"]) {
      router.push(`/delete-order/${orderId}`);
    }
    globalStore.setLoadingApi(false);
  };
  const exportTable = async () => {
    globalStore.setLoadingApi(true);
    const res = await orderApi.getExport(
      `page=${pagination.currentPage}&per_page=${pagination.itemsPerPage}&search=${filters.search}&from_route=orders&creation_date=created_at&start_date=${filters.startDate}&end_date=${filters.endDate}&order_categories=${filters.orderCategory}&project_manager=${filters.projectManager.key}&order_by=ASC&all_order_status=&orderBy=id&orderDirec=DESC&export=true&customer=`
    );
    const blob = new Blob([res], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    globalStore.setLoadingApi(false);
  };

  watch(
    () => filters.orderStatus,
    (newStatuses) => {
      if (newStatuses) {
        const statusKeys = newStatuses.map((status) => status.key);
        inquiryFilterSelected.value = inquiryStatusFilters.every((filter) =>
          statusKeys.includes(filter)
        );
      } else {
        inquiryFilterSelected.value = false;
      }
    },
    { deep: true, immediate: true }
  );

  return {
    orders,
    loading,
    filters,
    pagination,
    sort,
    tableColumns,
    visibleColumns,
    filteredOrders,
    defaultData,
    inquiryFilterSelected,
    // paginatedOrders,
    leftSideDisplay,
    setInquiryFilter,
    loadDefaultData,
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
    fetchCustomers,
    removeOrder,
    exportTable,
  };
});

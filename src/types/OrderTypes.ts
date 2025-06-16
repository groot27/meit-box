export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  projectManager: string;
  contactPerson: string;
  orderStatus: string;
  orderCategory: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  description: string;
  location: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  assignedTeam: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
}

export interface OrderFilters {
  search: string;
  startDate: string;
  endDate: string;
  orderStatus: string;
  orderCategory: string;
  projectManager: string;
  customer: string;
  contactPerson: string;
}

export interface OrderTableColumn {
  key: keyof Order;
  label: string;
  sortable: boolean;
  visible: boolean;
}

export interface OrderPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface OrderSort {
  field: keyof Order;
  direction: 'asc' | 'desc';
}
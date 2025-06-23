interface TaskApiFilters {
  date_between?: string;
  id?: number;
  resource_location_category_value?: string;
  customer_name?: string;
  username?: string;
  task_without_user?: number;
  admin_permission?: number;
  archive_date?: number;
  applied_users?: number;
}
export interface multifilterTasks {
  without_skills?: number;
  has_general_skill?: number;
}
interface TaskApiSort {
  field?: string;
  order?: "asc" | "desc";
}

export interface TaskApiQuery {
  filter?: TaskApiFilters;
  sort?: TaskApiSort;
  per_page?: number;
  page?: number;
}
interface MetaType {
  current_page: number;
  last_page: number;
  path: string;
  per_page: number;
  total: number;
}
export interface ResponseType {
  status: boolean;
  data: Array<any>;
  links: any;
  meta: MetaType;
  message: string;
}

export interface TaskDetails {
  order: string;
  location: string;
  address: string;
  taskTemplate: string;
  description: string;
}

export interface ResourceDetails {
  skill: string;
  userQuantity: number;
  ratePerHour: string;
  dress: string;
  startTime: string;
  endTime: string;
}

export interface OtherDetails {
  requiredSkills: string;
  dress: string;
  language: string;
  teamLeadDescription: string;
  teamLeadContactPerson: string;
  notificationTemplate: string;
}

export interface AppointmentDetails {
  name: string;
  username: string;
  adminGuest: string;
  datetime: string;
}

export interface ActivityComment {
  id: string;
  user: any;
  status: string;
  type: string;
  comment: string;
}

export interface ActivityHistory {
  id: string;
  user: any;
  status: string;
  type: string;
  comment: string;
}

export interface TaskActivity {
  comments: ActivityComment[];
  history: ActivityHistory[];
}

export interface TaskDocument {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}
export interface PermissionType {
  admin: number;
  employee: number;
  manager: number;
  all: number;
}
interface taskTemplateType {
  id: string;
  color: string;
  task_title: string;
  permission: string;
  date_type: string;
  duration: string;
  resource_location_category: string;
  resource_location_category_value: string;
  task_description: string;
  required_skills: string;
  dress: string;
  contact_person: string;
  teamlead_description: string;
  teamlead_contact_person: string;
  employees: string;
  employees_count: string;
  vehicle: string;
  vehicle_count: string;
  predecessor: string;
  successor: string;
  predecessor_hour: string;
  successor_hour: string;
  created_at: string;
  updated_at: string;
  location: string;
  language: string;
  latitude: string;
  longitude: string;
  devices_count: string;
  devices: string;
  notification_template_id: string;
  employeesIds: string[];
  vehicleIds: string[];
  devicesIds: string[];
}
interface OrderDetailsType {
  customer_name: string;
  id: string;
  latitude: string;
  longitude: string;
  order_location: string;
  order_number: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  color: string;
  deviceCout: number;
  allDeviceCount: number;
  employeeCount: number;
  allEmployeeCount: number;
  vehicleCount: number;
  allVehicleCount: number;
  order: string;
  location: string;
  address: string;
  taskTemplate: taskTemplateType;
  orderDetails: OrderDetailsType;
  skill: string;
  userQuantity: number;
  ratePerHour: string;
  dress: string;
  startTime: string;
  endTime: string;
  customer: string;
  status: string;
  startDate: string;
  permission: string;
  otherDetails: OtherDetails;
  appointmentDetails: AppointmentDetails;
  activity?: TaskActivity;
  documents?: TaskDocument[];
  users: any;
  latitude: string;
  longitude: string;
  orderId: string;
}
export interface TaskIndicatorType {
  tittle: boolean;
  customer: boolean;
  time: boolean;
  employee: boolean;
  vehicle: boolean;
  devices: boolean;
}

type EmployeeStatus =
  | "confirmed"
  | "checked_out"
  | "no_show"
  | "prechecked"
  | "open"
  | "planned"
  | "reject"
  | "checked_in";
export const statusColorClasses: Record<EmployeeStatus, string> = {
  confirmed: "text-white bg-[#4FB938] p-2 rounded",
  no_show: "text-white bg-[#B12525] p-2 rounded",
  checked_in: "text-white bg-[#52A1F8] p-2 rounded",
  planned: "text-white bg-[#52A1F8] p-2 rounded",
  checked_out: "text-white bg-[#0E4E94] p-2 rounded",
  prechecked: "text-white bg-[#3F7834] p-2 rounded",
  open: "text-white bg-[#676767] p-2 rounded",
  reject: "text-white bg-[#FF0000] p-2 rounded",
};

import { TaskDisplayType, TaskEditType } from "@/types/TaskTypes";

export const generateTaskForEdit = () => {
  // const task: TaskEditType = {};
  return task;
};
export const generateTaskForDisplay = (task) => {
  return {
    id: task.id,
    title: task.task_title,
    startTime: task.start_time,
    endTime: task.end_time,
    description: task.description,
    date: task.date,
    color: task.color || "#e5e7eb",
    deviceCout: task.device_occupied_count,
    allDeviceCount: task.device_available_count,
    employeeCount: task.employee_occupied_count,
    allEmployeeCount: task.employee_available_count,
    vehicleCount: task.vehicle_occupied_count,
    allVehicleCount: task.vehicle_available_count,
    orderId: task.order_id,
    users: task.users,
    address: task.resource_location_category_value,
    customer: task.customer
      ? task.customer.customer_name || "No Customer"
      : "No Customer",
  } as TaskDisplayType;
};

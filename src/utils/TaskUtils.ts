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
    deviceCount: task.device_occupied_count,
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
export const generateTaskCreateBody = (
  selectedTask,
  selectedTaskTemplate,
  selectedOrderDetails
) => {
  return {
    task_template_value: selectedTaskTemplate.value.task_title,
    task_template_id: selectedTaskTemplate.value.id,
    order_id: selectedOrderDetails.value.id,
    task_title: selectedTask.value.details.title,
    permission: selectedTask.value.details.permission,
    date_type: "date",
    duration: null,
    start_time: selectedTask.value.details.startTime,
    end_time: selectedTask.value.details.endTime,
    resource_location_category_value:
      selectedTask.value.details.resourceLocationCategory,
    task_description: selectedTask.value.details.description,
    required_skills: selectedTask.value.otherDetails.requiredSkills,
    dress: selectedTask.value.otherDetails.dress,
    color: selectedTask.value.details.color,
    date: selectedTask.value.details.date,
    location: selectedTask.value.details.location,
    location_description: selectedTask.value.details.locationDescription,
    latitude: selectedTask.value.orderDetails.latitude || "",
    longitude: selectedTask.value.orderDetails.longitude || "",
    repetitions: selectedTask.value.relatedTasks.length,
    repetitions_date: selectedTask.value.relatedTasks.map(
      (task) => task.date || ""
    ),
    tasks_contact_person: [null],
    teamlead_description: null,
    teamlead_contact_person: null,
    emp: selectedTask.value.relatedTasks.map(
      (task) => task.details.employeesIds || []
    ),
    e_count: selectedTask.value.relatedTasks.map(
      (task) => task.details.employees || 0
    ),
    veh: selectedTask.value.relatedTasks.map(
      (task) => task.details.vehiclesIds || []
    ),
    v_count: selectedTask.value.relatedTasks.map(
      (task) => task.details.vehicle || 0
    ),
    dev_rep: selectedTask.value.relatedTasks.map(
      (task) => task.details.devicesIds || []
    ),
    d_count: selectedTask.value.relatedTasks.map(
      (task) => task.details.devices || 0
    ),
    language: [],
    predecessor: [],
    successor: [],
    predecessor_hour: null,
    successor_hour: null,
    start_date: selectedTask.value.details.date,
    end_date: null,
    input_start_date: selectedTask.value.details.date,
    input_end_date: null,
    rates: [0],
    base_wage: [0],
    plan_start_time: selectedTask.value.relatedTasks.map(
      (task) => task.details.startTime || "00:00"
    ),
    plan_end_time: selectedTask.value.relatedTasks.map(
      (task) => task.details.endTime || "00:00"
    ),
    pause_time: selectedTask.value.relatedTasks.map((task) => "00:00"),
    repeptition_type: 0,
    travel_charges: selectedTask.value.relatedTasks.map((task) => 0),
    is_add_date: true,
    primary_color: "task_template",
    custom_emp: selectedTask.value.relatedTasks.map((task) => []),
    custom_open: selectedTask.value.relatedTasks.map((task) => []),
    task_status: null,
    task_status_id: null,
  };
};

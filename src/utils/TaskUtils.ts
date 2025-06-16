import { TaskDisplayType, TaskEditType } from "@/types/TaskTypes";

export const generateTaskForDisplay = (task) => {
  return {
    id: task.id,
    title: task.task_title,
    startTime: task.start_time,
    endTime: task.end_time,
    description: task.description,
    date: task.date,
    color: task.color || "#e5e7eb",
    devicesCount: task.device_occupied_count,
    allDevicesCount: task.device_available_count,
    employeesCount: task.employee_occupied_count,
    allEmployeesCount: task.employee_available_count,
    vehiclesCount: task.vehicle_occupied_count,
    allVehiclesCount: task.vehicle_available_count,
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
    teamlead_description: selectedTask.value.otherDetails.teamleadDescription,
    teamlead_contact_person:
      selectedTask.value.otherDetails.teamLeadContactPerson,
    notification_template_id:
      selectedTask.value.otherDetails.notificationTemplate,
    emp: selectedTask.value.relatedTasks.map(
      (task) => task.details.employeesIds || []
    ),
    e_count: selectedTask.value.relatedTasks.map(
      (task) => task.details.allEmployeesCount || 0
    ),
    veh: selectedTask.value.relatedTasks.map(
      (task) => task.details.vehiclesIds || []
    ),
    v_count: selectedTask.value.relatedTasks.map(
      (task) => task.details.allVehiclesCount || 0
    ),
    dev_rep: selectedTask.value.relatedTasks.map(
      (task) => task.details.devicesIds || []
    ),
    d_count: selectedTask.value.relatedTasks.map(
      (task) => task.details.allDevicesCount || 0
    ),
    language: selectedTask.value.otherDetails.language,
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
export const generateUpdateTaskBody = (selectedTask) => {
  return {
    extra_emp: [],
    id: selectedTask.value.details.id,
    task_template_value: null,
    order_id: selectedTask.value.orderDetails.id,
    rep_task_ids: selectedTask.value.relatedTasks.map((task) => {
      return task.details.id || null;
    }),
    task_title: selectedTask.value.details.title,
    permission: selectedTask.value.details.permission,
    date_type: "duration",
    duration: "3",
    start_time: selectedTask.value.details.startTime,
    end_time: selectedTask.value.details.endTime,
    resource_location_category_value:
      selectedTask.value.details.resourceLocationCategory || null,
    task_description: selectedTask.value.details.description,
    invoice_text: null,
    required_skills: selectedTask.value.otherDetails.requiredSkills,
    dress: null,
    color: selectedTask.value.details.color,
    date: selectedTask.value.details.date,
    previous_date: "",
    is_edit: true,
    location: selectedTask.value.details.location,
    location_description:
      selectedTask.value.details.locationDescription || null,
    latitude: selectedTask.value.orderDetails.latitude || null,
    longitude: selectedTask.value.orderDetails.longitude || null,
    repetitions: "1",
    teamlead_description: selectedTask.value.otherDetails.teamleadDescription,
    teamlead_contact_person:
      selectedTask.value.otherDetails.teamLeadContactPerson,
    emp_rep: selectedTask.value.relatedTasks.map(
      (task) => task.details.employeesIds || []
    ),
    e_count_rep: selectedTask.value.relatedTasks.map(
      (task) => task.details.allEmployeesCount || 0
    ),
    veh_rep: selectedTask.value.relatedTasks.map(
      (task) => task.details.vehiclesIds || []
    ),
    v_count_rep: selectedTask.value.relatedTasks.map(
      (task) => task.details.allVehiclesCount || 0
    ),
    dev_rep: selectedTask.value.relatedTasks.map(
      (task) => task.details.devicesIds || []
    ),
    d_count_rep: selectedTask.value.relatedTasks.map(
      (task) => task.details.allDevicesCount || 0
    ),
    language: selectedTask.value.otherDetails.language,
    predecessor: [],
    successor: [],
    predecessor_hour: null,
    successor_hour: null,
    start_date: selectedTask.value.details.date,
    end_date: "",
    repetition_value: 0,
    rates_rep: selectedTask.value.relatedTasks.map((task) => "0.00"),
    base_wage_rep: selectedTask.value.relatedTasks.map((task) => "0.00"),
    plan_start_time_rep: selectedTask.value.relatedTasks.map(
      (task) => task.details.startTime || "00:00"
    ),
    plan_end_time_rep: selectedTask.value.relatedTasks.map(
      (task) => task.details.endTime || "00:00"
    ),
    plan_pause_time_rep: selectedTask.value.relatedTasks.map((task) => "00:00"),
    travel_charges_rep: selectedTask.value.relatedTasks.map((task) => 0),
    is_add_date: true,
    updated_date: selectedTask.value.relatedTasks.map(
      (task) => task.details.date
    ),
    custom_count_rep: selectedTask.value.relatedTasks.map((task) => 0),
    custom_emp_rep: selectedTask.value.relatedTasks.map((task) => []),
    custom_open_rep: selectedTask.value.relatedTasks.map((task) => []),
    primary_color: "task_template",
    notification_template_id:
      selectedTask.value.otherDetails.notificationTemplate,
    task_status: null,
    task_status_id: null,
    end_series: false,
  };
};
export const generateAssignedResources = (
  resourceIds: string,
  resourcesItems
) => {
  const ids = resourceIds.split("+");
  const list = [];
  ids.forEach((id) => {
    list.push(resourcesItems.find((resource) => resource.id == id));
  });
  return list;
};

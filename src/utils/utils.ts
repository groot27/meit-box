export const v4 = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
export const generateMinusId = (): number => {
  return Math.ceil(Math.random() * 10000) * -1;
};

export const truncateWords = (str: string, words: number) => {
  return str.split(" ").slice(0, words).join(" ");
};

export const createQueryString = (queryProps: Record<string, any>): string => {
  const queryStringParts: string[] = ["per_page=50"];
  Object.entries(queryProps).forEach(([key, value]) => {
    if (key === "page") {
      queryStringParts.push(`page=${value}`);
    } else if (key === "field" || key === "order") {
      queryStringParts.push(`sort[${key}]=${value}`);
    } else if (Array.isArray(value)) {
      value.forEach((val) => {
        queryStringParts.push(`filter[${key}][]=${val}`);
      });
    } else {
      queryStringParts.push(`filter[${key}]=${value}`);
    }
  });

  return queryStringParts.join("&");
};
export const stripHtml = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};
const getUserStatus = (status, type) => {
  let newStatus;
  if (!status) {
    if (type == "Employee") {
      return "confirmed";
    }
    return "planned";
  }
  switch (status) {
    case "assigned":
      newStatus = "confirmed";
      break;
    case "":
      newStatus = "no_show";
      break;
    default:
      newStatus = status;
  }
  return newStatus;
};
export const generateDefaultResources = (
  resourcesValues,
  availableResourcesCounts
) => {
  const resources = [];
  let count = 1;
  for (let i = 1; i <= Number(availableResourcesCounts.employees); i++) {
    if (
      !resourcesValues.users[i - 1] ||
      resourcesValues.users[i - 1].status !== "rejected"
    ) {
      resources.push({
        id: count,
        resourcesId: resourcesValues.users[i - 1]
          ? resourcesValues.users[i - 1].id
          : null,
        number: resourcesValues.users[i - 1]
          ? resourcesValues.users[i - 1].mobile_number
          : null,
        name:
          resourcesValues && resourcesValues.users[i - 1]
            ? resourcesValues.users[i - 1].username
            : "Employee",
        type: "Employee",
        count: 0,
        status:
          resourcesValues && resourcesValues.users[i - 1]
            ? getUserStatus(
                resourcesValues.users[i - 1].user_status,
                "Employee"
              )
            : "open",
      });
      count++;
    }
  }
  for (let i = 1; i <= Number(availableResourcesCounts.vehicle); i++) {
    resources.push({
      id: count,
      resourcesId: resourcesValues.vehicles[i - 1]
        ? resourcesValues.vehicles[i - 1].id
        : null,
      name:
        resourcesValues && resourcesValues.vehicles[i - 1]
          ? resourcesValues.vehicles[i - 1].number_plate
          : "Vehicle",
      type: "Vehicle",
      count: 0,
      number: 0,
      status:
        resourcesValues && resourcesValues.vehicles[i - 1]
          ? resourcesValues.vehicles[i - 1].status || "planned"
          : "open",
    });
    count++;
  }
  for (let i = 1; i <= Number(availableResourcesCounts.devices); i++) {
    resources.push({
      id: count,
      resourcesId: resourcesValues.devices[i - 1]
        ? resourcesValues.devices[i - 1].id
        : null,
      name:
        resourcesValues && resourcesValues.devices[i - 1]
          ? resourcesValues.devices[i - 1].device_type
          : "Device",
      type: "Device",
      count: 0,
      number: 0,
      status:
        resourcesValues && resourcesValues.devices[i - 1]
          ? resourcesValues.devices[i - 1].status || "planned"
          : "open",
    });
    count++;
  }
  return resources;
};

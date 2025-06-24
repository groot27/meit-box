export const setOrderValue = (orders, columns) => {
  return orders.map((order) => {
    columns.forEach((col) => {
      if (col.key === "order_status_id") {
        order[col.key] = order["status"] || "";
      } else if (col.key === "get_order_documents") {
        order[col.key] = order["offer_number"] || "";
      } else if (col.key === "get_customer") {
        order[col.key] = order["customer_name"] || "";
      } else if (col.key === "category_name") {
        order[col.key] = order["category"] ? order["category"].name || "" : "";
      } else if (col.key === "order_application_status_id") {
        order[col.key] = order["application_status"] || "";
      } else {
        order[col.key] = order[col.key] || "";
      }
    });
    order.isPinned = order["is_pinned"];
    return order;
  });
};

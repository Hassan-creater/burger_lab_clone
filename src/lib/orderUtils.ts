export function parseOrderItems(items: any) {
  if (typeof items === 'string') {
    try {
      return JSON.parse(items);
    } catch (e) {
      return [];
    }
  }
  return items;
}

export function formatOrderData(order: any) {
  return {
    ...order,
    order_created_on: order.created_at || order.order_created_on || null,
    order_completed_on: order.completed_at || order.order_completed_on || null,
    order_returned_on: order.returned_at || order.order_returned_on || null,
    order_total: parseFloat(order.total),
    items: JSON.stringify(order.items),
    // Keep original fields as strings for calculation
    total: order.total,
    deliveryCharge: order.deliveryCharge || "0",
    tax: order.tax || "0",
    discount: order.discount || "0"
  };
}

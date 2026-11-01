// Small helpers for prices, dates and shipping.

export const SHIPPING_FEE = 9.99;
export const FREE_SHIPPING_MINIMUM = 100; // orders at or above this ship free

export const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// 12.5 -> "$12.50"
export function formatPrice(amount) {
  return "$" + Number(amount).toFixed(2);
}

// "2026-10-30T10:00:00.000Z" -> "Oct 30, 2026"
export function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Shipping rules: empty cart = 0, big orders = free, otherwise a flat fee.
export function calculateShipping(subtotal) {
  if (subtotal <= 0) {
    return 0;
  }
  if (subtotal >= FREE_SHIPPING_MINIMUM) {
    return 0;
  }
  return SHIPPING_FEE;
}

// Round to 2 decimals so we never show things like 19.990000001
export function roundMoney(amount) {
  return Math.round(amount * 100) / 100;
}

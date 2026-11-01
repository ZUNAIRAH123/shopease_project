import { createContext, useContext, useEffect, useState } from "react";
import { useProducts } from "./ProductContext";
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from "../utils/storage";

// Holds all orders (customers create them, the admin manages them).

const OrderContext = createContext();

// Makes an id like "ORD-LZ4K2P9-A7F"
function generateOrderId() {
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
  return "ORD-" + timePart + "-" + randomPart;
}

export function OrderProvider({ children }) {
  const { reduceStock, restoreStock } = useProducts();
  const [orders, setOrders] = useState(() => loadFromStorage(STORAGE_KEYS.orders, []));

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.orders, orders);
  }, [orders]);

  // orderData: { userEmail, customer, paymentMethod, cardLast4, items, subtotal, shipping, total }
  // items: [{ productId, name, price, image, quantity }]
  function createOrder(orderData) {
    const newOrder = {
      id: generateOrderId(),
      ...orderData,
      createdAt: new Date().toISOString(),
      status: "Pending",
    };

    // Newest order first
    setOrders([newOrder, ...orders]);

    // Take the ordered items out of stock
    reduceStock(newOrder.items);

    return newOrder;
  }

  function getOrderById(id) {
    for (const order of orders) {
      if (order.id === id) {
        return order;
      }
    }
    return null;
  }

  function getOrdersByUser(email) {
    return orders.filter((order) => order.userEmail === email);
  }

  function updateOrderStatus(id, newStatus) {
    const order = getOrderById(id);
    if (order === null) {
      return;
    }
    // A cancelled order is final
    if (order.status === "Cancelled") {
      return;
    }

    // If the admin cancels the order, give the stock back
    if (newStatus === "Cancelled") {
      restoreStock(order.items);
    }

    const updatedOrders = orders.map((item) => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setOrders(updatedOrders);
  }

  const value = { orders, createOrder, getOrderById, getOrdersByUser, updateOrderStatus };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  return useContext(OrderContext);
}

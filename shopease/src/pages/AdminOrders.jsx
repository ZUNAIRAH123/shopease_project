import { useState } from "react";
import { ChevronDown, ChevronUp, ClipboardList } from "lucide-react";
import AdminNav from "../components/AdminNav";
import ProductImage from "../components/ProductImage";
import StatusBadge from "../components/StatusBadge";
import { useOrders } from "../context/OrderContext";
import { useToast } from "../context/ToastContext";
import { ORDER_STATUSES, formatDate, formatPrice } from "../utils/format";

function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders();
  const { showToast } = useToast();

  // Which order is expanded to show its details
  const [openOrderId, setOpenOrderId] = useState(null);

  function toggleOrder(orderId) {
    if (openOrderId === orderId) {
      setOpenOrderId(null);
    } else {
      setOpenOrderId(orderId);
    }
  }

  function handleStatusChange(order, newStatus) {
    if (newStatus === order.status) {
      return;
    }
    if (newStatus === "Cancelled") {
      const confirmed = window.confirm("Cancel this order? The stock will be returned and this cannot be undone.");
      if (!confirmed) {
        return;
      }
    }
    updateOrderStatus(order.id, newStatus);
    showToast("Order " + order.id + " is now " + newStatus);
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-900">Manage orders</h1>
      <div className="mt-6">
        <AdminNav />
      </div>

      {orders.length === 0 ? (
        <div className="card flex flex-col items-center px-4 py-20 text-center">
          <ClipboardList size={48} className="text-gray-300" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">No orders yet</h2>
          <p className="mt-1 text-sm text-gray-500">Orders placed by customers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isOpen = openOrderId === order.id;

            return (
              <div key={order.id} className="card overflow-hidden">
                {/* Order summary row */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <button onClick={() => toggleOrder(order.id)} className="flex flex-1 items-center gap-3 text-left" aria-expanded={isOpen}>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    <div>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {order.customer.name} &middot; {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </button>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                    <StatusBadge status={order.status} />
                    <select
                      value={order.status}
                      onChange={(event) => handleStatusChange(order, event.target.value)}
                      disabled={order.status === "Cancelled"}
                      className="input w-auto"
                      aria-label={"Update status of " + order.id}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Order details */}
                {isOpen && (
                  <div className="space-y-5 border-t border-gray-100 bg-gray-50 p-4 text-sm">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">Customer</h3>
                        <p className="mt-1 text-gray-600">
                          {order.customer.name}<br />
                          {order.customer.email}<br />
                          {order.customer.phone}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Shipping address</h3>
                        <p className="mt-1 text-gray-600">
                          {order.customer.address}<br />
                          {order.customer.city}
                        </p>
                        <p className="mt-2 text-gray-600">
                          Payment: {order.paymentMethod}
                          {order.cardLast4 && <span> (card ending {order.cardLast4})</span>}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">Ordered products</h3>
                      <ul className="mt-2 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
                        {order.items.map((item) => (
                          <li key={item.productId} className="flex items-center gap-3 p-3">
                            <ProductImage src={item.image} alt={item.name} className="h-10 w-10 rounded-md object-cover" />
                            <span className="flex-1">{item.name}</span>
                            <span className="text-gray-500">{formatPrice(item.price)} x {item.quantity}</span>
                            <span className="w-20 text-right font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="ml-auto max-w-xs space-y-1">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 pt-1 text-base font-bold text-gray-900">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;

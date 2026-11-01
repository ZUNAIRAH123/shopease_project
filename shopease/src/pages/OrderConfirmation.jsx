import { Link, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import ProductImage from "../components/ProductImage";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { formatDate, formatPrice } from "../utils/format";

function OrderConfirmation() {
  const { orderId } = useParams();
  const { user, isAdmin } = useAuth();
  const { getOrderById } = useOrders();

  const order = getOrderById(orderId);

  // Customers can only see their own orders (admins can see all)
  const canView = order !== null && (isAdmin || order.userEmail === user.email);

  if (!canView) {
    return (
      <div className="page-container text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p className="mt-2 text-gray-500">We could not find this order.</p>
        <Link to="/orders" className="btn-primary mt-6">View my orders</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <CheckCircle size={52} className="text-green-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Thank you for your order!</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your order has been received. We will contact you at {order.customer.email} if we need anything.
          </p>
        </div>

        <div className="mt-8 grid gap-4 rounded-lg bg-gray-50 p-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-gray-500">Order ID</p>
            <p className="font-semibold text-gray-900">{order.id}</p>
          </div>
          <div>
            <p className="text-gray-500">Date</p>
            <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <StatusBadge status={order.status} />
          </div>
        </div>

        <h2 className="mt-8 text-lg font-semibold">Ordered items</h2>
        <ul className="mt-2 divide-y divide-gray-100">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3 py-3">
              <ProductImage src={item.image} alt={item.name} className="h-14 w-14 rounded-md object-cover" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-gray-500">{formatPrice(item.price)} x {item.quantity}</p>
              </div>
              <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total amount</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <h3 className="font-semibold text-gray-900">Shipping to</h3>
            <p className="mt-1 text-gray-600">
              {order.customer.name}<br />
              {order.customer.address}, {order.customer.city}<br />
              {order.customer.phone}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Payment</h3>
            <p className="mt-1 text-gray-600">
              {order.paymentMethod}
              {order.cardLast4 !== "" && order.cardLast4 !== undefined && <span> (card ending {order.cardLast4})</span>}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/products" className="btn-primary">Continue shopping</Link>
          <Link to="/orders" className="btn-secondary">View my orders</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;

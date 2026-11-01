import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { formatDate, formatPrice } from "../utils/format";

// Order history for the logged-in customer. Shows the latest status set by the admin.
function MyOrders() {
  const { user } = useAuth();
  const { getOrdersByUser } = useOrders();

  const myOrders = getOrdersByUser(user.email);

  if (myOrders.length === 0) {
    return (
      <div className="page-container">
        <div className="card flex flex-col items-center px-4 py-20 text-center">
          <Package size={48} className="text-gray-300" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">No orders yet</h1>
          <p className="mt-1 text-sm text-gray-500">When you place an order, it will show up here.</p>
          <Link to="/products" className="btn-primary mt-6">Start shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-900">My orders</h1>

      <div className="mt-6 space-y-4">
        {myOrders.map((order) => {
          let itemCount = 0;
          for (const item of order.items) {
            itemCount = itemCount + item.quantity;
          }

          return (
            <div key={order.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-semibold text-gray-900">{order.id}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(order.createdAt)} &middot; {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={order.status} />
                <span className="font-semibold">{formatPrice(order.total)}</span>
                <Link to={"/order-confirmation/" + order.id} className="btn-secondary">View details</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrders;

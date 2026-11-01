import { Link } from "react-router-dom";
import { Package, ClipboardList, Clock, DollarSign } from "lucide-react";
import AdminNav from "../components/AdminNav";
import StatusBadge from "../components/StatusBadge";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";
import { formatDate, formatPrice } from "../utils/format";

function AdminDashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();

  let pendingOrders = 0;
  let totalSales = 0;
  for (const order of orders) {
    if (order.status === "Pending") {
      pendingOrders = pendingOrders + 1;
    }
    // Cancelled orders do not count as sales
    if (order.status !== "Cancelled") {
      totalSales = totalSales + order.total;
    }
  }

  const stats = [
    { label: "Total products", value: products.length, icon: Package },
    { label: "Total orders", value: orders.length, icon: ClipboardList },
    { label: "Pending orders", value: pendingOrders, icon: Clock },
    { label: "Total sales", value: formatPrice(totalSales), icon: DollarSign },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-900">Admin dashboard</h1>
      <div className="mt-6">
        <AdminNav />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card flex items-center gap-4 p-5">
              <span className="rounded-lg bg-primary-50 p-3 text-primary-600">
                <Icon size={22} />
              </span>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <section className="card mt-8 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm font-medium text-primary-600 hover:underline">View all</Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No orders have been placed yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-gray-500">{order.customer.name} &middot; {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="font-semibold">{formatPrice(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;

import { NavLink } from "react-router-dom";

// Tabs shown at the top of every admin page.
function AdminNav() {
  function getClass({ isActive }) {
    const base = "rounded-lg px-4 py-2 text-sm font-medium ";
    if (isActive) {
      return base + "bg-primary-600 text-white";
    }
    return base + "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100";
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <NavLink to="/admin" end className={getClass}>Dashboard</NavLink>
      <NavLink to="/admin/products" className={getClass}>Products</NavLink>
      <NavLink to="/admin/orders" className={getClass}>Orders</NavLink>
    </div>
  );
}

export default AdminNav;

// A small coloured label for an order status.

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

function StatusBadge({ status }) {
  const colorClasses = statusColors[status] || "bg-gray-100 text-gray-800";
  return (
    <span className={"inline-block rounded-full px-3 py-1 text-xs font-semibold " + colorClasses}>
      {status}
    </span>
  );
}

export default StatusBadge;

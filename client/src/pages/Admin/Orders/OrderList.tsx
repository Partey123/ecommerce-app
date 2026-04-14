import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import { useAdminOrders } from "../../../features/admin/useAdminOrders";
import { formatCurrency } from "../../../utils/formatCurrency";

const OrderList = () => {
  const { orders, loading, error } = useAdminOrders();

  return (
    <section>
      <h2>Orders</h2>
      <p>Track fulfillment and update delivery statuses.</p>
      {error ? <div className="admin-empty">{error}</div> : null}
      {loading ? <div className="admin-empty">Loading orders...</div> : null}
      <DataTable
        rows={orders}
        columns={[
          { key: "id", header: "Order ID" },
          { key: "user_id", header: "User ID" },
          { key: "total_ghs", header: "Total", render: (row) => formatCurrency(Number(row.total_ghs ?? 0)) },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "created_at", header: "Date", render: (row) => new Date(row.created_at).toLocaleDateString() },
        ]}
      />
    </section>
  );
};

export default OrderList;


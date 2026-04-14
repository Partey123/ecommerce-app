import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import { adminOrders } from "../adminData";

const OrderList = () => {
  return (
    <section>
      <h2>Orders</h2>
      <p>Track fulfillment and update delivery statuses.</p>
      <DataTable
        rows={adminOrders}
        columns={[
          { key: "id", header: "Order ID" },
          { key: "customer", header: "Customer" },
          { key: "total", header: "Total", render: (row) => `GHS ${row.total}` },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "createdAt", header: "Date" },
        ]}
      />
    </section>
  );
};

export default OrderList;


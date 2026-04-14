import StatsCard from "../../components/admin/StatsCard";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import { adminOrders } from "./adminData";

const Overview = () => {
  return (
    <section>
      <div className="admin-grid-4">
        <StatsCard title="Revenue" value="GHS 284,902" subtitle="+18.3% this month" />
        <StatsCard title="Orders" value="1,493" subtitle="126 pending fulfillment" />
        <StatsCard title="Users" value="8,214" subtitle="357 new this week" />
        <StatsCard title="AOV" value="GHS 1,280" subtitle="Avg order value" />
      </div>

      <h3 style={{ marginTop: "1rem" }}>Latest Orders</h3>
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

export default Overview;


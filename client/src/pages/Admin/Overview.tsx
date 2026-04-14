import StatsCard from "../../components/admin/StatsCard";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import { useAdminOrders } from "../../features/admin/useAdminOrders";
import { useAdminStats } from "../../features/admin/useAdminStats";
import { formatCurrency } from "../../utils/formatCurrency";

const Overview = () => {
  const { stats, loading: statsLoading, error: statsError } = useAdminStats();
  const { orders, loading: ordersLoading, error: ordersError } = useAdminOrders();

  const latestOrders = orders.slice(0, 5);
  const aov = stats && stats.totalOrders > 0 ? stats.revenueGhs / stats.totalOrders : 0;

  return (
    <section>
      {statsError ? <div className="admin-empty">{statsError}</div> : null}
      <div className="admin-grid-4">
        <StatsCard
          title="Revenue"
          value={statsLoading ? "Loading..." : formatCurrency(stats?.revenueGhs ?? 0)}
        />
        <StatsCard
          title="Orders"
          value={statsLoading ? "Loading..." : String(stats?.totalOrders ?? 0)}
        />
        <StatsCard
          title="Users"
          value={statsLoading ? "Loading..." : String(stats?.totalUsers ?? 0)}
        />
        <StatsCard title="AOV" value={statsLoading ? "Loading..." : formatCurrency(aov)} subtitle="Avg order value" />
      </div>

      <h3 style={{ marginTop: "1rem" }}>Latest Orders</h3>
      {ordersError ? <div className="admin-empty">{ordersError}</div> : null}
      {ordersLoading ? <div className="admin-empty">Loading latest orders...</div> : null}
      <DataTable
        rows={latestOrders}
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

export default Overview;


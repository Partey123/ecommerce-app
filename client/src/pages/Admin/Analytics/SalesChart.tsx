import { useMemo } from "react";
import { useAdminOrders } from "../../../features/admin/useAdminOrders";
import { formatCurrency } from "../../../utils/formatCurrency";

const SalesChart = () => {
  const { orders, loading, error } = useAdminOrders();

  const last7Days = useMemo(() => {
    const today = new Date();
    const dayBuckets: { key: string; label: string; value: number }[] = [];

    for (let i = 6; i >= 0; i -= 1) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const key = day.toISOString().slice(0, 10);
      const label = day.toLocaleDateString(undefined, { weekday: "short" });
      dayBuckets.push({ key, label, value: 0 });
    }

    for (const order of orders) {
      const key = new Date(order.created_at).toISOString().slice(0, 10);
      const bucket = dayBuckets.find((item) => item.key === key);
      if (!bucket) continue;
      bucket.value += Number(order.total_ghs ?? 0);
    }

    return dayBuckets;
  }, [orders]);

  const maxValue = Math.max(...last7Days.map((day) => day.value), 1);

  return (
    <section>
      <h2>Analytics</h2>
      <p>Revenue trend for the last 7 days.</p>
      {loading ? <div className="admin-empty">Loading chart data...</div> : null}
      {error ? <div className="admin-empty">{error}</div> : null}
      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "0.6rem", alignItems: "end", height: "220px" }}>
          {last7Days.map((day) => (
            <div key={day.key} style={{ textAlign: "center" }}>
              <div
                style={{
                  height: `${Math.max((day.value / maxValue) * 180, 4)}px`,
                  background: "linear-gradient(180deg,#0f172a,#334155)",
                  borderRadius: "0.6rem 0.6rem 0.2rem 0.2rem",
                }}
                title={formatCurrency(day.value)}
              />
              <small>{day.label}</small>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "0.75rem" }}>
          Total (7 days):{" "}
          <strong>{formatCurrency(last7Days.reduce((sum, day) => sum + day.value, 0))}</strong>
        </p>
      </div>
    </section>
  );
};

export default SalesChart;


import { useMemo } from "react";
import { useAdminOrders } from "../../../features/admin/useAdminOrders";
import { formatCurrency } from "../../../utils/formatCurrency";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

  return (
    <section>
      <h2>Analytics</h2>
      <p>Revenue trend for the last 7 days.</p>
      {loading ? <div className="admin-empty">Loading chart data...</div> : null}
      {error ? <div className="admin-empty">{error}</div> : null}
      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={last7Days} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
              <YAxis
                stroke="#64748b"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `GHS ${Number(value).toLocaleString()}`}
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="value" fill="#0f172a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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


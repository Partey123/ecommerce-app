import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StatusBadge from "../../../components/admin/StatusBadge";
import type { AdminOrderDetailResponse } from "../../../features/admin/adminTypes";
import { supabaseClient } from "../../../lib/supabaseClient";
import { adminService } from "../../../services/adminService";
import { formatCurrency } from "../../../utils/formatCurrency";

const OrderDetails = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState<AdminOrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("Order id is required.");
        setLoading(false);
        return;
      }

      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();
        if (!session?.access_token) throw new Error("Not authenticated");

        const response = await adminService.getOrder(session.access_token, id);
        setDetail(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const order = detail?.order;

  if (loading) return <section><div className="admin-empty">Loading order...</div></section>;
  if (error) return <section><div className="admin-empty">{error}</div></section>;
  if (!order) return <section><div className="admin-empty">Order not found.</div></section>;

  return (
    <section>
      <h2>Order Details</h2>
      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <h3>{order.id}</h3>
        <p>User ID: {order.user_id}</p>
        <p>User: {detail?.user?.full_name ?? detail?.user?.email ?? "-"}</p>
        <p>Total: {formatCurrency(Number(order.total_ghs ?? 0))}</p>
        <p>Subtotal: {formatCurrency(Number(order.subtotal_ghs ?? 0))}</p>
        <p>Shipping: {formatCurrency(Number(order.shipping_ghs ?? 0))}</p>
        <p>Payment: <StatusBadge status={order.payment_status} /></p>
        <p>
          Status: <StatusBadge status={order.status} />
        </p>
        <p>Created: {new Date(order.created_at).toLocaleString()}</p>
      </div>

      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <h3>Order Items</h3>
        {detail?.items.length ? (
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1rem" }}>
            {detail.items.map((item) => (
              <li key={item.id} style={{ marginBottom: "0.4rem" }}>
                {item.product_name} - {item.quantity} x {formatCurrency(Number(item.unit_price_ghs))}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ marginTop: "0.75rem" }}>No line items available.</p>
        )}
      </div>
    </section>
  );
};

export default OrderDetails;


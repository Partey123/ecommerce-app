import StatusBadge from "../../../components/admin/StatusBadge";
import { adminOrders } from "../adminData";

const OrderDetails = () => {
  const order = adminOrders[0];

  return (
    <section>
      <h2>Order Details</h2>
      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <h3>{order.id}</h3>
        <p>Customer: {order.customer}</p>
        <p>Total: GHS {order.total}</p>
        <p>
          Status: <StatusBadge status={order.status} />
        </p>
      </div>
    </section>
  );
};

export default OrderDetails;


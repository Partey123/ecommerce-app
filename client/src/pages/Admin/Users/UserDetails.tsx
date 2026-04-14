import { useParams } from "react-router-dom";
import { useAdminOrders } from "../../../features/admin/useAdminOrders";
import { useAdminUsers } from "../../../features/admin/useAdminUsers";
import { formatCurrency } from "../../../utils/formatCurrency";

const UserDetails = () => {
  const { id } = useParams();
  const { users, loading, error } = useAdminUsers();
  const { orders, loading: loadingOrders } = useAdminOrders();
  const user = users.find((item) => item.id === id);
  const userOrders = orders.filter((item) => item.user_id === id);
  const totalSpend = userOrders.reduce((sum, order) => sum + Number(order.total_ghs ?? 0), 0);

  if (loading || loadingOrders) return <section><div className="admin-empty">Loading user...</div></section>;
  if (error) return <section><div className="admin-empty">{error}</div></section>;
  if (!user) return <section><div className="admin-empty">User not found.</div></section>;

  return (
    <section>
      <h2>User Details</h2>
      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <h3>{user.full_name ?? "Unnamed user"}</h3>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Phone: {user.phone ?? "-"}</p>
        <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
        <p>Orders: {userOrders.length}</p>
        <p>Total Spend: {formatCurrency(totalSpend)}</p>
      </div>
    </section>
  );
};

export default UserDetails;


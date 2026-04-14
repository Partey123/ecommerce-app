import { Link, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../../features/auth/useAuth";
import { useOrders } from "../../features/orders/useOrders";
import { formatCurrency } from "../../utils/formatCurrency";
import "./Profile.css";

const Profile = () => {
  const { user, isLoading } = useAuth();
  const { orders, loading: ordersLoading, error: ordersError } = useOrders();

  const profile = useMemo(() => {
    if (!user) return null;
    const fullName = (user.user_metadata?.full_name as string | undefined)?.trim();
    const fallbackName = user.email?.split("@")[0] ?? "User";
    const displayName = fullName && fullName.length > 0 ? fullName : fallbackName;
    const role =
      (user.user_metadata?.role as string | undefined) ??
      (user.app_metadata?.role as string | undefined) ??
      "user";

    return {
      displayName,
      email: user.email ?? "No email",
      role,
      joinedOn: new Date(user.created_at).toLocaleDateString(),
    };
  }, [user]);

  if (isLoading) {
    return <main className="profile-page">Loading profile...</main>;
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <p className="profile-kicker">Account</p>
        <h1>My Profile</h1>
        <p>Manage your account details and access your personalized area.</p>

        <div className="profile-grid">
          <article>
            <span>Full Name</span>
            <strong>{profile?.displayName}</strong>
          </article>
          <article>
            <span>Email</span>
            <strong>{profile?.email}</strong>
          </article>
          <article>
            <span>Role</span>
            <strong>{profile?.role}</strong>
          </article>
          <article>
            <span>Joined</span>
            <strong>{profile?.joinedOn}</strong>
          </article>
        </div>

        <div className="profile-actions">
          <Link to="/shop" className="profile-btn profile-btn-secondary">
            Back to Shop
          </Link>
          <Link to="/checkout" className="profile-btn profile-btn-secondary">
            Cart and checkout
          </Link>
          {profile?.role === "admin" ? (
            <Link to="/admin" className="profile-btn profile-btn-primary">
              Open Admin Dashboard
            </Link>
          ) : null}
        </div>
      </section>

      <section className="profile-card profile-orders">
        <p className="profile-kicker">Orders</p>
        <h2>Order history</h2>
        <p className="profile-orders-lead">Recent orders placed with your account.</p>
        {ordersLoading ? <p className="profile-orders-muted">Loading orders…</p> : null}
        {ordersError ? <p className="profile-orders-error">{ordersError}</p> : null}
        {!ordersLoading && !ordersError && orders.length === 0 ? (
          <p className="profile-orders-muted">You have not placed any orders yet.</p>
        ) : null}
        {!ordersLoading && orders.length > 0 ? (
          <ul className="profile-order-list">
            {orders.map((order) => (
              <li key={order.id} className="profile-order-row">
                <div>
                  <span className="profile-order-id">#{order.id.slice(0, 8)}…</span>
                  <span className="profile-order-date">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="profile-order-meta">
                  <span className={`profile-order-badge profile-order-badge--${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <span className="profile-order-total">{formatCurrency(Number(order.total_ghs ?? 0))}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
};

export default Profile;

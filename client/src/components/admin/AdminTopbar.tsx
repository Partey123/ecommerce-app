import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";

const AdminTopbar = () => {
  const { user } = useAuth();

  return (
    <header className="admin-topbar">
      <div>
        <strong>Admin Dashboard</strong>
        <p>{user?.email ?? "Signed out"}</p>
      </div>
      <Link to="/shop" className="admin-btn">
        Back to Shop
      </Link>
    </header>
  );
};

export default AdminTopbar;


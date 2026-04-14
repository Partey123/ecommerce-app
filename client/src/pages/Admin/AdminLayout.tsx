import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import "./Admin.css";

const AdminLayout = () => {
  return (
    <main className="admin-page">
      <div className="admin-shell">
        <AdminSidebar />
        <section className="admin-main">
          <AdminTopbar />
          <div className="admin-content">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminLayout;


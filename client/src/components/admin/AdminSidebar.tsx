import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/products/new", label: "Add Product" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/settings", label: "Settings" },
];

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">LuxeMart Admin</div>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => `admin-nav-link${isActive ? " active" : ""}`}
        >
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
};

export default AdminSidebar;


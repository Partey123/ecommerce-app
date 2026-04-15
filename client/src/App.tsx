import Landing from "./pages/landing/Landing";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { AuthProvider } from "./features/auth/authContext";
import ResetPassword from "./pages/Auth/ResetPassword";
import Verification from "./pages/Auth/Verification";
import Shop from "./pages/Shop/Shop";
import Checkout from "./pages/Checkout/Checkout";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./pages/Admin/AdminLayout";
import Overview from "./pages/Admin/Overview";
import ProductList from "./pages/Admin/Products/ProductList";
import AddProduct from "./pages/Admin/Products/AddProduct";
import EditProduct from "./pages/Admin/Products/EditProduct";
import OrderList from "./pages/Admin/Orders/OrderList";
import OrderDetails from "./pages/Admin/Orders/OrderDetails";
import UserList from "./pages/Admin/Users/UserList";
import UserDetails from "./pages/Admin/Users/UserDetails";
import CategoryManager from "./pages/Admin/Categories/CategoryManager";
import SalesChart from "./pages/Admin/Analytics/SalesChart";
import StoreSettings from "./pages/Admin/Settings/StoreSettings";
import Profile from "./pages/Profile/Profile";
import { useAuth } from "./features/auth/useAuth";
import NotFound from "./pages/NotFound";
import FullPageLoader from "./components/FullPageLoader";

const getRole = (userRole?: string) => (userRole === "admin" ? "admin" : "user");

const getDocumentTitle = (pathname: string) => {
  if (pathname === "/") return "LuxeMart | Home";
  if (pathname === "/dashboard") return "LuxeMart | Dashboard";
  if (pathname.startsWith("/shop")) return "LuxeMart | Shop";
  if (pathname.startsWith("/checkout")) return "LuxeMart | Checkout";
  if (pathname.startsWith("/profile")) return "LuxeMart | Profile";
  if (pathname === "/auth" || pathname.startsWith("/auth/signin")) return "LuxeMart | Sign In";
  if (pathname.startsWith("/auth/signup")) return "LuxeMart | Sign Up";
  if (pathname.startsWith("/auth/reset-password")) return "LuxeMart | Reset Password";
  if (pathname.startsWith("/auth/verify")) return "LuxeMart | Verification";
  if (pathname === "/admin") return "LuxeMart | Admin";
  if (pathname.startsWith("/admin/products")) return "LuxeMart | Admin Products";
  if (pathname.startsWith("/admin/orders")) return "LuxeMart | Admin Orders";
  if (pathname.startsWith("/admin/users")) return "LuxeMart | Admin Users";
  if (pathname.startsWith("/admin/categories")) return "LuxeMart | Admin Categories";
  if (pathname.startsWith("/admin/analytics")) return "LuxeMart | Admin Analytics";
  if (pathname.startsWith("/admin/settings")) return "LuxeMart | Admin Settings";
  return "LuxeMart | Not Found";
};

const DashboardRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoader label="Loading dashboard..." />;
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  const role = getRole(
    (user.user_metadata?.role as string | undefined) ??
      (user.app_metadata?.role as string | undefined)
  );

  return <Navigate to={role === "admin" ? "/admin" : "/shop"} replace />;
};

const HomeRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoader label="Loading home..." />;
  }

  return user ? <Navigate to="/dashboard" replace /> : <Landing />;
};

const DocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = getDocumentTitle(location.pathname);
  }, [location.pathname]);

  return null;
};

const RoleChangeRedirect = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const previousRoleRef = useRef<string | null>(null);

  const role = useMemo(
    () =>
      getRole(
        (user?.user_metadata?.role as string | undefined) ??
          (user?.app_metadata?.role as string | undefined)
      ),
    [user]
  );

  useEffect(() => {
    if (isLoading || !user) {
      previousRoleRef.current = null;
      return;
    }

    if (previousRoleRef.current === null) {
      previousRoleRef.current = role;
      return;
    }

    if (previousRoleRef.current !== role) {
      const targetPath = role === "admin" ? "/admin" : "/shop";
      if (location.pathname !== targetPath) {
        navigate(targetPath, { replace: true });
      }
    }

    previousRoleRef.current = role;
  }, [isLoading, location.pathname, navigate, role, user]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DocumentTitle />
        <RoleChangeRedirect />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/dashboard" element={<DashboardRoute />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<AddProduct />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="analytics" element={<SalesChart />} />
            <Route path="settings" element={<StoreSettings />} />
          </Route>
          <Route path="/auth" element={<Login />} />
          <Route path="/auth/signin" element={<Login />} />
          <Route path="/auth/signup" element={<Register />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/verify" element={<Verification />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

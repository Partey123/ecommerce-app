import Landing from "./pages/landing/Landing";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { AuthProvider } from "./features/auth/authContext";
import ResetPassword from "./pages/Auth/ResetPassword";
import Shop from "./pages/Shop/Shop";
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/shop" element={<Shop />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

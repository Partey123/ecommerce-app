import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { useAuth } from "../features/auth/useAuth";

type AdminRouteProps = {
  children: ReactElement;
};

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: "2rem" }}>Loading admin area...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  const role =
    (user.user_metadata?.role as string | undefined) ??
    (user.app_metadata?.role as string | undefined) ??
    "user";

  if (role !== "admin") {
    return <Navigate to="/shop" replace />;
  }

  return children;
};

export default AdminRoute;


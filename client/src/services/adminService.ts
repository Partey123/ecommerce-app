import type { AdminOverviewStats, AdminOrder, AdminProduct, AdminUser } from "../features/admin/adminTypes";
import { api } from "./api";

export const adminService = {
  getOverview(token: string) {
    return api.get<{ stats: AdminOverviewStats }>("/api/admin/overview", token);
  },
  listOrders(token: string) {
    return api.get<{ orders: AdminOrder[] }>("/api/admin/orders", token);
  },
  listUsers(token: string) {
    return api.get<{ users: AdminUser[] }>("/api/admin/users", token);
  },
  listProducts(token: string) {
    return api.get<{ products: AdminProduct[] }>("/api/products", token);
  },
};


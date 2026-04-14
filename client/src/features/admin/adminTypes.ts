import type { Order } from "../orders/orderTypes";
import type { Product } from "../products/productTypes";

export type AdminOverviewStats = {
  revenueGhs: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
};

export type AdminOrder = Order;

export type AdminProduct = Product;

export type AdminUser = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  phone: string | null;
  created_at: string;
  updated_at: string;
};


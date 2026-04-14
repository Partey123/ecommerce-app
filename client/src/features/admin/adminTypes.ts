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

export type AdminOrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price_ghs: number;
  created_at: string;
};

export type AdminOrderDetailResponse = {
  order: AdminOrder;
  items: AdminOrderItem[];
  user: AdminUser | null;
};


import type {
  AdminOrder,
  AdminOrderDetailResponse,
  AdminOverviewStats,
  AdminProduct,
  AdminUser,
} from "../features/admin/adminTypes";
import type { Category } from "../features/products/productTypes";
import { api } from "./api";

export const adminService = {
  getOverview(token: string) {
    return api.get<{ stats: AdminOverviewStats }>("/api/admin/overview", token);
  },
  listOrders(token: string) {
    return api.get<{ orders: AdminOrder[] }>("/api/admin/orders", token);
  },
  getOrder(token: string, orderId: string) {
    return api.get<AdminOrderDetailResponse>(`/api/admin/orders/${orderId}`, token);
  },
  listUsers(token: string) {
    return api.get<{ users: AdminUser[] }>("/api/admin/users", token);
  },
  listProducts(token: string) {
    return api.get<{ products: AdminProduct[] }>("/api/admin/products", token);
  },
  getProduct(token: string, productId: string) {
    return api.get<{ product: AdminProduct }>(`/api/admin/products/${productId}`, token);
  },
  createProduct(
    token: string,
    payload: {
      name: string;
      slug: string;
      description: string;
      category_id: string | null;
      price_ghs: number;
      stock: number;
      images: string[];
      is_active: boolean;
    }
  ) {
    return api.post<{ product: AdminProduct }, typeof payload>("/api/admin/products", payload, token);
  },
  updateProduct(
    token: string,
    productId: string,
    payload: {
      name: string;
      slug: string;
      description: string;
      category_id: string | null;
      price_ghs: number;
      stock: number;
      images: string[];
      is_active: boolean;
    }
  ) {
    return api.put<{ product: AdminProduct }, typeof payload>(
      `/api/admin/products/${productId}`,
      payload,
      token
    );
  },
  listCategories(token: string) {
    return api.get<{ categories: Category[] }>("/api/admin/categories", token);
  },
  createCategory(token: string, payload: { name: string; slug: string; description?: string }) {
    return api.post<{ category: Category }, typeof payload>("/api/admin/categories", payload, token);
  },
  updateCategory(
    token: string,
    categoryId: string,
    payload: { name: string; slug: string; description?: string }
  ) {
    return api.put<{ category: Category }, typeof payload>(
      `/api/admin/categories/${categoryId}`,
      payload,
      token
    );
  },
  deleteCategory(token: string, categoryId: string) {
    return api.del<void>(`/api/admin/categories/${categoryId}`, token);
  },
};


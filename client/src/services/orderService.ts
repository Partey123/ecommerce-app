import type { Order } from "../features/orders/orderTypes";
import { api } from "./api";

export const orderService = {
  listOrders(token: string) {
    return api.get<{ orders: Order[] }>("/api/orders", token);
  },

  createOrder(
    token: string,
    payload: { shippingAddress?: Record<string, unknown>; notes?: string }
  ) {
    return api.post<{ order: Order }, typeof payload>("/api/orders", payload, token);
  },
};


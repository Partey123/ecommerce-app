import type { CartItem } from "../features/cart/cartTypes";
import { api } from "./api";

export const cartService = {
  getCart(token: string) {
    return api.get<{ items: CartItem[] }>("/api/cart", token);
  },

  addOrUpdateItem(token: string, productId: string, quantity: number) {
    return api.post<{ item: CartItem }, { productId: string; quantity: number }>(
      "/api/cart/items",
      { productId, quantity },
      token
    );
  },

  removeItem(token: string, productId: string) {
    return api.del<void>(`/api/cart/items/${productId}`, token);
  },
};


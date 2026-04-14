import type { CartItem } from "./cartTypes";

export const getCartSubtotal = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.quantity * Number(item.unit_price_ghs), 0);

export const getCartCount = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.quantity, 0);

export const cartUtils = {
  getCartSubtotal,
  getCartCount,
};


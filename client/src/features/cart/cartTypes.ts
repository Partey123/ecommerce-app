import type { Product } from "../products/productTypes";

export type CartItem = {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price_ghs: number;
  product?: Product | null;
};

export type CartState = {
  items: CartItem[];
};


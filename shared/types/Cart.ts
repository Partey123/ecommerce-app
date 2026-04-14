import type { Product } from "./Product";

export type Cart = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price_ghs: number;
  created_at: string;
  updated_at: string;
  product?: Product | null;
};


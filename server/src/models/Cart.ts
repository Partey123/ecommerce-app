import { supabase } from "../config/supabase";
import { ProductRow } from "./Product";

export type CartRow = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type CartItemRow = {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price_ghs: number;
  created_at: string;
  updated_at: string;
  product?: ProductRow | null;
};

export const CartModel = {
  async getOrCreate(userId: string): Promise<CartRow> {
    const { data: existing, error: readError } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (readError) throw readError;
    if (existing) return existing as CartRow;

    const { data, error } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select("*")
      .single();
    if (error) throw error;
    return data as CartRow;
  },

  async listItems(userId: string): Promise<CartItemRow[]> {
    const cart = await this.getOrCreate(userId);
    const { data, error } = await supabase
      .from("cart_items")
      .select("*, product:products(*)")
      .eq("cart_id", cart.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as CartItemRow[];
  },

  async upsertItem(
    userId: string,
    productId: string,
    quantity: number,
    unitPriceGhs: number
  ): Promise<CartItemRow> {
    const cart = await this.getOrCreate(userId);

    const { data, error } = await supabase
      .from("cart_items")
      .upsert(
        {
          cart_id: cart.id,
          product_id: productId,
          quantity,
          unit_price_ghs: unitPriceGhs,
        },
        { onConflict: "cart_id,product_id" }
      )
      .select("*, product:products(*)")
      .single();

    if (error) throw error;
    return data as CartItemRow;
  },

  async removeItem(userId: string, productId: string): Promise<void> {
    const cart = await this.getOrCreate(userId);
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cart.id)
      .eq("product_id", productId);
    if (error) throw error;
  },
};


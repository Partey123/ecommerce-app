import { supabase } from "../config/supabase";

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  price_ghs: number;
  stock: number;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ProductPayload = Partial<
  Omit<ProductRow, "id" | "created_at" | "updated_at">
>;

export const ProductModel = {
  async listActive(): Promise<ProductRow[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ProductRow[];
  },

  async listAll(): Promise<ProductRow[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ProductRow[];
  },

  async getById(productId: string): Promise<ProductRow | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .maybeSingle();
    if (error) throw error;
    return (data as ProductRow | null) ?? null;
  },

  async create(payload: ProductPayload): Promise<ProductRow> {
    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select("*")
      .single();
    if (error) throw error;
    return data as ProductRow;
  },

  async update(productId: string, payload: ProductPayload): Promise<ProductRow> {
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", productId)
      .select("*")
      .single();
    if (error) throw error;
    return data as ProductRow;
  },

  async remove(productId: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (error) throw error;
  },
};


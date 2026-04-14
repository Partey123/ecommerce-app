import { supabase } from "../config/supabase";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

type CategoryPayload = {
  name: string;
  slug: string;
  description?: string | null;
};

export const CategoryModel = {
  async listAll(): Promise<CategoryRow[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return (data ?? []) as CategoryRow[];
  },

  async create(payload: CategoryPayload): Promise<CategoryRow> {
    const { data, error } = await supabase
      .from("categories")
      .insert(payload)
      .select("*")
      .single();
    if (error) throw error;
    return data as CategoryRow;
  },

  async update(categoryId: string, payload: Partial<CategoryPayload>): Promise<CategoryRow> {
    const { data, error } = await supabase
      .from("categories")
      .update(payload)
      .eq("id", categoryId)
      .select("*")
      .single();
    if (error) throw error;
    return data as CategoryRow;
  },

  async remove(categoryId: string): Promise<void> {
    const { error } = await supabase.from("categories").delete().eq("id", categoryId);
    if (error) throw error;
  },
};


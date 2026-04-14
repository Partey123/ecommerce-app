import { supabase } from "../config/supabase";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
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
};


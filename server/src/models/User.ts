import { supabase } from "../config/supabase";

export type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export const UserModel = {
  async getProfileById(userId: string): Promise<ProfileRow | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return (data as ProfileRow | null) ?? null;
  },

  async listProfiles(): Promise<ProfileRow[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ProfileRow[];
  },
};


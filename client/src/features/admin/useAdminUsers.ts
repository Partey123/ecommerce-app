import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabaseClient";
import { adminService } from "../../services/adminService";
import type { AdminUser } from "./adminTypes";

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();
        if (!session?.access_token) throw new Error("Not authenticated");
        const response = await adminService.listUsers(session.access_token);
        setUsers(response.users);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load admin users");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return { users, loading, error };
};


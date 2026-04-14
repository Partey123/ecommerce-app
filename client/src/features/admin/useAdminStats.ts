import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabaseClient";
import { adminService } from "../../services/adminService";
import type { AdminOverviewStats } from "./adminTypes";

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();
        if (!session?.access_token) {
          throw new Error("Not authenticated");
        }
        const response = await adminService.getOverview(session.access_token);
        setStats(response.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return { stats, loading, error };
};


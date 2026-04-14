import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabaseClient";
import { adminService } from "../../services/adminService";
import type { AdminOrder } from "./adminTypes";

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();
        if (!session?.access_token) throw new Error("Not authenticated");
        const response = await adminService.listOrders(session.access_token);
        setOrders(response.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load admin orders");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return { orders, loading, error };
};


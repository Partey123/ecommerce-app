import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabaseClient";
import { adminService } from "../../services/adminService";
import type { AdminProduct } from "./adminTypes";

export const useAdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();
        if (!session?.access_token) throw new Error("Not authenticated");
        const response = await adminService.listProducts(session.access_token);
        setProducts(response.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load admin products");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return { products, loading, error };
};


import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabaseClient";
import { orderService } from "../../services/orderService";
import type { Order } from "./orderTypes";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();

        if (!session?.access_token) {
          setOrders([]);
          return;
        }

        const response = await orderService.listOrders(session.access_token);
        setOrders(response.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return { orders, loading, error };
};


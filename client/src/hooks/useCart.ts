import { useEffect, useState } from "react";
import { cartStore } from "../features/cart/cartStore";
import type { CartState } from "../features/cart/cartTypes";
import { cartService } from "../services/cartService";
import { supabaseClient } from "../lib/supabaseClient";

export const useCart = () => {
  const [cart, setCart] = useState<CartState>(cartStore.getState());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = cartStore.subscribe(setCart);
    return () => {
      unsubscribe();
    };
  }, []);

  const getToken = async (): Promise<string> => {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    if (!session?.access_token) {
      throw new Error("You must be signed in");
    }
    return session.access_token;
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await cartService.getCart(token);
      cartStore.setItems(response.items);
    } finally {
      setLoading(false);
    }
  };

  return { ...cart, loading, refresh };
};


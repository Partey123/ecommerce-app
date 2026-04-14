import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/supabaseClient";

type UserState = {
  id: string;
  email: string | null;
  role: string;
};

const getUserRole = (user: {
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
}) => {
  const appRole = user.app_metadata?.role;
  if (typeof appRole === "string") return appRole;

  const userRole = user.user_metadata?.role;
  if (typeof userRole === "string") return userRole;

  return "user";
};

export const useUser = () => {
  const [user, setUser] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const {
        data: { user: authUser },
      } = await supabaseClient.auth.getUser();

      if (!mounted) return;
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email ?? null,
        role: getUserRole(authUser),
      });
      setLoading(false);
    };

    void load();

    const { data } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user;
      if (!authUser) {
        setUser(null);
        return;
      }
      setUser({
        id: authUser.id,
        email: authUser.email ?? null,
        role: getUserRole(authUser),
      });
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};


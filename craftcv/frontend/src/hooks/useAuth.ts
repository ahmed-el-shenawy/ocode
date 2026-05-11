"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSessionExpired = useCallback(() => {
    setUser(null);
    router.push("/login?expired=true");
  }, [router]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.expires_at && Date.now() >= session.expires_at * 1000) {
        handleSessionExpired();
      } else {
        setUser(session?.user ?? null);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED" && !session) {
        handleSessionExpired();
      } else {
        setUser(session?.user ?? null);
      }
    });

    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || (session.expires_at && Date.now() >= session.expires_at * 1000)) {
        handleSessionExpired();
      }
    }, SESSION_CHECK_INTERVAL);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [handleSessionExpired]);

  return { user, isLoading };
}

import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseService";
import { jwtDecode } from "jwt-decode";

export interface AuthState {
  user: User | null;
  session: Session | null;
  role: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    role: null,
    isLoading: true,
    isAdmin: false,
    isEditor: false,
    isViewer: false,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session) {
          const jwt = jwtDecode(session.access_token);
          const role = jwt.user_role;
          setAuthState((state) => ({
            ...state,
            session,
            user: session!.user,
            role,
            isAdmin: role === "admin",
            isEditor: role === "editor" || role === "admin",
            isViewer:
              role === "viewer" || role === "editor" || role === "admin",
          }));
        }
        return session;
      })
      .catch((error) => {
        console.error("Error getting session:", error);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return;
      })
      .finally(() => setAuthState((prev) => ({ ...prev, isLoading: false })));

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const jwt = jwtDecode(session.access_token);
        const role = jwt.user_role;
        setAuthState((state) => ({
          ...state,
          session,
          user: session!.user,
          role,
          isAdmin: role === "admin",
          isEditor: role === "editor" || role === "admin",
          isViewer: role === "viewer" || role === "editor" || role === "admin",
        }));
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  return {
    ...authState,
  };
};

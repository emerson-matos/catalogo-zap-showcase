import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseService";
import { jwtDecode } from "jwt-decode";
import type { AuthState, UserRole, JWTPayload } from "@/types/auth";

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

  const updateAuthState = useCallback((session: typeof authState.session) => {
    if (session) {
      try {
        const jwt = jwtDecode<JWTPayload>(session.access_token);
        const role = jwt.user_role as UserRole;
        
        setAuthState({
          session,
          user: session.user,
          role,
          isLoading: false,
          isAdmin: role === "admin",
          isEditor: role === "editor" || role === "admin",
          isViewer: role === "viewer" || role === "editor" || role === "admin",
        });
      } catch (error) {
        console.error("Error decoding JWT:", error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState({
        user: null,
        session: null,
        role: null,
        isLoading: false,
        isAdmin: false,
        isEditor: false,
        isViewer: false,
      });
    }
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error("Error getting session:", error);
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return;
        }
        updateAuthState(session);
      })
      .catch((error) => {
        console.error("Error getting session:", error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateAuthState(session);
    });
    
    return () => subscription.unsubscribe();
  }, [updateAuthState]);

  return authState;
};

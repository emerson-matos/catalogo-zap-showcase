import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, SupabaseService } from "@/lib/supabaseService";

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
        setAuthState((state) => ({ ...state, session }));
        return session;
      })
      .then((session) => {
        if (session) {
          SupabaseService.getUserRole(session.user.id)
            .then((role) =>
              setAuthState((state) => ({
                ...state,
                role,
                isAdmin: role === "admin",
                isEditor: role === "editor" || role === "admin",
                isViewer:
                  role === "viewer" || role === "editor" || role === "admin",
              })),
            )
            .catch((error) => console.error("Error getting user role:", error));
        }
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
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const role = await SupabaseService.getUserRole(session.user.id);
          setAuthState({
            user: session.user,
            session,
            role,
            isLoading: false,
            isAdmin: role === "admin",
            isEditor: role === "editor" || role === "admin",
            isViewer:
              role === "viewer" || role === "editor" || role === "admin",
          });
        } catch (error) {
          console.error("Error getting user role:", error);
          setAuthState({
            user: session.user,
            session,
            role: null,
            isLoading: false,
            isAdmin: false,
            isEditor: false,
            isViewer: false,
          });
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
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw new Error(error.message);
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
};


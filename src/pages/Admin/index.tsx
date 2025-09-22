import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LoginForm } from "@/components/LoginForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminPanel } from "@/components/AdminPanel";

export default function AdminPage() {
  const [session, setSession] = useState<unknown>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    console.log(session);
    return () => subscription.unsubscribe();
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoginForm />
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="editor">
      <AdminPanel />
    </ProtectedRoute>
  );
}

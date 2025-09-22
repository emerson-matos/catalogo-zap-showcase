import { LoginForm } from "@/components/LoginForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminPanel } from "@/components/AdminPanel";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPage() {
  const { session } = useAuth();

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

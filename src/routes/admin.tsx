import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/LoginForm";

export const Route = createFileRoute("/admin")({
  component: Ademir,
});

function Ademir() {
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
      <Outlet />
    </ProtectedRoute>
  );
}


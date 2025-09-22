import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "editor" | "viewer";
  fallbackPath?: string;
}

export const ProtectedRoute = ({
  children,
  requiredRole = "viewer",
  fallbackPath = "/",
}: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, isEditor, isViewer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: fallbackPath });
      return;
    }

    if (!isLoading && user) {
      const hasPermission =
        (requiredRole === "admin" && isAdmin) ||
        (requiredRole === "editor" && (isEditor || isAdmin)) ||
        (requiredRole === "viewer" && (isViewer || isEditor || isAdmin));

      if (!hasPermission) {
        navigate({ to: fallbackPath });
      }
    }
  }, [
    user,
    isLoading,
    isAdmin,
    isEditor,
    isViewer,
    requiredRole,
    navigate,
    fallbackPath,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const hasPermission =
    (requiredRole === "admin" && isAdmin) ||
    (requiredRole === "editor" && (isEditor || isAdmin)) ||
    (requiredRole === "viewer" && (isViewer || isEditor || isAdmin));

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
};

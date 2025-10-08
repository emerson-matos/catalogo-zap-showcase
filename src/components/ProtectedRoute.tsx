"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(fallbackPath);
      return;
    }

    if (!isLoading && user) {
      const hasPermission =
        (requiredRole === "admin" && isAdmin) ||
        (requiredRole === "editor" && (isEditor || isAdmin)) ||
        (requiredRole === "viewer" && (isViewer || isEditor || isAdmin));

      if (!hasPermission) {
        router.push(fallbackPath);
      }
    }
  }, [
    user,
    isLoading,
    isAdmin,
    isEditor,
    isViewer,
    requiredRole,
    router,
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

interface ProtectedComponentProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "editor" | "viewer";
}
export const ProtectedComponent = ({
  children,
  requiredRole = "viewer",
}: ProtectedComponentProps) => {
  const { user, isLoading, isAdmin, isEditor, isViewer } = useAuth();

  const hasPermission =
    (requiredRole === "admin" && isAdmin) ||
    (requiredRole === "editor" && (isEditor || isAdmin)) ||
    (requiredRole === "viewer" && (isViewer || isEditor || isAdmin));

  if (isLoading || !user || !hasPermission) {
    return <></>;
  }

  return <>{children}</>;
};

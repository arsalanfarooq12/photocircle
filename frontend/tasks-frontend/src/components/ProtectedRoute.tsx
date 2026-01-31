import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { auth, isHydrated } = useAuth();

  // Show loading until auth is hydrated
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

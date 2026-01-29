import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { auth } = useAuth();

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

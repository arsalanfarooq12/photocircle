import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";

type User = { id: string; email: string; role: string };
type AuthState = { token: string | null; user: User | null };

const AuthContext = createContext<{
  auth: AuthState;
  login: (token: string, user: User) => void;
  logout: () => void;
  isHydrated: boolean;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initial state before hydration
  const [auth, setAuth] = useState<AuthState>({ token: null, user: null });
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after mount (client-side only)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuth({ token, user });
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (e) {
        console.error("AuthContext: Failed to parse user", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setIsHydrated(true);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user });
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setAuth({ token: null, user: null });
  };

  // Show loading until hydrated
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, isHydrated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

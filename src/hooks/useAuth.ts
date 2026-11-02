"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { User } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = authService.getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    setUser(res.user);
    return res;
  };

  const register = async (name: string, email: string, password: string, photoURL?: string) => {
    const res = await authService.register({ name, email, password, photoURL });
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return { user, loading, login, register, logout, isAuthenticated: !!user };
}


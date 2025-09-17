import React, { createContext, useContext, useMemo } from "react";
import { useAuthStore, type AuthUser } from "../../stores/auth";

type AuthContextValue = {
  user: AuthUser | null;
  signIn: (payload: Partial<AuthUser>) => void;
  signOut: () => void;
};

const AuthCtx = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const signIn = useAuthStore((s) => s.signIn);
  const signOut = useAuthStore((s) => s.signOut);

  const value = useMemo<AuthContextValue>(
    () => ({ user, signIn, signOut }),
    [user, signIn, signOut]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

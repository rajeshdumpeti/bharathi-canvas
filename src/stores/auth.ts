import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  name: string;
  email: string;
};

type AuthState = {
  user: AuthUser | null;
  signIn: (payload: Partial<AuthUser>) => void;
  signOut: () => void;
};

const LS_KEY = "auth:user";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (payload) => {
        const u: AuthUser = {
          name: (payload.name ?? "").trim() || "User",
          email: (payload.email ?? "").trim() || "",
        };
        set({ user: u });
      },
      signOut: () => set({ user: null }),
    }),
    { name: LS_KEY } // localStorage key
  )
);

import { create } from "zustand";

type SidebarState = {
  isSidebarOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isSidebarOpen: false,
  open: () => set({ isSidebarOpen: true }),
  close: () => set({ isSidebarOpen: false }),
  toggle: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
}));

import { create } from "zustand";

interface UserStore {
  user: null | { id: string; name: string; email: string };
  setUser: (user: UserStore["user"]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

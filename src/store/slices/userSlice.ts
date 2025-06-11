import { User } from "@/types";
import { create } from "zustand";



export interface UserSlice {
  user: User | null;
  updateUser: (user: User | null) => void;
}

export const useUserStore = create<UserSlice>((set) => ({
  user: null,
  updateUser: (user) => set({ user }),
}));

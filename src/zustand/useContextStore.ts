import { create } from "zustand";

interface ContextStore {
  isUserNotExist: boolean;
  setIsUserNotExist: (isUserNotExist: boolean) => void;
}

export const useContextStore = create<ContextStore>((set) => ({
  isUserNotExist: false,
  setIsUserNotExist: (isUserNotExist: boolean) => set({ isUserNotExist }),
}));

import { devtools } from "zustand/middleware";
import type { StateCreator } from "zustand";

/** Wraps a store in Redux DevTools during development only. */
export function withDevtools<T>(name: string, initializer: StateCreator<T, [["zustand/devtools", never]]>) {
  return devtools(initializer, { name, enabled: process.env.NODE_ENV === "development" });
}

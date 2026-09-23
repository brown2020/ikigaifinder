import { Compass, Sparkles, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const appNav: NavLink[] = [
  { label: "My ikigai", path: "/dashboard", icon: Sparkles },
  { label: "Journey", path: "/ikigai-finder", icon: Compass },
  { label: "Profile", path: "/profile", icon: UserRound },
];

export const footerNav: { name: string; path: string }[] = [
  { name: "About", path: "/about" },
  { name: "Support", path: "/support" },
  { name: "Privacy", path: "/privacy-policy" },
  { name: "Terms", path: "/terms-conditions" },
];

export function isActivePath(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`);
}

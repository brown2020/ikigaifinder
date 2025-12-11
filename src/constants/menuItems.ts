import type { NavItem } from "@/types";
import { CircleUserIcon, GoalIcon, LogOut, Target } from "lucide-react";

export const navItems: NavItem[] = [
  {
    label: "Ikigai Finder",
    icon: GoalIcon,
    path: "/ikigai-finder",
    surveySet: "ikigai",
  },
  {
    label: "Profile",
    icon: CircleUserIcon,
    subItems: [
      {
        label: "Profile",
        icon: CircleUserIcon,
        path: "/profile",
      },
      {
        label: "Generate Ikigai",
        icon: Target,
        path: "/generate-ikigai",
      },
      {
        label: "Logout",
        icon: LogOut,
        path: "/logout",
      },
    ],
  },
];

export const navMobileMenu: NavItem[] = [
  {
    label: "Ikigai Finder",
    icon: GoalIcon,
    path: "/ikigai-finder",
    surveySet: "ikigai",
  },
  {
    label: "Generate Ikigai",
    icon: Target,
    path: "/generate-ikigai",
  },
  {
    label: "You",
    icon: CircleUserIcon,
    path: "/profile",
  },
];

// ============================================================================
// Footer Navigation
// ============================================================================

export interface FooterNavItem {
  name: string;
  path: string;
}

export const footerNav: FooterNavItem[] = [
  { name: "About", path: "/about" },
  { name: "Privacy", path: "/privacy-policy" },
  { name: "Terms", path: "/terms-conditions" },
  { name: "Support", path: "/support" },
];

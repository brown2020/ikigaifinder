import type { NavItem } from "@/types";
import { CircleUserIcon, GoalIcon, LogOut, LogIn, Target } from "lucide-react";

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

export const withoutSignInNaveBar: NavItem[] = [
  {
    label: "Sign In",
    icon: LogIn,
    path: "",
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

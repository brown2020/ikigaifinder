import { navItemType } from "@/types/interface";
import { CircleUserIcon, GoalIcon, LogOut, Target } from "lucide-react";

export const navItems: navItemType[] = [
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
export const navMobileItems: navItemType[] = [
  {
    label: "Ikigai Finder",
    icon: GoalIcon,
    path: "/ikigai-finder",
    surveySet: "ikigai",
  },

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
];

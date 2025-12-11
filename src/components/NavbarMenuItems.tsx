"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, CircleUserIcon } from "lucide-react";
import { navItems } from "@/constants/menuItems";
import { useProfileStore, selectFormattedName } from "@/zustand";
import { NavMenuIcon } from "./ui";
import type { NavItem } from "@/types";

export default function NavbarMenuItems() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const formattedName = useProfileStore(selectFormattedName);
  const [isOpenDropdown, setIsOpenDropdown] = useState<string | null>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const dropdownElements = document.querySelectorAll(".dropdown-menu");
    if (!Array.from(dropdownElements).some((el) => el.contains(target))) {
      setIsOpenDropdown(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleDropdown = useCallback((label: string) => {
    setIsOpenDropdown((prev) => (prev === label ? null : label));
  }, []);

  const navBarItems = useMemo(() => {
    return navItems.map((item) => {
      if (item.label === "Profile") {
        return {
          ...item,
          label: formattedName,
          icon: CircleUserIcon,
          profileUrl: profile?.photoUrl,
          profileName: formattedName?.charAt(0)?.toUpperCase(),
        };
      }
      return item;
    });
  }, [profile?.photoUrl, formattedName]);

  return (
    <div className="flex h-full gap-2 items-center">
      {navBarItems?.length > 0 &&
        navBarItems?.map((item, index) => (
          <div key={index} className="relative">
            <div
              className="flex items-center gap-1 px-3 cursor-pointer pb-1"
              onClick={() =>
                item.subItems
                  ? handleDropdown(item.label)
                  : item.path && router.push(item.path)
              }
            >
              <div className="aspect-square">
                <NavMenuIcon item={item} size={28} />
              </div>
              <div className="text-base font-medium">{item.label || ""}</div>
              {item.subItems && (
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isOpenDropdown === item.label ? "rotate-180" : ""
                  }`}
                />
              )}
            </div>

            {item.subItems && isOpenDropdown === item.label && (
              <div className="dropdown-menu absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg z-20 min-w-52">
                {item.subItems.map((subItem: NavItem, subIndex: number) => (
                  <div
                    key={subIndex}
                    className="px-4 py-2 hover:text-blue-800 cursor-pointer"
                    onClick={() => {
                      if (subItem.path) {
                        router.push(subItem.path);
                        setIsOpenDropdown(null);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 text-lg font-normal">
                      <subItem.icon className="w-5 h-5" />
                      <span>{subItem.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, CircleUserIcon } from "lucide-react";
import { navItems } from "@/constants/menuItems";
import { useProfileStore, selectFormattedName } from "@/zustand";
import { NavMenuIcon } from "./ui";
import type { NavItem } from "@/types";

export default function NavbarMenuItems() {
  const pathname = usePathname();
  const profile = useProfileStore((s) => s.profile);
  const formattedName = useProfileStore(selectFormattedName);
  const [isOpenDropdown, setIsOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpenDropdown) return;

    function handleDocumentMouseDown(event: MouseEvent): void {
      const target = event.target as Node | null;
      if (!target) return;
      if (navRef.current && !navRef.current.contains(target)) {
        setIsOpenDropdown(null);
      }
    }

    function handleDocumentKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);
    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [isOpenDropdown]);

  const handleDropdown = useCallback((key: string) => {
    setIsOpenDropdown((prev) => (prev === key ? null : key));
  }, []);

  const navBarItems = useMemo(() => {
    return navItems.map((item) => {
      if (item.label === "Profile") {
        return {
          ...item,
          label: formattedName || "Profile",
          icon: CircleUserIcon,
          profileUrl: profile?.photoUrl,
          profileName: formattedName?.charAt(0)?.toUpperCase(),
        };
      }
      return item;
    });
  }, [profile?.photoUrl, formattedName]);

  return (
    <div ref={navRef} className="flex h-full gap-2 items-center">
      {navBarItems?.length > 0 &&
        navBarItems?.map((item, index) => {
          const key = item.path || item.label || String(index);
          const hasDropdown = Boolean(item.subItems?.length);
          const isOpen = hasDropdown && isOpenDropdown === key;
          const menuId = `navbar-menu-${index}`;
          const isActive =
            Boolean(item.path) &&
            (pathname === item.path ||
              (item.path !== "/" && pathname.startsWith(`${item.path}/`)));

          return (
            <div key={key} className="relative">
              {hasDropdown ? (
                <button
                  type="button"
                  className={[
                    "flex items-center gap-1 px-3 pb-1 rounded-md",
                    "hover:bg-blue-700/40 transition-colors duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                  ].join(" ")}
                  onClick={() => handleDropdown(key)}
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                >
                  <span className="aspect-square" aria-hidden="true">
                    <NavMenuIcon item={item} size={28} />
                  </span>
                  <span className="text-base font-medium">{item.label || ""}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
              ) : item.path ? (
                <Link
                  href={item.path}
                  className={[
                    "flex items-center gap-1 px-3 pb-1 rounded-md",
                    "hover:bg-blue-700/40 transition-colors duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                    isActive ? "bg-blue-700/50" : "",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="aspect-square" aria-hidden="true">
                    <NavMenuIcon item={item} size={28} />
                  </span>
                  <span className="text-base font-medium">{item.label || ""}</span>
                </Link>
              ) : null}

              {hasDropdown && isOpen && (
                <div
                  id={menuId}
                  role="menu"
                  aria-label={item.label || "Menu"}
                  className="dropdown-menu absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg z-20 min-w-52 overflow-hidden"
                >
                  {item.subItems?.map((subItem: NavItem, subIndex: number) => {
                    if (!subItem.path) return null;
                    const isSubActive =
                      pathname === subItem.path ||
                      (subItem.path !== "/" &&
                        pathname.startsWith(`${subItem.path}/`));
                    return (
                      <Link
                        key={subItem.path ?? subIndex}
                        href={subItem.path}
                        role="menuitem"
                        className={[
                          "px-4 py-2 block",
                          "hover:text-blue-800 hover:bg-gray-50",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40",
                          isSubActive ? "text-blue-800 bg-gray-50" : "",
                        ].join(" ")}
                        onClick={() => setIsOpenDropdown(null)}
                      >
                        <span className="flex items-center gap-2 text-lg font-normal">
                          <subItem.icon className="w-5 h-5" aria-hidden="true" />
                          <span>{subItem.label}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

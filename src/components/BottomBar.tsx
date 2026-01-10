"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navMobileMenu } from "@/constants/menuItems";
import { useAuthStore, useProfileStore, selectFormattedName } from "@/zustand";
import { NavMenuIcon } from "./ui";

export default function BottomBar() {
  const pathname = usePathname();
  const uid = useAuthStore((s) => s.uid);
  const profile = useProfileStore((s) => s.profile);
  const formattedName = useProfileStore(selectFormattedName);

  const bottomMenu = useMemo(() => {
    return navMobileMenu.map((item) => {
      if (item.label === "You") {
        return {
          ...item,
          profileUrl: profile?.photoUrl,
          profileName: formattedName?.charAt(0)?.toUpperCase(),
        };
      }
      return item;
    });
  }, [profile?.photoUrl, formattedName]);

  if (!uid) return null;

  return (
    <div className="w-full border-t border-border/60 bg-background/95 supports-backdrop-filter:bg-background/70 backdrop-blur">
      <nav className="flex justify-between h-11" aria-label="Bottom navigation">
        {bottomMenu?.length
          ? bottomMenu.map((item) => {
              if (!item.path) return null;
              const isActive =
                pathname === item.path ||
                (item.path !== "/" && pathname.startsWith(`${item.path}/`));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={[
                    "flex flex-col items-center justify-center rounded-md px-3",
                    "text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive ? "bg-accent text-foreground" : "",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.label || "Navigate"}
                >
                  <span aria-hidden="true">
                    <NavMenuIcon item={item} size={24} />
                  </span>
                  <span className="text-[12px] h-3 text-center mx-auto">
                    {item.label}
                  </span>
                </Link>
              );
            })
          : null}
      </nav>
    </div>
  );
}

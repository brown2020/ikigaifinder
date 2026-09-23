"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNav, isActivePath } from "@/constants/menuItems";
import { useAuthStore } from "@/zustand";
import { cn } from "@/utils/cn";

export default function MobileNav(): React.ReactElement | null {
  const pathname = usePathname();
  const uid = useAuthStore((s) => s.uid);
  if (!uid) return null;

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur sm:hidden"
    >
      <ul className="grid h-14 grid-cols-3">
        {appNav.map((item) => {
          const active = isActivePath(pathname, item.path) ||
            (item.path === "/ikigai-finder" && isActivePath(pathname, "/generate-ikigai"));
          return (
            <li key={item.path}>
              <Link
                href={item.path}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="size-5" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import IkigaiLogo from "@/components/icons/IkigaiLogo";
import { ButtonLink } from "@/components/ui/Button";
import { appNav, isActivePath } from "@/constants/menuItems";
import { useAuthStore } from "@/zustand";
import { cn } from "@/utils/cn";
import UserMenu from "./UserMenu";

export default function SiteHeader(): React.ReactElement {
  const pathname = usePathname();
  const uid = useAuthStore((s) => s.uid);
  const authReady = useAuthStore((s) => s.authReady);

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href={uid ? "/dashboard" : "/"} className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <IkigaiLogo className="size-8 text-foreground" />
          <span className="whitespace-nowrap font-display text-lg font-semibold tracking-tight">Ikigai Finder</span>
        </Link>

        {uid ? (
          <div className="flex items-center gap-1">
            <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
              {appNav.slice(0, 2).map((item) => {
                const active = isActivePath(pathname, item.path) ||
                  (item.path === "/ikigai-finder" && isActivePath(pathname, "/generate-ikigai"));
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <UserMenu />
          </div>
        ) : (
          <div className={cn("flex items-center gap-2 transition-opacity", !authReady && "opacity-0")}>
            <Link href="/login" className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground sm:px-4">
              Sign in
            </Link>
            <ButtonLink href="/signup" size="sm">
              Get started
            </ButtonLink>
          </div>
        )}
      </div>
    </header>
  );
}

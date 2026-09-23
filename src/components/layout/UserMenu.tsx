"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import { useProfileStore, selectFormattedName } from "@/zustand";

export default function UserMenu(): React.ReactElement {
  const photoUrl = useProfileStore((s) => s.profile.photoUrl);
  const name = useProfileStore(selectFormattedName);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initial = name.charAt(0).toUpperCase() || "?";

  return (
    <div ref={ref} className="relative ml-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-sm font-semibold text-foreground transition hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {photoUrl ? (
          <Image src={photoUrl} alt="" width={40} height={40} className="size-full object-cover" />
        ) : (
          initial
        )}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-lg animate-fade-in"
        >
          <p className="truncate px-3 py-2 text-sm text-muted-foreground">{name}</p>
          <Link role="menuitem" href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-muted">
            <UserRound className="size-4" aria-hidden="true" /> Profile
          </Link>
          <Link role="menuitem" href="/logout" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-muted">
            <LogOut className="size-4" aria-hidden="true" /> Sign out
          </Link>
        </div>
      )}
    </div>
  );
}

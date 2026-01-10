"use client";
import IkigaiLogo from "@/components/icons/IkigaiLogo";
import NavbarMenuItems from "./NavbarMenuItems";
import Link from "next/link";
import NavbarLoginItem from "./NavbarLoginItem";
import { useAuthStore } from "@/zustand";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { uid } = useAuthStore();
  return (
    <div className="flex items-center justify-between w-full h-16 shrink-0 px-5 sm:px-10">
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <IkigaiLogo
          className="w-8 h-8 sm:w-9 sm:h-9"
          strokeColor="hsl(var(--foreground))"
        />
        <div className="text-lg sm:text-xl font-semibold tracking-tight">
          Ikigai Finder
        </div>
      </Link>
      <div className="flex items-center gap-2">
        {uid ? (
          <div className="hidden sm:block">
            <NavbarMenuItems />
          </div>
        ) : (
          <NavbarLoginItem />
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}

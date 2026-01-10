"use client";
import IkigaiLogo from "@/components/icons/IkigaiLogo";
import NavbarMenuItems from "./NavbarMenuItems";
import Link from "next/link";
import NavbarLoginItem from "./NavbarLoginItem";
import { useAuthStore } from "@/zustand";

export default function Navbar() {
  const { uid } = useAuthStore();
  return (
    <div className="flex items-center justify-between w-full h-16 shrink-0 px-5 sm:px-10">
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <IkigaiLogo
          className="md:w-10 md:h-10 w-8 h-8 sm:min-w-10 min-w-8"
          strokeColor="hsl(var(--foreground))"
        />
        <div className="md:text-4xl text-2xl">IKIGAI FINDER</div>
      </Link>
      {uid ? (
        <div>
          <div className="hidden sm:block">
            <NavbarMenuItems />
          </div>
        </div>
      ) : (
        <div>
          <NavbarLoginItem />
        </div>
      )}
    </div>
  );
}

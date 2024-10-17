"use client";
import IkigaiLogo from "@/SVGCompoenets/Ikigai-logo";
import NavbarMenuItems from "./NavbarMenuItems";
import Link from "next/link";
import NavbarLoginItem from "./NavbarLoginItem";
import { useAuthStore } from "@/zustand";

export default function Navbar() {
  const { uid } = useAuthStore();
  return (
    <div
      className={`flex items-center justify-between w-full py-3 flex-shrink-0 bg-blue-800 text-white sm:px-10 px-5 transition-colors duration-700`}
    >
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <IkigaiLogo
          className="md:w-10 md:h-10 w-8 h-8 sm:min-w-10 min-w-8"
          strokeColor="white"
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

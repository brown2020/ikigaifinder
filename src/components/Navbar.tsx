"use client";
import IkigaiLogo from "@/SVGCompoenets/Ikigai-logo";
import NavbarMenuMobilesItems from "./NavbarMenuMobilesItems";
import NavbarMenuItems from "./NavbarMenuItems";
import Link from "next/link";

export default function Navbar() {
  return (
    <div
      className={`flex items-center justify-between w-full py-3 flex-shrink-0 bg-blue-800 text-white sm:px-10 px-5 transition-colors duration-700`}
    >
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <IkigaiLogo
          className="md:w-10 md:h-10 w-8 h-8 sm:min-w-10 min-w-8"
          strokeColor="white"
        />
        <div className="text-4xl">IKIGAI FINDER</div>
      </Link>

      <div className="hidden md:block">
        <NavbarMenuItems />
      </div>
      <div className="md:hidden block">
        <NavbarMenuMobilesItems />
      </div>
    </div>
  );
}

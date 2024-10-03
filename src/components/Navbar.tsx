"use client";
import IkigaiLogo from "@/SVGCompoenets/Ikigai-logo";
import Image from "next/image";
import NavbarMenuMobilesItems from "./NavbarMenuMobilesItems";
import NavbarMenuItems from "./NavbarMenuItems";
import Link from "next/link";

export default function Navbar() {
  return (
    <div
      className={`flex items-center justify-between w-full py-3 flex-shrink-0 bg-blue-800 text-white px-10 transition-colors duration-700`}
    >
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <IkigaiLogo
          className="md:w-10 md:h-10 w-8 h-8 sm:min-w-10 min-w-8"
          strokeColor="white"
        />
        <Image
          src="/assets/Ikigai-Finder.svg"
          alt="Ikigai Finder"
          width={300}
          height={100}
          className="md:w-56 sm:w-80 w-44"
        />
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

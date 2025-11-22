"use client";
import { LogIn } from "lucide-react";
import Image from "next/image";
import { useAuthModal } from "@/context/AuthModalContext";

export default function NavbarLoginItem() {
  const { openModal } = useAuthModal();

  return (
    <div>
      <div
        className="flex items-center gap-1 px-3 cursor-pointer"
        onClick={openModal}
      >
        <div className="hidden md:flex items-center gap-1 px-3">
            
          <div className="aspect-square">
            <LogIn size={28} className="h-full object-cover text-2xl w-7" />
          </div>
          <div className="text-lx font-medium hidden md:block">Sign In</div>
        </div>
        <Image
          src={"/assets/enter.png"}
          alt="profile"
          width={30}
          height={30}
          className="filter invert md:hidden block"
        />
      </div>
    </div>
  );
}

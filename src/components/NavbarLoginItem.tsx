"use client";
import { LogIn } from "lucide-react";
import { useState } from "react";
import AuthComponent from "./AuthComponent";
import Image from "next/image";

export default function NavbarLoginItem() {
  const [isOpenAuthModal, setIsOpenAuthModal] = useState<boolean>(false);

  const handleOpenAuthModal = () => setIsOpenAuthModal(true);
  return (
    <div>
      <div
        className="flex items-center gap-1 px-3 cursor-pointer"
        onClick={handleOpenAuthModal}
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
      {isOpenAuthModal && (
        <AuthComponent
          isOpenModal={isOpenAuthModal}
          onCloseModal={() => setIsOpenAuthModal(false)}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { navMobileItems } from "@/constants/menuItems";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import IkigaiLogo from "@/SVGCompoenets/Ikigai-logo";
import Link from "next/link";

const Drawer = () => {
  const router = useRouter();
  const [isOpenDrawerMenu, setIsOpenDrawerMenu] = useState(false);

  const toggleDrawer = () => {
    setIsOpenDrawerMenu(!isOpenDrawerMenu);
  };

  return (
    <div>
      <button
        onClick={toggleDrawer}
        className={`transition duration-300 ease-in-out`}
      >
        {isOpenDrawerMenu ? (
          <X color="white" size={35} />
        ) : (
          <Menu color="white" size={35} />
        )}
      </button>

      <div
        className={`fixed inset-0 bg-black bg-opacity-75 transition-opacity duration-700 ${
          isOpenDrawerMenu ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleDrawer}
      ></div>

      <div
        className={`fixed inset-y-0 left-0 w-full bg-white transition-transform transform duration-700 ${
          isOpenDrawerMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-full flex">
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer text-black pl-4"
            onClick={toggleDrawer}
          >
            <IkigaiLogo
              className="md:w-10 md:h-10 w-8 h-8 sm:min-w-10 min-w-8"
              strokeColor="black"
            />
            <div className="text-2xl">IKIGAI FINDER</div>
          </Link>
          <button onClick={toggleDrawer} className="p-4 text-black ml-auto">
            <X color="black" size={35} />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          {navMobileItems?.length &&
            navMobileItems?.map((item) => (
              <div
                className="flex items-center space-x-2 text-gray-800"
                key={item.path}
                onClick={() => {
                  if (item?.path) {
                    router.push(item.path);
                    toggleDrawer();
                  }
                }}
              >
                <span>{item?.icon && <item.icon className="w-5 h-5" />}</span>
                <span>{item?.label}</span>
              </div>
            ))}
        </nav>
      </div>
    </div>
  );
};

export default Drawer;

"use client";

import { useEffect, useId, useState } from "react";
import { navMobileMenu } from "@/constants/menuItems";
import { Menu, X } from "lucide-react";
import IkigaiLogo from "@/components/icons/IkigaiLogo";
import Link from "next/link";

const Drawer = () => {
  const [isOpenDrawerMenu, setIsOpenDrawerMenu] = useState(false);
  const drawerId = useId();

  const toggleDrawer = () => {
    setIsOpenDrawerMenu(!isOpenDrawerMenu);
  };

  useEffect(() => {
    if (!isOpenDrawerMenu) return;
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") setIsOpenDrawerMenu(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpenDrawerMenu]);

  return (
    <div>
      <button
        onClick={toggleDrawer}
        className={`transition duration-300 ease-in-out`}
        type="button"
        aria-label={isOpenDrawerMenu ? "Close menu" : "Open menu"}
        aria-expanded={isOpenDrawerMenu}
        aria-controls={drawerId}
      >
        {isOpenDrawerMenu ? (
          <X color="white" size={35} />
        ) : (
          <Menu color="white" size={35} />
        )}
      </button>

      <button
        type="button"
        aria-label="Close menu"
        className={`fixed inset-0 bg-black bg-opacity-75 transition-opacity duration-700 ${
          isOpenDrawerMenu ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleDrawer}
      />

      <div
        id={drawerId}
        className={`fixed inset-y-0 left-0 w-full bg-white transition-transform transform duration-700 ${
          isOpenDrawerMenu ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
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
          <button
            onClick={toggleDrawer}
            className="p-4 text-black ml-auto"
            type="button"
            aria-label="Close menu"
          >
            <X color="black" size={35} />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-1" aria-label="Mobile navigation">
          {navMobileMenu?.length
            ? navMobileMenu.map((item) => {
                if (!item.path) return null;
                return (
                  <Link
                    className="flex items-center space-x-2 text-gray-800 rounded-md px-3 py-2 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsOpenDrawerMenu(false)}
                  >
                    <span aria-hidden="true">
                      {item.icon ? <item.icon className="w-5 h-5" /> : null}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })
            : null}
        </nav>
      </div>
    </div>
  );
};

export default Drawer;

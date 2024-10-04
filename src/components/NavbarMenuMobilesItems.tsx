import { navMobileItems } from "@/constants/menuItems";
import { useAuthStore } from "@/zustand";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavbarMenuMobilesItems() {
  const { uid } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const dropdownElements = document.querySelectorAll(".dropdown-mobile-menu");
    if (!Array.from(dropdownElements).some((el) => el.contains(target))) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button onClick={toggleMenu}>
        <Menu color="white" size={35} />
      </button>

      {/* Dropdown menu */}
      <div
        className={`dropdown-mobile-menu absolute right-0 w-48 mt-2 bg-white border border-gray-300 rounded-md shadow-lg transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="py-1">
          {navMobileItems
            ?.filter((item) =>
              uid ? item : item.label !== "Logout"
            )
            ?.map((item, index) => (
              <li
                key={index}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                <Link
                  href={item.path || ""}
                  className="flex items-center space-x-2"
                  onClick={toggleMenu}
                >
                  <span>{item.icon && <item.icon className="w-5 h-5" />}</span>

                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

"use client";
import { navItems } from "@/constants/menuItems";
import { useAuthStore } from "@/zustand";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavbarMenuItems() {
  const router = useRouter();
  const { uid } = useAuthStore();
  const [isOpenDropdown, setIsOpenDropdown] = useState<string | null>(null);
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const dropdownElements = document.querySelectorAll(".dropdown-menu");
    if (!Array.from(dropdownElements).some((el) => el.contains(target))) {
      setIsOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdown = (label: string) => {
    setIsOpenDropdown(isOpenDropdown === label ? null : label);
  };
  return (
    <div className="flex h-full gap-2 items-center">
      {navItems?.length > 0 &&
        navItems.map((item, index) => (
          <div key={index} className="relative">
            <div
              className="flex items-center gap-1 px-3 cursor-pointer pb-1"
              onClick={() =>
                item.subItems
                  ? handleDropdown(item.label)
                  : item.path && router.push(item.path)
              }
            >
              <div className="aspect-square">
                <item.icon
                  size={28}
                  className="h-full object-cover text-2xl w-7"
                />
              </div>
              <div className="text-lx font-medium">{item.label}</div>
              {item.subItems && (
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isOpenDropdown === item.label ? "rotate-180" : ""
                  }`}
                />
              )}
            </div>

            {item.subItems && isOpenDropdown === item.label && (
              <div className="dropdown-menu absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg z-20 min-w-52">
                {item.subItems
                  ?.filter((item) =>
                    uid ? item : item.label !== "Logout"
                  )
                  .map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className="px-4 py-2 hover:text-blue-800 cursor-pointer"
                      onClick={() => {
                        if (subItem.path) {
                          router.push(subItem.path);
                          setIsOpenDropdown(null);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2 text-lg font-normal">
                        <subItem.icon className="w-5 h-5" />
                        <span>{subItem.label}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

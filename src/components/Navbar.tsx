"use client";
import { useEffect, useState } from "react";
import IkigaiLogo from "@/SVGCompoenets/Ikigai-logo";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { navItems } from "@/constants/menuItems";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [bgColor, setBgColor] = useState("bg-blue-800");
  const [isOpenDropdown, setIsOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setBgColor("bg-blue-800");
      } else {
        setBgColor("bg-blue-800");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDropdown = (label: string) => {
    setIsOpenDropdown(isOpenDropdown === label ? null : label);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const dropdownElements = document.querySelectorAll('.dropdown-menu');
    if (!Array.from(dropdownElements).some(el => el.contains(target))) {
      setIsOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`flex items-center justify-between w-full py-3 flex-shrink-0 ${bgColor} text-white px-10 transition-colors duration-700`}
    >
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <IkigaiLogo
          className="w-10 h-10 sm:min-w-10 min-w-8"
          strokeColor="white"
        />
        <Image
          src="/assets/Ikigai-Finder.svg"
          alt="Ikigai Finder"
          width={300}
          height={100}
          className="w-56 sm:w-80"
        />
      </div>

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
                <div className="h-9 aspect-square">
                  <item.icon size={30} className="h-full w-full object-cover" />
                </div>
                <div className="text-lx font-bold">{item.label}</div>
                {item.subItems && (
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isOpenDropdown === item.label ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {item.subItems && isOpenDropdown === item.label && (
                <div className="dropdown-menu absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg z-20">
                  {item.subItems.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className="px-4 py-2 hover:text-blue-800 cursor-pointer"
                      onClick={() => {
                        if (subItem.path) router.push(subItem.path);
                      }}
                    >
                      <div className="flex items-center gap-2 text-lg font-semibold">
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
    </div>
  );
}

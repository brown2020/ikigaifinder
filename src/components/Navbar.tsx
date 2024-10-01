"use client";
import { useEffect, useState } from "react";
import IkigaiLogo from "@/SVGCompoenets/Ikigai-logo";
import Image from "next/image";
import { navItemType } from "@/types/interface";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [bgColor, setBgColor] = useState("bg-transparent");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setBgColor("bg-blue-800");
      } else {
        setBgColor("bg-transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems: navItemType[] = [
    {
      label: "Ikigai",
      icon: <IkigaiLogo className="w-8 h-8" strokeColor="white" />,
      path: "/ikigai-finder",
      surveySet: "ikigai",
    },
  ];

  return (
    <div
      className={`flex items-center justify-between w-full py-3 flex-shrink-0 ${bgColor} text-white px-10 transition-colors duration-700`}
    >
      <div className="flex items-center gap-2 cursor-pointer" 
        onClick={() => router.push("/")}
      >
        <IkigaiLogo className="w-10 h-10 sm:min-w-10 min-w-8" strokeColor="white" />
        
        <Image
          src="/assets/Ikigai-Finder.svg"
          alt="Ikigai Finder"
          width={300}
          height={100}
          className="w-56 sm:w-80"
        />
      </div>

      <div className="flex h-full gap-2 opacity-0 md:opacity-100 items-center">
        {navItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-3 h-full transition-all duration-300 ease-in-out cursor-pointer hover:opacity-100 border-b-2 border-transparent hover:border-white"
            // onClick={() => handleNavigation(item)}
            onClick={() => router.push(item.path)}
          >
            <div className="h-9 aspect-square">{item.icon}</div>
            <div className="text-lx font-bold">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

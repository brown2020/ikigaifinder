"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { navItems } from "@/constants/menuItems";
import { ChevronDown, CircleUserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/zustand";
import { navItemType } from "@/types/interface";

export default function NavbarMenuItems() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
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

  const handleProfileName = () => {
    if (profile?.firstName) {
      return `${profile?.firstName} ${profile?.lastName || ""}`;
    }
    return profile?.email?.split("@")[0];
  };

  const navBarItems = navItems.map((item) => {
    if (item.label === "Profile") {
      const userName = handleProfileName();
      return {
        ...item,
        label: userName,
        icon: CircleUserIcon,
        profileUrl: profile?.photoUrl,
        profileName: userName?.split("")[0]?.toUpperCase(),
      };
    }

    return item;
  });

  const renderMenuIcon = (item: navItemType) => {
    switch (true) {
      case !!item.profileUrl:
        return (
          <Image
            src={item.profileUrl || ""}
            alt="profile"
            width={28}
            height={28}
            className="h-full object-cover text-2xl w-7 rounded-full"
          />
        );
      case !!item.profileName:
        return (
          <div className="h-full object-cover text-lg w-6 bg-white font-medium text-black rounded-full flex items-center justify-center">
            {item.profileName}
          </div>
        );
      default:
        return <item.icon size={28} className="h-full object-cover text-2xl w-7" />;
    }
  };

  return (
    <div className="flex h-full gap-2 items-center">
      {navBarItems?.length > 0 &&
        navBarItems?.map((item, index) => (
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
                {renderMenuIcon(item)}
              </div>
              <div className="text-base font-medium">{item.label || ""}</div>
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
                {item.subItems.map((subItem: navItemType, subIndex: number) => (
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

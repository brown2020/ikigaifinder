"use client";
import Image from "next/image";
import { navMobileMenu } from "@/constants/menuItems";
import { useAuthStore, useProfileStore } from "@/zustand";
import { useRouter } from "next/navigation";
import type { NavItem } from "@/types";

export default function BottomBar() {
  const router = useRouter();
  const { uid } = useAuthStore();
  const profile = useProfileStore((s) => s.profile);
  if (!uid) return null;

  const handleProfileName = () => {
    if (profile?.firstName) {
      return `${profile?.firstName} ${profile?.lastName || ""}`;
    }
    return profile?.email?.split("@")[0];
  };

  const bottomMenu = navMobileMenu.map((item) => {
    if (item.label === "You") {
      const userName = handleProfileName();
      return {
        ...item,
        profileUrl: profile?.photoUrl,
        profileName: userName?.split("")[0]?.toUpperCase(),
      };
    }

    return item;
  });

  const renderMenuIcon = (item: NavItem) => {
    switch (true) {
      case !!item.profileUrl:
        return (
          <Image
            src={item.profileUrl}
            alt="profile"
            width={20}
            height={20}
            className="object-cover w-6 rounded-full h-6"
          />
        );
      case !!item.profileName:
        return (
          <div className="object-cover text-base w-6 h-6 max-h-6  bg-white font-medium text-black rounded-full flex items-center justify-center">
            {item.profileName}
          </div>
        );
      default:
        return (
          <item.icon
            size={20}
            className="h-full object-cover text-2xl w-6 max-h-6"
          />
        );
    }
  };
  return (
    <div className={`w-full py-1 bg-blue-800 text-white sm:px-10 px-5`}>
      <nav className="flex justify-between h-11">
        {bottomMenu?.length &&
          bottomMenu?.map((item) => (
            <div
              key={item.path}
              onClick={() => {
                console.log("clicked");
                if (item?.path) {
                  router.push(item.path);
                }
              }}
              className="flex flex-col items-center justify-center"
            >
              <div>{renderMenuIcon(item)}</div>
              <span className="text-[12px] h-3 text-center mx-auto">
                {item?.label}
              </span>
            </div>
          ))}
      </nav>
    </div>
  );
}

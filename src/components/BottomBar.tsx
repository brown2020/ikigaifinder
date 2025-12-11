"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { navMobileMenu } from "@/constants/menuItems";
import { useAuthStore, useProfileStore, selectFormattedName } from "@/zustand";
import { NavMenuIcon } from "./ui";

export default function BottomBar() {
  const router = useRouter();
  const uid = useAuthStore((s) => s.uid);
  const profile = useProfileStore((s) => s.profile);
  const formattedName = useProfileStore(selectFormattedName);

  const bottomMenu = useMemo(() => {
    return navMobileMenu.map((item) => {
      if (item.label === "You") {
        return {
          ...item,
          profileUrl: profile?.photoUrl,
          profileName: formattedName?.charAt(0)?.toUpperCase(),
        };
      }
      return item;
    });
  }, [profile?.photoUrl, formattedName]);

  if (!uid) return null;

  return (
    <div className={`w-full py-1 bg-blue-800 text-white sm:px-10 px-5`}>
      <nav className="flex justify-between h-11">
        {bottomMenu?.length &&
          bottomMenu?.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => item?.path && router.push(item.path)}
              className="flex flex-col items-center justify-center"
            >
              <NavMenuIcon item={item} size={24} />
              <span className="text-[12px] h-3 text-center mx-auto">
                {item?.label}
              </span>
            </button>
          ))}
      </nav>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerNav } from "@/constants/menuItems";

export default function FooterNavBar() {
  const pathname = usePathname();
  return (
    <nav className="text-center flex justify-center items-center gap-4 py-1 px-1">
      {footerNav.map((item) => (
        <Link
          href={item.path}
          key={item.name}
          className={[
            "text-gray-500 hover:text-gray-700 transition-colors",
            pathname === item.path ? "text-gray-900 font-medium" : "",
          ].join(" ")}
          aria-current={pathname === item.path ? "page" : undefined}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}

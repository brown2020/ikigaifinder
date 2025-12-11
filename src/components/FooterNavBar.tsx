import Link from "next/link";
import { footerNav } from "@/constants/menuItems";

export default function FooterNavBar() {
  return (
    <nav className="text-center flex justify-center items-center gap-4 py-1 px-1">
      {footerNav.map((item) => (
        <Link
          href={item.path}
          key={item.name}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}

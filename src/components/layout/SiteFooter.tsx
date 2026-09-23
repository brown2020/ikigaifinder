import Link from "next/link";
import IkigaiLogo from "@/components/icons/IkigaiLogo";
import { footerNav } from "@/constants/menuItems";

export default function SiteFooter(): React.ReactElement {
  return (
    <footer className="border-t border-border pb-16 sm:pb-0">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <IkigaiLogo className="size-6" />
          <span className="text-sm">生き甲斐 · a reason for being</span>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {footerNav.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="text-muted-foreground hover:text-foreground">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function FooterNavBar() {
  return (
    <div className="text-center flex justify-center items-center gap-4 py-1 px-1">
      {footerNav?.length > 0
        ? footerNav?.map((item) => {
            return (
              <Link href={item.path} key={item.name}>
                <div className="text-gray-500 hover:text-gray-700">{item.name}</div>
              </Link>
            );
          })
        : null}
    </div>
  );
}

const footerNav = [
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Privacy",
    path: "/privacy-policy",
  },
  {
    name: "Terms",
    path: "/terms-conditions",
  },
];

import { useEffect, useMemo, useState } from "react";
import { navMobileItems, withoutSignInNaveBar } from "@/constants/menuItems";
import { useAuthStore } from "@/zustand";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthComponent from "./AuthComponent";

export default function NavbarMenuMobilesItems() {
  const router = useRouter();
  const { uid } = useAuthStore();
  const [isOpenDropdownMenu, setIsOpenDropdownMenu] = useState(false);
  const [isOpenAuthModal, setIsOpenAuthModal] = useState<boolean>(false);

  const handleOpenAuthModal = () => setIsOpenAuthModal(!isOpenAuthModal);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const dropdownElements = document.querySelectorAll(".dropdown-mobile-menu");
    if (!Array.from(dropdownElements).some((el) => el.contains(target))) {
      setIsOpenDropdownMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpenDropdownMenu(!isOpenDropdownMenu);
  };

  const executeItemAction = (label: string) => {
    switch (label) {
      case "Sign In":
        handleOpenAuthModal();
        break;
      default:
        break;
    }
    toggleMenu();
  };

  const navItemData = useMemo(() => {
    return uid ? navMobileItems : withoutSignInNaveBar;
  }, [uid]);

  return (
    <div className="relative">
      <button onClick={toggleMenu}>
        <Menu color="white" size={35} />
      </button>

      {/* Dropdown menu */}
      <div
        className={`dropdown-mobile-menu absolute right-0 w-48 mt-2 bg-white border border-gray-300 rounded-md shadow-lg transition-opacity duration-200 ${
          isOpenDropdownMenu ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="py-1">
          {navItemData?.map((item, index) => (
            <li
              key={index}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              <div
                className="flex items-center space-x-2"
                // onClick={toggleMenu}
                onClick={() => {
                  if (item?.path) {
                    router.push(item.path);
                    toggleMenu();
                  } else {
                    executeItemAction(item?.label);
                  }
                }}
              >
                <span>{item.icon && <item.icon className="w-5 h-5" />}</span>
                <span>{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isOpenAuthModal && (
        <AuthComponent
          isOpenModal={isOpenAuthModal}
          onCloseModal={() => setIsOpenAuthModal(false)}
        />
      )}
    </div>
  );
}

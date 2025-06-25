"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import Cart from "./cart/Cart";
import ProfileDropdown from "./ProfileDropdown";
import { usePathname } from "next/navigation";
import { getClientCookie } from "@/lib/getCookie";
import Cookies from "js-cookie";
import AuthModal from "./modals/AuthModal";
import { useCartContext } from "@/context/context";
const NoSSRLocationModal = dynamic(() => import("./modals/LocationModal"), {
  ssr: false,
});

const Header = () => {



  const {token , user } = useCartContext();
  // const storedUser =  Cookies.get("userData");

  
  //  if(storedUser)
  //   var parsedUser = JSON.parse(storedUser);

  



  const pathname = usePathname();

  return (
    <header className="w-full sticky top-0 z-50 h-20 bg-white shadow-sm shadow-neutral-300">
      <nav className="flex flex-row h-full w-full lg:w-[85%] items-center justify-between p-2 lg:pb-0 lg:pt-0 m-auto">
        <NoSSRLocationModal />
        <Link
          href="/"
          className="flex relative justify-center max-w-16 lg:w-full h-full lg:max-w-36 -order-1 "
        >
          <Image
            src="/logo.webp"
            alt="website-logo-showing-its-name"
            width={80}
            height={80}
            fetchPriority="high"
            className="object-contain m-auto"
            title="Burger Lab"
          />
        </Link>
        <div className="flex flex-row flex-1 gap-1 sm:gap-3 items-center w-full h-full justify-end pl-2 pr-2">
          {pathname !== "/checkout" && pathname !== "/order-complete" && (
            <Cart type="CART" className="block min-[400px]:block" />
          )}
          {token ? (
            <ProfileDropdown user={`${user?.firstName} ${user?.lastName}`} />
          ) : (
          <AuthModal/>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

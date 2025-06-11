"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import Cart from "./cart/Cart";
import ProfileDropdown from "./ProfileDropdown";
import { usePathname } from "next/navigation";
import AuthModal from "./modals/AuthModal";
import { useEffect, useMemo } from "react";
import { useUserStore } from "@/store/slices/userSlice";
import { dummyUser } from "@/lib/dummyData";
import { User } from "@/types";

const NoSSRLocationModal = dynamic(() => import("./modals/LocationModal"), {
  ssr: false,
});

const Header = () => {
  const { user, updateUser } = useUserStore();

  // Using dummy data instead
  const mockUser = useMemo<User>(
    () => ({
      ...dummyUser,
      role: "user", // Adding required role field
    }),
    []
  );

  useEffect(() => {
    updateUser(mockUser);
  }, [mockUser, updateUser]);

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
            <Cart type="CART" className="hidden min-[400px]:block" />
          )}
          {user ? (
            <ProfileDropdown user={user.name} />
          ) : (
            <AuthModal />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

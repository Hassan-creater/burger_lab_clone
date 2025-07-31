"use client";

import { capitalizeFirstLetter, textShortener } from "@/lib/utils";
import { CircleUserIcon } from "./icons";
// import { Button } from "./ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";
import { profileDropdown } from "@/lib/constants";
import Link from "next/link";
import { ChevronDown, LogOut, Menu } from "lucide-react";
import { logoutAction } from "@/functions";
import { useUserStore } from "@/store/slices/userSlice";
import { apiClient } from "@/lib/api";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ProfileDropdownProps = {
  user: string;
};

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const { updateUser } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const logout = async () => {
     const res = await apiClient.get("/auth/logout");
     
     if(res.status == 204){
        Cookies.remove("accessToken", { path: "/" });
        Cookies.remove("refreshToken", { path: "/" });
        Cookies.remove("userData" , {path : "/"});
        localStorage.removeItem("defaultAddress")
        window.location.reload();
     }

  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        title="My Account"
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-lg md:bg-primaryOrange/60 p-2 w-auto h-auto flex items-center gap-1.5 md:hover:bg-primaryOrange/80"
      >
        <CircleUserIcon width={18} height={18} className="hidden md:inline-block" />
        <p className="font-normal hidden md:inline-block">
          {textShortener(capitalizeFirstLetter(user), 8)}
        </p>
        <ChevronDown className="w-4 h-4 hidden md:inline-block" />
        <Menu className="size-6 inline-block md:hidden" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 min-w-[150px] rounded-md bg-white  px-4 py-2 shadow-lg z-50">
          <div>
            {profileDropdown.map((dropdownItem) => (
              <Link href={dropdownItem.href} key={dropdownItem.href}>
                <div onClick={()=>setIsOpen(false)} className="cursor-pointer text-center flex gap-2 items-center p-2 hover:bg-slate-100 rounded-md">
                  {dropdownItem.icon && (
                    <dropdownItem.icon className="w-5 h-5 text-gray-500" />
                  )}
                  {dropdownItem.name}
                </div>
              </Link>
            ))}
          </div>
          <hr className="my-2 border-gray-200" />
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-400 text-center font-semibold rounded-full px-3 py-2 text-white cursor-pointer flex gap-3 justify-center"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      )}
    </div>

  );
}

import { capitalizeFirstLetter, textShortener } from "@/lib/utils";
import { CircleUserIcon } from "./icons";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { profileDropdown } from "@/lib/constants";
import Link from "next/link";
import { ChevronDown, LogOut, Menu } from "lucide-react";

type ProfileDropdownProps = {
  user: string;
};

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild title="My Account">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-lg md:bg-primaryOrange/60 p-2 w-auto h-auto flex items-center gap-1.5 md:hover:bg-primaryOrange/80"
        >
          <CircleUserIcon
            width={18}
            height={18}
            className="hidden md:inline-block"
          />
          <p className="font-normal hidden md:inline-block">
            {textShortener(capitalizeFirstLetter(user), 8)}
          </p>
          <ChevronDown className="w-4 h-4 hidden md:inline-block" />
          <Menu className="size-6 inline-block md:hidden" />
        </Button>
        {/* <Button className="md:hidden flex items-center p-1 rounded-lg bg-transparent"></Button> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max px-4">
        <DropdownMenuGroup>
          {profileDropdown.map((dropdownItem) => (
            <Link
              href={dropdownItem.href}
              key={dropdownItem.href}
              className="w-full h-max flex items-center p-1"
            >
              <DropdownMenuItem className="cursor-pointer text-center flex gap-2 items-center">
                <>
                  {dropdownItem.icon && <dropdownItem.icon className="w-5 h-5 text-gray-500"/>}
                  {dropdownItem.name}
                </>
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="bg-red-500 hover:bg-red-400 text-center font-semibold rounded-full px-3 py-2 my-2 text-white cursor-pointer flex gap-3 justify-center">
          <LogOut className="w-5 h-5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

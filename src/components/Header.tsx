"use client";

import Image from "next/image";
import Link from "next/link";
import Cart from "./cart/Cart";
import { CircleUserIcon, LocationDropIcon, SearchIcon } from "./icons";

const Header = () => {
	return (
		<header className="w-full sticky top-0 z-50 h-20 bg-white shadow-md shadow-neutral-300">
			<nav className="flex flex-row h-full w-full lg:w-[85%] items-center justify-between p-2 lg:pb-0 lg:pt-0 m-auto">
				<div className=" flex gap-2 flex-1 items-center h-full justify-start pl-2 pr-2 lg:-order-1">
					<LocationDropIcon width={24} height={24} />
					<div className="flex flex-col gap-1 justify-center w-full max-w-36 cursor-pointer">
						<span className="text-xs lg:text-sm font-normal text-black">
							Pick-up from
						</span>
						<span className="text-xs lg:text-sm font-normal text-black text-ellipsis">
							Giga Mall, Islamabad
						</span>
					</div>
				</div>
				<Link
					href="/"
					className="flex relative justify-center w-auto lg:w-full h-full lg:max-w-36 -order-1 ">
					<Image
						src="/logo.webp"
						alt="website-logo-showing-its-name"
						width={80}
						height={80}
						className="object-contain m-auto"
						sizes=""
						title="Burger Lab"
					/>
				</Link>
				<div className="flex flex-row flex-1 gap-1 sm:gap-3 items-center w-full h-full justify-end pl-2 pr-2">
					<hr className="h-10 ml-[4px] mr-[4px] opacity-5 text-black border-black border-solid border-[1px]" />
					<div className="flex items-center h-full">
						<SearchIcon width={26} height={26} />
					</div>
					<hr className="h-10 ml-[4px] mr-[4px] opacity-5 text-black border-black border-solid border-[1px]" />
					<div className="flex items-center h-full">
						<CircleUserIcon width={26} height={26} />
					</div>
					<hr className="inline-block h-10 ml-[4px] mr-[4px] opacity-5 text-black border-black border-solid border-[1px]" />
					<Cart />
				</div>
			</nav>
		</header>
	);
};

export default Header;

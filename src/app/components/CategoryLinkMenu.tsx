"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { categories } from "@/lib/constants";
import useSectionId from "@/hooks/useSectionId";
import { cn } from "@/lib/utils";

function CategoryLinkMenu() {
	const sectionId = useSectionId();

	const itemWidth = 150;

	const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

	const scrollHandler = (options: "Left" | "Right") => {
		if (scrollContainerRef.current)
			if (options === "Left")
				scrollContainerRef.current.scrollLeft -= itemWidth;
			else if (options === "Right")
				scrollContainerRef.current.scrollLeft += itemWidth;
	};

	return (
		<nav className="sticky top-20 bg-inherit bg-slate-100 border-b-2 border-b-slate-500 border-opacity-50 z-20 flex items-center h-20 w-full lg:max-w-[88%] overflow-hidden !focus-visible:outline-0">
			<div
				className="w-fit overflow-x-auto mx-8 lg:mx-10 pr:10 no-scrollbar scroll-smooth"
				ref={scrollContainerRef}>
				<ul className="flex-1 flex gap-3 items-center justify-center h-full">
					{categories.map((category) => (
						<li
							key={category.href}
							className={cn(
								"flex bg-gray-300 hover:bg-[#fabf2c] transition-colors items-center justify-center h-full rounded-2xl",
								sectionId === category.href.slice(1) && "bg-[#fabf2c]"
							)}>
							<Link href={category.href}>
								<p className="text-gray-700 hover:text-gray-900 px-6 py-2 text-center">
									{category.name}
								</p>
							</Link>
						</li>
					))}{" "}
				</ul>
			</div>
			<Button
				onClick={() => scrollHandler("Left")}
				className="absolute left-0 p-1 lg:p-2 z-10 rounded-3xl"
				variant="ghost">
				<ChevronLeft className="h-6 w-6 bg-transparent text-gray-500" />
				<span className="sr-only">Scroll back</span>
			</Button>
			<Button
				onClick={() => scrollHandler("Right")}
				className="absolute right-0 p-1 lg:p-2 z-10 rounded-3xl"
				variant="ghost">
				<ChevronRight className="h-6 w-6 bg-transparent text-gray-500" />
				<span className="sr-only">Scroll forward</span>
			</Button>
		</nav>
	);
}

export default CategoryLinkMenu;

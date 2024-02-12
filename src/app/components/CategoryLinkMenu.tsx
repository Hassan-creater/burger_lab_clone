"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { categories } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useObserverStore } from "@/store";

function CategoryLinkMenu() {
  const { activeSectionId, isBannerVisible } = useObserverStore();
  const [windowWidth, setWindowWidth] = useState<number>(0);

  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const activeLinkRef = React.useRef<HTMLLIElement | null>(null);

  const scrollHandler = (options: "Left" | "Right") => {
    if (scrollContainerRef.current)
      if (options === "Left") {
        scrollContainerRef.current.scrollLeft -= 150;
      } else if (options === "Right") {
        scrollContainerRef.current.scrollLeft += 150;
      }
  };

  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView();
    }
  }, [activeSectionId]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleWidowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWidowResize);

    return () => {
      window.removeEventListener("resize", handleWidowResize);
    };
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-20 bg-inherit z-20 flex items-center h-20 w-full lg:max-w-[88%] overflow-hidden !focus-visible:outline-0 transition-all duration-500",
        isBannerVisible
          ? "lg:h-max"
          : "lg:h-24 border-b-2 border-b-slate-500 border-opacity-50 bg-slate-100 "
      )}
    >
      {!isBannerVisible || windowWidth < 1024 ? (
        <>
          <div
            className={cn(
              "relative overflow-hidden flex items-center overflow-x-auto mx-8 lg:mx-10 no-scrollbar scroll-smooth transition-all"
            )}
            ref={scrollContainerRef}
          >
            <ul
              className={cn(
                "flex-1 flex gap-3 items-center justify-center h-full"
              )}
            >
              {categories.map((category, index) => (
                <li
                  key={category.href}
                  ref={
                    activeSectionId === category.href ||
                    (!activeSectionId && index === 0)
                      ? activeLinkRef
                      : undefined
                  }
                  className={cn(
                    "flex bg-gray-300 hover:bg-[#fabf2c] transition-colors items-center justify-center h-full rounded-2xl",
                    activeSectionId === category.href && "bg-[#fabf2c]",
                    !activeSectionId && index === 0 && "bg-[#fabf2c]"
                  )}
                >
                  <Link href={category.href}>
                    <p className="text-gray-700 hover:text-gray-900 font-bold px-6 py-2 text-center">
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
            variant="ghost"
          >
            <ChevronLeft className="h-6 w-6 bg-transparent text-gray-500" />
            <span className="sr-only">Scroll back</span>
          </Button>
          <Button
            onClick={() => scrollHandler("Right")}
            className="absolute right-0 p-1 lg:p-2 z-10 rounded-3xl"
            variant="ghost"
          >
            <ChevronRight className="h-6 w-6 bg-transparent text-gray-500" />
            <span className="sr-only">Scroll forward</span>
          </Button>
        </>
      ) : (
        <ul className="flex-1 my-10 flex w-[80%] px-10 flex-wrap gap-3 items-center justify-center h-full">
          {categories.map((category, index) => (
            <li
              key={category.href}
              ref={
                activeSectionId === category.href ||
                (!activeSectionId && index === 0)
                  ? activeLinkRef
                  : undefined
              }
              className={cn(
                "flex bg-slate-200 hover:bg-[#fabf2c] transition-colors items-center justify-center h-full rounded-3xl",
                activeSectionId === category.href && "bg-[#fabf2c]",
                !activeSectionId && index === 0 && "bg-[#fabf2c]"
              )}
            >
              <Link href={category.href}>
                <p className="text-gray-700 hover:text-gray-900 font-bold px-6 py-2 text-center">
                  {category.name}
                </p>
              </Link>
            </li>
          ))}{" "}
        </ul>
      )}
    </nav>
  );
}

export default CategoryLinkMenu;

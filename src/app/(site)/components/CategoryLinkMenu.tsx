"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useObserverStore } from "@/store/slices/observerSlice";
import { Category } from "@/models/Category";
import { useWindowSize } from "@/hooks/useWindowSize";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { designVar } from "@/designVar/desighVar";


function CategoryLinkMenu({ categories }: { categories: Category[] | null }) {
  const { isBannerVisible } = useObserverStore();

  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const activeLinkRef = React.useRef<HTMLLIElement | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

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

  console.log(categories)

  // const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeSubNavId, setActiveSubNavId] = useState<string | null>(null);

  const windowWidth = useWindowSize();
  const [activeSubItemId, setActiveSubItemId] = useState<string | null>(null);

  // fist category is active by default
  useEffect(() => {
    if (categories && categories.length > 0) {
      setActiveSectionId(categories[0].title);         // Sets first category as active
      setActiveSubNavId(categories[0].title);          // Opens its submenu
    }
  }, [categories]);

  return (
    <nav
      className={cn(
        "sticky top-10 bg-inherit z-20  flex items-center h-[12em] w-full lg:max-w-[92%] overflow-y-hidden  !focus-visible:outline-0 transition-all duration-500",
        isBannerVisible
          ? "lg:h-[10em]"
          : "lg:h-[10em] border-b-2 border-b-slate-500 border-opacity-50  "
      )}
    >
      {/* {!isBannerVisible || windowWidth < 1024 ? (
        // <>
        //   <div
        //     className={cn(
        //       "relative overflow-hidden  flex items-center overflow-x-auto mx-8 lg:mx-10 no-scrollbar scroll-smooth transition-all bg-red-500"
        //     )}
        //     ref={scrollContainerRef}
        //   >
        //     <ul
        //       className={cn(
        //         "flex-1 flex gap-3 items-center justify-center h-full"
        //       )}
        //     >
        //       {categories &&
        //         categories.map((category : any, index : number) => (
        //           <li
        //        key={category.title}
        //        ref={
        //          activeSectionId === category.title ||
        //          (!activeSectionId && index === 0)
        //            ? activeLinkRef
        //            : undefined
        //        }
        //        className={`
        //          ${designVar.categoryButton.borderRadius}
        //          ${designVar.categoryButton.paddingX}
        //          ${designVar.categoryButton.paddingY}
        //          ${designVar.categoryButton.fontSize}
        //          ${designVar.categoryButton.fontWeight}
        //          ${designVar.categoryButton.color}
        //          ${designVar.categoryButton.cursor}
        //          ${designVar.categoryButton.transition}
        //          ${designVar.categoryButton.hover.backgroundColor}
        //          ${designVar.categoryButton.hover.borderRadius}
        //          ${designVar.categoryButton.hover.color}
        //          ${designVar.fontFamily}
        //          ${
        //            activeSectionId
        //              ? activeSectionId === category.title
        //                ? designVar.categoryButton.activeBackgroundColor
        //                : designVar.categoryButton.inactiveBackgroundColor
        //              : index === 0
        //              ? designVar.categoryButton.activeBackgroundColor
        //              : designVar.categoryButton.inactiveBackgroundColor
        //          }
        //        `}
        //          >             
        //        <Link
        //          href={`#${category.title}`}
        //          onClick={() => setActiveSectionId(category.title)} // update the active section manually
        //        >
        //          <p className="font-bold text-center">
        //            {category.title}
        //          </p>
        //        </Link>
        //        </li>
        //         ))}{" "}
        //     </ul>
        //   </div>
        //   <Button
        //     onClick={() => scrollHandler("Left")}
        //     className="absolute left-0 p-1 lg:p-2 z-10 rounded-3xl"
        //     variant="ghost"
        //   >
        //     <ChevronLeft className="h-6 w-6 bg-transparent text-gray-500" />
        //     <span className="sr-only">Scroll back</span>
        //   </Button>
        //   <Button
        //     onClick={() => scrollHandler("Right")}
        //     className="absolute right-0 p-1 lg:p-2 z-10 rounded-3xl"
        //     variant="ghost"
        //   >
        //     <ChevronRight className="h-6 w-6 bg-transparent text-gray-500" />
        //     <span className="sr-only">Scroll forward</span>
        //   </Button>
        // </>
        <>
        
        </>
      ) : (
        
      )} */}

<div className="w-full h-[6em]">
  {/* Category Tabs */}
  <div className="relative">
    <ul className="flex justify-center items-center gap-6 bg-[#F8F9FA] pt-6 text-[0.8em] sm:text-[1em]">
      {categories?.map((category) => {
        const isActive = activeSectionId === category.title;

        return (
          <li key={category.id} className="relative">
            {/* Category Button */}
            <button
              onClick={() => {
                setActiveSectionId(category.title);
                setActiveSubNavId((prev) =>
                  prev === category.title ? null : category.title
                );
              }}
              className={`
                px-5 py-2 font-bold transition-all 
                ${isActive
                  ? "bg-[#FCD980] text-black rounded-t-xl"
                  : "text-black   hover:text-[#8B4513]"
                }
              `}
            >
              {category.title}
            </button>
          </li>
        );
      })}
    </ul>

    {/* Subbar */}
    {activeSubNavId && (
      <div className="absolute  top-full left-0 right-0 w-full bg-[#FCD980] z-10 shadow-md">
        <div className="w-full overflow-x-auto no-scrollbar">
          <ul className="flex w-max flex-nowrap items-center justify-center gap-4 py-4 px-6 text-[0.8em] sm:text-[1em]">
            {categories
              ?.find((cat: any) => cat.title === activeSubNavId)
              ?.items?.map((item, index) => (
                <li key={item.id} className="min-w-[100px]">
                  <button
                   onClick={() => {
                    setActiveSubItemId(item.id); // ✅ Track which subitem is active
                    const el = document.getElementById(item.id);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                    className={`text-black py-[0.4em] px-[1em] rounded-md text-sm font-semibold transition
                      ${activeSubItemId === item.id  ? "bg-black text-white" : "hover:bg-[#5a5a5a] hover:text-white"}
                    `}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    )}
  </div>
</div>
    </nav>
  );
}

export default CategoryLinkMenu;

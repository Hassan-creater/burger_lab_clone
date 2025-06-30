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
import { useCartContext } from "@/context/context";


function CategoryLinkMenu({ categories }: { categories: Category[] | null }) {
  const { isBannerVisible, activeSectionId, setActiveSectionId } = useObserverStore();
  const {deliveryClose, dineInClose, pickupClose} = useCartContext()

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

  // const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeSubNavId, setActiveSubNavId] = useState<string | null>(null);

  const windowWidth = useWindowSize();
  const [activeSubItemId, setActiveSubItemId] = useState<string | null>(null);

  // fist category is active by default only if no activeSectionId is set
  useEffect(() => {
    if (categories && categories.length > 0 && !activeSectionId) {
      setActiveSectionId(categories[0].title);         // Sets first category as active only if none is set
      setActiveSubNavId(categories[0].title);          // Opens its submenu
    }
  }, [categories, activeSectionId, setActiveSectionId]);

  return (
    <nav
      className={cn(
        "sticky top-[5em]   bg-inherit z-20 mt-[4em] bg-[#F8F9FA]  flex items-center h-[4em] w-full lg:max-w-[92%] overflow-y-hidden  !focus-visible:outline-0 transition-all duration-500",
        `${deliveryClose || dineInClose || pickupClose ? "pt-[1em] " : "pt-[0em]"}`
      )}
    >
       

           <div
            className={cn(
              "relative w-full overflow-hidden  flex items-center overflow-x-auto  no-scrollbar scroll-smooth transition-all"
            )}
            ref={scrollContainerRef}
          >
            <ul
              className={cn(
                "flex-1 flex gap-3 items-center justify-center"
              )}
            >
              {categories &&
                categories.map((category : any, index : number) => (
                  <li
                  key={category.title}
                  ref={
                    activeSectionId === category.title ||
                    (!activeSectionId && index === 0)
                      ? activeLinkRef
                      : undefined
                  }
                  className={cn(
                    
                    designVar.categoryButton.borderRadius,
                    designVar.categoryButton.paddingX,
                    designVar.categoryButton.paddingY,
                    designVar.categoryButton.fontSize,
                    designVar.categoryButton.fontWeight,
                    designVar.categoryButton.color,
                    designVar.categoryButton.cursor,
                    designVar.categoryButton.transition,
                    designVar.categoryButton.hover.backgroundColor,
                    designVar.categoryButton.hover.borderRadius,
                    designVar.categoryButton.hover.color,
                    designVar.fontFamily,
                    activeSectionId
                      ? activeSectionId === category.title
                        ? designVar.categoryButton.activeBackgroundColor
                        : designVar.categoryButton.inactiveBackgroundColor
                      : index === 0
                      ? designVar.categoryButton.activeBackgroundColor
                      : designVar.categoryButton.inactiveBackgroundColor
                  )}
                    >           
                  <button
  onClick={(e) => {
    e.preventDefault();
    setActiveSectionId(category.title); // set state first

    // Scroll after small delay to allow re-render/layout
    setTimeout(() => {
      const target = document.getElementById(category.title);
      if (target) {
        const yOffset = -143; // scroll 130px above the element
        const y =
          target.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 50); // delay just enough to allow layout to complete
  }}
>
  <p className="text-center">{category.title}</p>
</button>
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


    </nav>
  );
}

export default CategoryLinkMenu;

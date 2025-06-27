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

  const Categories = async ()=>{
    const res = await apiClient.get("/category/view/customer");

    return res.data
  }

  const {data}= useQuery({
    queryKey : ['categories'],
    queryFn : Categories
  })

  const CatData = data?.data?.categories;



  const windowWidth = useWindowSize();

  return (
    <nav
      className={cn(
        "sticky top-20 bg-inherit z-20  flex items-center h-[4.5rem] w-full lg:max-w-[88%] overflow-hidden !focus-visible:outline-0 transition-all duration-500",
        isBannerVisible
          ? "lg:h-max"
          : "lg:h-20 border-b-2 border-b-slate-500 border-opacity-50 bg-slate-100 "
      )}
    >
      {!isBannerVisible || windowWidth < 1024 ? (
        <>
          <div
            className={cn(
              "relative overflow-hidden  flex items-center overflow-x-auto mx-8 lg:mx-10 no-scrollbar scroll-smooth transition-all"
            )}
            ref={scrollContainerRef}
          >
            <ul
              className={cn(
                "flex-1 flex gap-3 items-center justify-center h-full"
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
               className={`
                 ${designVar.categoryButton.borderRadius}
                 ${designVar.categoryButton.paddingX}
                 ${designVar.categoryButton.paddingY}
                 ${designVar.categoryButton.fontSize}
                 ${designVar.categoryButton.fontWeight}
                 ${designVar.categoryButton.color}
                 ${designVar.categoryButton.cursor}
                 ${designVar.categoryButton.transition}
                 ${designVar.categoryButton.hover.backgroundColor}
                 ${designVar.categoryButton.hover.borderRadius}
                 ${designVar.categoryButton.hover.color}
                 ${designVar.fontFamily}
                 ${
                   activeSectionId
                     ? activeSectionId === category.title
                       ? designVar.categoryButton.activeBackgroundColor
                       : designVar.categoryButton.inactiveBackgroundColor
                     : index === 0
                     ? designVar.categoryButton.activeBackgroundColor
                     : designVar.categoryButton.inactiveBackgroundColor
                 }
               `}
                 >             
               <Link
                 href={`#${category.title}`}
                 onClick={() => setActiveSectionId(category.title)} // update the active section manually
               >
                 <p className="font-bold text-center">
                   {category.title}
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
             className={`
               ${designVar.categoryButton.borderRadius}
               ${designVar.categoryButton.paddingX}
               ${designVar.categoryButton.paddingY}
               ${designVar.categoryButton.fontSize}
               ${designVar.categoryButton.fontWeight}
               ${designVar.categoryButton.color}
               ${designVar.categoryButton.cursor}
               ${designVar.categoryButton.transition}
               ${designVar.categoryButton.hover.backgroundColor}
               ${designVar.categoryButton.hover.borderRadius}
               ${designVar.categoryButton.hover.color}
               ${designVar.fontFamily}
               ${
                 activeSectionId
                   ? activeSectionId === category.title
                     ? designVar.categoryButton.activeBackgroundColor
                     : designVar.categoryButton.inactiveBackgroundColor
                   : index === 0
                   ? designVar.categoryButton.activeBackgroundColor
                   : designVar.categoryButton.inactiveBackgroundColor
               }
             `}
               >           
             <Link
               href={`#${category.title}`}
               onClick={() => setActiveSectionId(category.title)} // update the active section manually
             >
               <p className="font-bold text-center">
                 {category.title}
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

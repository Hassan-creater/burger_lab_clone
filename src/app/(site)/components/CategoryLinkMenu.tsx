'use client';

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useObserverStore } from "@/store/slices/observerSlice";
import { Category } from "@/models/Category";
import { useWindowSize } from "@/hooks/useWindowSize";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { designVar } from "@/designVar/desighVar";
import { useCartContext } from "@/context/context";

function CategoryLinkMenu({ categories  }: { categories: Category[] | null  }) {
  const { isBannerVisible, activeSectionId, setActiveSectionId } = useObserverStore();
  const {deliveryClose, dineInClose, pickupClose , deals } = useCartContext();

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLinkRef = useRef<HTMLLIElement | null>(null);
  const [isUserClick, setIsUserClick] = useState(false);
  const [ignoreScrollSpyUntil, setIgnoreScrollSpyUntil] = useState(0);
  const [manualDealsActive, setManualDealsActive] = useState(false);

  const scrollHandler = (options: "Left" | "Right") => {
    if (scrollContainerRef.current) {
      if (options === "Left") {
        scrollContainerRef.current.scrollLeft -= 150;
      } else if (options === "Right") {
        scrollContainerRef.current.scrollLeft += 150;
      }
    }
  };

  // Improved scrollspy logic
  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const scrollOffset = 400;
    let debounceTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (!categories || categories.length === 0) return;
      if (Date.now() < ignoreScrollSpyUntil) return;
      
      // Check if page is at the top (scrollY is 0 or very close to it)
      if (window.scrollY < 50 && deals.length > 0) {
        if (activeSectionId !== "deals") {
          setActiveSectionId("deals");
        }
        return;
      }

      // Check deals section first
      const dealsSection = document.getElementById("deals");
      if (dealsSection && deals.length > 0) {
        const dealsRect = dealsSection.getBoundingClientRect();
        // If deals section is in view, highlight it
        if (dealsRect.top <= scrollOffset && dealsRect.bottom >= 100) {
          if (activeSectionId !== "deals") {
            setActiveSectionId("deals");
          }
          return;
        }
      }

      // Find which category section is currently in view
      let activeCategory = null;
      let minDistance = Number.POSITIVE_INFINITY;

      for (let i = 0; i < categories.length; i++) {
        const section = document.getElementById(categories[i].title);
        if (section) {
          const rect = section.getBoundingClientRect();
          
          // Check if section is in view
          const isInView = rect.top <= scrollOffset && rect.bottom >= 100;
          const distanceFromTop = Math.abs(rect.top - scrollOffset);
          
          if (isInView && distanceFromTop < minDistance) {
            minDistance = distanceFromTop;
            activeCategory = categories[i].title;
          }
        }
      }

      // If no category is in view, find the closest one or default to deals
      if (!activeCategory) {
        // Check if we're closer to the top of the page than to any category
        const isNearTop = window.scrollY < 200;
        
        if (isNearTop && deals.length > 0) {
          // If near top and deals exist, highlight deals
          activeCategory = "deals";
        } else {
          // Otherwise find the closest category
          for (let i = 0; i < categories.length; i++) {
            const section = document.getElementById(categories[i].title);
            if (section) {
              const rect = section.getBoundingClientRect();
              const distance = Math.abs(rect.top - scrollOffset);
              
              if (distance < minDistance) {
                minDistance = distance;
                activeCategory = categories[i].title;
              }
            }
          }
          
          // If still no active category and deals exist, default to deals
          if (!activeCategory && deals.length > 0) {
            activeCategory = "deals";
          }
        }
      }

      // Update active section if changed
      if (activeCategory && activeCategory !== activeSectionId) {
        setActiveSectionId(activeCategory);
      }
    };

    const debouncedScroll = () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(handleScroll, 60);
    };

    window.addEventListener("scroll", debouncedScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [categories, setActiveSectionId, activeSectionId, ignoreScrollSpyUntil, deals.length]);

  // Scroll active link into view when category changes
  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({
        block: "nearest",
        inline: "center"
      });
    }
  }, [activeSectionId]);

  const [activeSubNavId, setActiveSubNavId] = useState<string | null>(null);

  // Initialize active section
  useEffect(() => {
    if (categories && categories.length > 0 && !activeSectionId) {
      const dealsSection = document.getElementById("deals");
      if (dealsSection && deals.length > 0) {
        setActiveSectionId("deals");
      } else {
        setActiveSectionId(categories[0].title);
      }
      setActiveSubNavId(categories[0].title);
    }
  }, [categories, activeSectionId, setActiveSectionId, deals.length]);

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    setIsUserClick(true);
    setIgnoreScrollSpyUntil(Date.now() + 1000);
    setManualDealsActive(categoryId === "deals");
    setActiveSectionId(categoryId);

    setTimeout(() => {
      const target = document.getElementById(categoryId);
      if (target) {
        const yOffset = -150;
        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <nav
      className={cn(
        "sticky top-[5em] bg-inherit z-20 mt-[1.5em] px-[2em] sm:mt-[1.5em] bg-[#F8F9FA] flex items-center h-[4.8em] w-full lg:max-w-[92%] overflow-y-hidden !focus-visible:outline-0 transition-all duration-300",
        `${deliveryClose || dineInClose || pickupClose ? "pt-[1em] " : "pt-[0em]"}`
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden flex items-center overflow-x-auto no-scrollbar scroll-smooth transition-all"
        )}
        ref={scrollContainerRef}
      >
        <ul
          className={cn(
            "flex-1 flex gap-3 items-center justify-center"
          )}
        >
          {deals.length > 0 && (
            <li
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
                (activeSectionId === "deals" || manualDealsActive)
                  ? designVar.categoryButton.activeBackgroundColor
                  : designVar.categoryButton.inactiveBackgroundColor
              )}
            >
              <button
                onClick={() => handleCategoryClick("deals")}
              >
                <p className="text-center">Deals</p>
              </button>
            </li>
          )}
          {categories &&
            categories.map((category : any, index : number) => (
              <li
                key={category.title}
                ref={activeSectionId === category.title ? activeLinkRef : undefined}
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
                  activeSectionId === category.title
                    ? designVar.categoryButton.activeBackgroundColor
                    : designVar.categoryButton.inactiveBackgroundColor
                )}
              >
                <button
                  onClick={() => handleCategoryClick(category.title)}
                >
                  <p className="text-center">{category.title}</p>
                </button>
              </li>
            ))}
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
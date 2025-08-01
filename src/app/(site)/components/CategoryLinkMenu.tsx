"use client";

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
  const {deliveryClose, dineInClose, pickupClose , deals } = useCartContext()
 
  
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLinkRef = useRef<HTMLLIElement | null>(null);
  const [isUserClick, setIsUserClick] = useState(false);
  const [ignoreScrollSpyUntil, setIgnoreScrollSpyUntil] = useState(0);
  const [manualDealsActive, setManualDealsActive] = useState(false);


  const scrollHandler = (options: "Left" | "Right") => {
    if (scrollContainerRef.current)
      if (options === "Left") {
        scrollContainerRef.current.scrollLeft -= 150;
      } else if (options === "Right") {
        scrollContainerRef.current.scrollLeft += 150;
      }
  };

  // --- Debounced, smooth Scrollspy logic start ---
  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const scrollOffset = 400; // or your preferred offset
    let debounceTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (!categories || categories.length === 0) return;
      // Always use deals section visibility logic to determine highlight

      // If manualDealsActive is true, lock deals as active until deals section is present and in view
      if (manualDealsActive) {
        const dealsSection = document.getElementById("deals");
        if (dealsSection) {
          const rect = dealsSection.getBoundingClientRect();
          // If deals section is at/near top, release manual lock
          if (Math.abs(rect.top - scrollOffset) < 10) {
            setManualDealsActive(false);
          } else {
            if (activeSectionId !== "deals") {
              setActiveSectionId("deals");
            }
            return;
          }
        } else {
          // If deals section not present, keep deals active
          if (activeSectionId !== "deals") {
            setActiveSectionId("deals");
          }
          return;
        }
      }
      // If deals section exists, use its position to determine highlight
      const dealsSection = document.getElementById("deals");
      if (dealsSection) {
        const rect = dealsSection.getBoundingClientRect();
        // Only highlight deal link if its bottom is at least 30px below the top of the viewport
        if (rect.bottom > 170) {
          if (activeSectionId !== "deals") {
            setActiveSectionId("deals");
          }
          return;
        }
        // If deals section is fully out of view, use scrollspy logic for categories
        if (rect.bottom <= 0) {
          let closestSection = categories[0].title;
          let minDistance = Number.POSITIVE_INFINITY;
          for (let i = 0; i < categories.length; i++) {
            const section = document.getElementById(categories[i].title);
            if (section) {
              const catRect = section.getBoundingClientRect();
              // Use offset 0 for first category, original scrollOffset for others
              const offset = i === 0 ? 0 : scrollOffset;
              const distance = Math.abs(catRect.top - offset);
              if (catRect.top - offset <= 0 && distance < minDistance) {
                minDistance = distance;
                closestSection = categories[i].title;
              }
            }
          }
          // If no section is above the offset, pick the first section below the offset
          if (minDistance === Number.POSITIVE_INFINITY) {
            for (let i = 0; i < categories.length; i++) {
              const section = document.getElementById(categories[i].title);
              if (section) {
                const catRect = section.getBoundingClientRect();
                if (catRect.top - scrollOffset > 0) {
                  closestSection = categories[i].title;
                  break;
                }
              }
            }
          }
          if (closestSection !== activeSectionId) {
            setActiveSectionId(closestSection);
          }
          return;
        }
      }
      const dealsSectionExists = !!document.getElementById("deals");
      if (manualDealsActive && !dealsSectionExists) {
        // If manually set to deals and section is not present, always force highlight and prevent scrollspy from updating
        if (activeSectionId !== "deals") {
          setActiveSectionId("deals");
          console.log("[ScrollSpy] Forcing Deals highlight due to manualDealsActive");
        }
        return;
      }
      if (!dealsSectionExists && activeSectionId === "deals") {
        // If deals section is not present and deals is active, do not change highlight
        return;
      }
      if (Date.now() < ignoreScrollSpyUntil) return;

      let closestSection = categories[0].title;
      let minDistance = Number.POSITIVE_INFINITY;

      for (let i = 0; i < categories.length; i++) {
        const section = document.getElementById(categories[i].title);
        if (section) {
          const rect = section.getBoundingClientRect();
          const distance = Math.abs(rect.top - scrollOffset);
          if (rect.top - scrollOffset <= 0 && distance < minDistance) {
            minDistance = distance;
            closestSection = categories[i].title;
          }
        }
      }

      // If no section is above the offset, pick the first section below the offset
      if (minDistance === Number.POSITIVE_INFINITY) {
        for (let i = 0; i < categories.length; i++) {
          const section = document.getElementById(categories[i].title);
          if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top - scrollOffset > 0) {
              closestSection = categories[i].title;
              break;
            }
          }
        }
        // Fallback: if still no section in view, highlight deals if it exists, else first category
        const dealsSection = document.getElementById("deals");
        if (dealsSection) {
          if (activeSectionId !== "deals") {
            setActiveSectionId("deals");
          }
          return;
        } else {
          if (activeSectionId !== categories[0].title) {
            setActiveSectionId(categories[0].title);
          }
          return;
        }
      }

      if (closestSection !== activeSectionId) {
        setActiveSectionId(closestSection);
      }
    };

    const debouncedScroll = () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(handleScroll, 60); // 60ms debounce
    };

    window.addEventListener("scroll", debouncedScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [categories, setActiveSectionId, activeSectionId, ignoreScrollSpyUntil, manualDealsActive]);
  // --- Debounced, smooth Scrollspy logic end ---

  // Only scroll active link into view if the user clicked a category
  useEffect(() => {
    if (isUserClick && activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView();
    }
  }, [activeSectionId, isUserClick]);

  // const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeSubNavId, setActiveSubNavId] = useState<string | null>(null);

  const windowWidth = useWindowSize();
 

  // On mount, deals is active by default if it exists, else first category
  useEffect(() => {
    if (categories && categories.length > 0 && !activeSectionId) {
      const dealsSection = document.getElementById("deals");
      if (dealsSection) {
        setActiveSectionId("deals");
        setManualDealsActive(false);
      } else {
        setActiveSectionId(categories[0].title);
        setManualDealsActive(false);
      }
      setActiveSubNavId(categories[0].title);
    }
  }, [categories, activeSectionId, setActiveSectionId]);

  // Scroll to section only if triggered by user click
  useEffect(() => {
    if (isUserClick && activeSectionId) {
      setIsUserClick(false); // Reset immediately to avoid repeated scrolls
      setTimeout(() => {
        const target = document.getElementById(activeSectionId);
        if (target) {
          const yOffset = -170; // 150px below the top
          const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 50);
    }
  }, [activeSectionId, isUserClick]);

  // Reset manualDealsActive if deals section appears
  useEffect(() => {
    const dealsSectionExists = !!document.getElementById("deals");
    if (dealsSectionExists && manualDealsActive) {
      setManualDealsActive(false);
    }
  }, [manualDealsActive]);

  // Trigger scrollspy when deals section appears (for async fetch)
  useEffect(() => {
    const dealsSection = document.getElementById("deals");
    if (dealsSection) {
      window.dispatchEvent(new Event("scroll"));
    }
  }, [deals && deals.length]);

  return (
    <nav
      className={cn(
        "sticky top-[5em]   bg-inherit z-20 mt-[1.5em] px-[2em] sm:mt-[4em] bg-[#F8F9FA]  flex items-center h-[4em] w-full lg:max-w-[92%] overflow-y-hidden  !focus-visible:outline-0 transition-all duration-300",
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
              {
                deals.length > 0 && (

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
    onClick={e => {
      e.preventDefault();
      setIsUserClick(true);
      setIgnoreScrollSpyUntil(Date.now() + 600); // Give scrollspy more time to ignore
      setManualDealsActive(true); // Mark deals as manually activated
      setActiveSectionId("deals"); // Immediately set deals as active
      // Scroll to deals section if it exists
      setTimeout(() => {
        const dealsSection = document.getElementById("deals");
        if (dealsSection) {
          const yOffset = -170;
          const y = dealsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 50);
    }}
  >
    <p className="text-center">Deals</p>
  </button>
</li>
                )
              }
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
    setIsUserClick(true);
    setIgnoreScrollSpyUntil(Date.now() + 400);
    setManualDealsActive(false);
    setActiveSectionId(category.title); // set state first
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

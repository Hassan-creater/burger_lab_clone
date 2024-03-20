"use client";

import { useEffect, useRef } from "react";
import ProductCard from "../../../components/ProductCard";
import { menuItems } from "@/lib/constants";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useObserverStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getItemsByCategory, getItemsByTag } from "@/functions";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { Item } from "@/models/Item";
import { Favorite } from "@/models/Favorites";

interface CategorySectionProps {
  name: string;
  href: string;
  id: number;
  query?: string;
  favorites: Favorite[] | null;
}

function CategorySection({
  name,
  href,
  id,
  query,
  favorites,
}: CategorySectionProps) {
  const { data, status, fetchStatus } = useQuery({
    queryKey: !query ? ["menuItems", id] : ["search", query],
    queryFn: async () =>
      !query ? await getItemsByCategory(id) : await getItemsByTag(query),
    refetchOnWindowFocus: false,
  });

  const { setActiveSectionId, isBannerVisible } = useObserverStore();
  const sectionRef = useRef<HTMLElement | null>(null);

  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.8 });
  useEffect(() => {
    const handleScroll = () => {
      if (isBannerVisible) {
        setActiveSectionId(undefined);
      }
    };

    if (isVisible) setActiveSectionId(href.slice(1));

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setActiveSectionId, href, isVisible, isBannerVisible]);

  const renderProducts = (item: Item, index: number) => {
    if (status === "pending" || fetchStatus === "fetching") {
      return (
        <LoadingSpinner
          className="w-40 min-[500px]:w-52 min-h-[400px]"
          key={index}
        />
      );
    }

    if (status === "success") {
      if (data?.items) {
        if (
          typeof data?.items === "object" && Array.isArray(data?.items)
            ? data?.items?.length > 0
            : data?.items[name]?.length > 0
        ) {
          return (
            <ProductCard key={index} product={item} favorites={favorites} />
          );
        }
      }
    }

    return null;
  };

  if (typeof data?.items === "object") {
    if (Array.isArray(data.items)) {
      return (
        <>
          {data.items.length > 0 && (
            <section
              id={href.slice(1)}
              ref={sectionRef}
              className="flex flex-col gap-4 h-full w-[95%] lg:max-w-[85%]"
            >
              <h3 className="text-2xl font-bold">{name}</h3>
              <div className="flex flex-wrap items-center justify-start gap-5">
                {data?.items?.map((item, index) => renderProducts(item, index))}
              </div>
              <hr className="self-center bg-categorySeparatorGradient w-full h-px mt-5 mb-3 block" />
            </section>
          )}
        </>
      );
    }

    if (data.items && data.items[name].length > 0) {
      return (
        <section
          id={href.slice(1)}
          ref={sectionRef}
          className="flex flex-col gap-4 h-full w-[95%] lg:max-w-[85%]"
        >
          <h3 className="text-2xl font-bold">{name}</h3>

          <div className="flex flex-wrap items-center justify-start gap-5">
            {data?.items[name]?.map((item, index) =>
              renderProducts(item, index)
            )}
          </div>
          <hr className="self-center bg-categorySeparatorGradient w-full h-px mt-5 mb-3 block" />
        </section>
      );
    }
  }
}

export default CategorySection;

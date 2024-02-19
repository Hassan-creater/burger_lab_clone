"use client";

import React, { useEffect, useRef } from "react";
import ProductCard from "../../components/ProductCard";
import { menuItems } from "@/lib/constants";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useObserverStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getItemsByCategory } from "@/functions";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { Item } from "@/models/Item";

interface CategorySectionProps {
  name: string;
  href: string;
  id: number;
}

function CategorySection({ name, href, id }: CategorySectionProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["menuItems", id],
    queryFn: async () => await getItemsByCategory(id),
  });

  const { setActiveSectionId, activeSectionId } = useObserverStore();
  const sectionRef = useRef<HTMLElement | null>(null);

  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.8 });
  // console.log(!isLoading && data?.items);
  useEffect(() => {
    // TODO: Check why activeSection is not changing consistently
    // console.log(activeSectionId, href.slice(1));

    if (isVisible) setActiveSectionId(href.slice(1));
  }, [setActiveSectionId, href, isVisible]);

  if ((data?.status !== 200 || !data.items) && !isLoading) {
    toast.error("Could not fetch items. Try again later!", {
      style: { backgroundColor: "red", color: "white" },
      closeButton: true,
      dismissible: true,
    });
    return null;
  }

  const renderProducts = (item: Item, index: number) => {
    if (isLoading) {
      return (
        <LoadingSpinner
          className="w-40 min-[500px]:w-52 min-h-[400px]"
          key={index}
        />
      );
    }

    if (!isLoading && data?.items && data.items.length > 0) {
      return <ProductCard key={index} product={item} />;
    }

    return (
      <div
        className="w-full h-auto flex items-center justify-center"
        key={index}
      >
        No items found
      </div>
    );
  };

  return (
    <section
      id={href.slice(1)}
      ref={sectionRef}
      className="flex flex-col gap-4 h-full w-[95%] lg:max-w-[85%]"
    >
      <hr className="self-center bg-categorySeparatorGradient w-full h-px mt-5 mb-3 block" />
      <h3 className="text-2xl font-bold">{name}</h3>
      <div className="flex flex-wrap items-center justify-start gap-5">
        {data?.items?.map((item, index) => renderProducts(item, index))}
      </div>
    </section>
  );
}

export default CategorySection;

"use client";

import { useRef } from "react";
import ProductCard from "../../../components/ProductCard";
import { Item } from "@/models/Item";
import { Favorite } from "@/models/Favorites";
import { dummyItems } from "@/lib/dummyData";

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
  // Using dummy data instead
  const filteredItems = !query
    ? dummyItems.filter((item) => item.category_id === id)
    : dummyItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          (item.description?.toLowerCase() || "").includes(query.toLowerCase())
      );

  const renderProducts = (item: Item, index: number) => {
    return <ProductCard key={index} product={item} favorites={favorites} />;
  };

  return (
    <>
      {filteredItems.length > 0 && (
        <section
          id={href.slice(1)}
          className="flex flex-col gap-4 h-full w-[95%] lg:max-w-[85%]"
        >
          <h3 className="text-2xl font-bold">{name}</h3>
          <div className="flex flex-wrap items-center justify-start gap-5">
            {filteredItems.map((item, index) => renderProducts(item, index))}
          </div>
          <hr className="self-center bg-categorySeparatorGradient w-full h-px mt-5 mb-3 block" />
        </section>
      )}
    </>
  );
}

export default CategorySection;

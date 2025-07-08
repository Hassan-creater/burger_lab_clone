"use client";

import ProductCard from "../../../components/ProductCard";
import { Item } from "@/models/Item";
import { Favorite } from "@/models/Favorites";
import { designVar } from "@/designVar/desighVar";

interface CategorySectionProps {
  name: string;
  href: string;
  id: number;
  query?: string;
  favorites: Favorite[] | null;
  allItems: any[];
}

function CategorySection({
  name,
  href,
  id,
  favorites,
  allItems
}: CategorySectionProps) {
  // Get items for this category (filtering is now handled centrally)
  const categoryItems = allItems.filter((item: any) => item.categoryId === id);
  
  const renderProducts = (item: Item, index: number) => {
    return (
      <div key={item.id} id={item.id} className="scroll-mt-28">
        <ProductCard product={item} favorites={favorites} />
      </div>
    );
  };

  return (
    <>
      {categoryItems?.length > 0 && (
        <section
          id={href.slice(1)}
          className="flex flex-col gap-2 h-full w-[95%] lg:max-w-[92%]"
        >
          <h3 className={`${designVar.categoryHeading.fontSize} ${designVar.categoryHeading.fontWeight} ${designVar.categoryHeading.color} ${designVar.fontFamily} py-[0.2em] border-b-[1px] border-b-slate-500`}>
            {name}
          </h3>
          <div className="w-[100%] flex flex-wrap items-center justify-start gap-4">
            {categoryItems?.map((item: any, index: number) => renderProducts(item, index))}
          </div>
          <br/>
        </section>
      )}

      
    </>   
  );
}

export default CategorySection;

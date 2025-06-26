"use client";


import ProductCard from "../../../components/ProductCard";
import { Item } from "@/models/Item";
import { Favorite } from "@/models/Favorites";



interface CategorySectionProps {
  name: string;
  href: string;
  id: number;
  query?: string;
  favorites: Favorite[] | null;
  allItems : any[];
}

function CategorySection({
  name,
  href,
  id,
  query,
  favorites,
  allItems
}: CategorySectionProps) {

/// filter items by tags and name


function filterItems(allItems: any[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return allItems;

  return allItems.filter((item: any) => {
    if (!item.tags) return false;
    return item.tags
      .split(',')
      .map((t: string) => t.trim().toLowerCase())
      .some((t: string) => t.includes(q));
  });
}



  const filteredItems =filterItems(allItems.filter((item :any) => item.categoryId == id), query || "") || [];
  
  

 


     


  const renderProducts = (item: Item, index: number) => {
    return <ProductCard key={index} product={item} favorites={favorites} />;
  };


  return (
    <>
      {filteredItems?.length > 0 && (
        <section
          id={href.slice(1)}
          className="flex flex-col  gap-4 h-full w-[95%] lg:max-w-[85%]"
        >
          <h3 className="text-2xl font-bold">{name}</h3>
          <div className="flex flex-wrap items-center justify-start gap-5">
            {filteredItems?.map((item : any, index : number) => renderProducts(item, index))}
          </div>
          <hr className="self-center bg-categorySeparatorGradient w-full h-px mt-5 mb-3 block" />
        </section>
      ) }
    </>
  );
}

export default CategorySection;

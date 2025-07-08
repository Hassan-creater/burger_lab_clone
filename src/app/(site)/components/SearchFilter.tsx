"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBox from "./SearchBox";
import CategorySection from "./CategorySection";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useCartContext } from "@/context/context";
import DealSection from "./DealSection";

type SearchFilterProps = {
  categories: any[];
  favorites: any[];
  allItems: any[];
};

export default function SearchFilter({ categories, favorites, allItems }: SearchFilterProps) {
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("query") || "";
  const [filteredItems, setFilteredItems] = useState(allItems);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { deals } = useCartContext();
  const [filteredDeals, setFilteredDeals] = useState(deals);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!currentQuery.trim()) {
      setFilteredItems(allItems);
      setFilteredDeals(deals);
      return;
    }

    const query = currentQuery.toLowerCase().trim();
    // Filter items based on tags and name
    const filtered = allItems.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(query);
      const tagsMatch = item.tags?.toLowerCase().includes(query);
      const individualTagsMatch = item.tags?.split(',').some((tag: string) => 
        tag.trim().toLowerCase().includes(query)
      );
      return nameMatch || tagsMatch || individualTagsMatch;
    });
    setFilteredItems(filtered);

    // Filter deals
    const filteredD = deals.filter((deal: any) => {
      const nameMatch = deal.name?.toLowerCase().includes(query);
      const tagsMatch = deal.tags?.toLowerCase().includes(query);
      const individualTagsMatch = deal.tags?.split(',').some((tag: string) => 
        tag.trim().toLowerCase().includes(query)
      );
      return nameMatch || tagsMatch || individualTagsMatch;
    });
    setFilteredDeals(filteredD);
  }, [currentQuery, allItems, deals]);

  // Group filtered items by category
  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter((item: any) => 
      filteredItems.some((filteredItem: any) => filteredItem.id === item.id)
    )
  })).filter(category => category.items.length > 0);

  if (!mounted) return null;

  return (
    <>
      <div className="w-full px-[0.5em] justify-center items-center flex">
        <SearchBox
          onSearchStart={() => {
            setIsSearching(true);
            setHasSearched(true);
          }}
          onSearchEnd={() => setIsSearching(false)}
        />
      </div>
      {isSearching ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner className="w-8 h-8 border-t-primaryOrange" />
        </div>
      ) : currentQuery.trim() || hasSearched ? (
        <>
          {filteredDeals && filteredDeals.length > 0 && (
            <DealSection deals={filteredDeals} />
          )}
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category: any, index: number) => (
              <CategorySection
                key={`filtered-${category.id}-${index}`}
                name={category.title}
                href={`#${category.title}`}
                id={category.id}
                query={currentQuery}
                favorites={favorites}
                allItems={filteredItems}
              />
            ))
          ) : (
            !(filteredDeals && filteredDeals.length > 0) && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No items found
                </h3>
                <p className="text-gray-500">
                  Try searching with different keywords or check the spelling
                </p>
              </div>
            )
          )}
        </>
      ) : (
        <>
          <DealSection />
          {categories.map((category: any, index: number) => (
            <CategorySection
              key={index}
              name={category.title}
              href={`#${category.title}`}
              id={category.id}
              query=""
              favorites={favorites}
              allItems={allItems}
            />
          ))}
        </>
      )}
    </>
  );
} 
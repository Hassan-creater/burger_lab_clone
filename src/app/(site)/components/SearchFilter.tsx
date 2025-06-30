"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBox from "./SearchBox";
import CategorySection from "./CategorySection";
import LoadingSpinner from "@/components/LoadingSpinner";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!currentQuery.trim()) {
      // If no query, show all items
      setFilteredItems(allItems);
      return;
    }

    const query = currentQuery.toLowerCase().trim();
    
    // Filter items based on tags and name
    const filtered = allItems.filter((item) => {
      // Check if query matches item name (case-insensitive)
      const nameMatch = item.name?.toLowerCase().includes(query);
      
      // Check if query matches any tag (case-insensitive)
      const tagsMatch = item.tags?.toLowerCase().includes(query);
      
      // Check if query matches any individual tag (split by comma)
      const individualTagsMatch = item.tags?.split(',').some((tag: string) => 
        tag.trim().toLowerCase().includes(query)
      );
      
      return nameMatch || tagsMatch || individualTagsMatch;
    });

    setFilteredItems(filtered);
  
  }, [currentQuery, allItems]);

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
        filteredCategories.length > 0 ? (
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
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No items found
            </h3>
            <p className="text-gray-500">
              Try searching with different keywords or check the spelling
            </p>
          </div>
        )
      ) : (
        categories.map((category: any, index: number) => (
          <CategorySection
            key={index}
            name={category.title}
            href={`#${category.title}`}
            id={category.id}
            query=""
            favorites={favorites}
            allItems={allItems}
          />
        ))
      )}
    </>
  );
} 
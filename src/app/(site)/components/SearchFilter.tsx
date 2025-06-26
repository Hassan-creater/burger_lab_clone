"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBox from "./SearchBox";
import CategorySection from "./CategorySection";

type SearchFilterProps = {
  categories: any[];
  favorites: any[];
  allItems: any[];
};

export default function SearchFilter({ categories, favorites, allItems }: SearchFilterProps) {
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("query") || "";
  const [filteredItems, setFilteredItems] = useState(allItems);

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
    console.log(`Filtered ${filtered.length} items for query: "${currentQuery}"`);
  }, [currentQuery, allItems]);

  // Group filtered items by category
  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter((item: any) => 
      filteredItems.some((filteredItem: any) => filteredItem.id === item.id)
    )
  })).filter(category => category.items.length > 0);

  return (
    <>
      <SearchBox />
      
      {currentQuery.trim() ? (
        // Show filtered results
        <div className="w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Search Results for {currentQuery}
            </h2>
            <p className="text-gray-600 mt-2">
              Found {filteredItems.length} items in {filteredCategories.length} categories
            </p>
          </div>
          
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category: any, index: number) => (
              <CategorySection
                key={`filtered-${category.id}-${index}`}
                name={category.title}
                href={`#${category.title}`}
                id={category.id}
                query={currentQuery}
                favorites={favorites}
                allItems={category.items} // Use filtered items for this category
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
          )}
        </div>
      ) : (
        // Show all categories (original behavior)
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
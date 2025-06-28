"use client";

import { SearchIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { useSearchParam } from "@/hooks/useSearchParam";
import { useTypingEffect } from "@/hooks/useTypeEffect";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

type SearchBoxProps = {};

export default function SearchBox({}: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useSearchParam("query");
  const [inputValue, setInputValue] = useState(query);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced effect to update URL parameter
  useEffect(() => {
    if (inputValue !== query) {
      setIsSearching(true);
      
      const timeoutId = setTimeout(() => {
        setQuery(inputValue);
        setIsSearching(false);
      }, 1000); // 1 second delay

      return () => {
        clearTimeout(timeoutId);
        setIsSearching(false);
      };
    }
  }, [inputValue, setQuery, query]);

  // Update input value when URL parameter changes (for external updates)
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.onfocus = () => {
        parentRef.current?.classList.add("border-b-primaryOrange");
        parentRef.current?.classList.add("border-b-2");
        parentRef.current?.classList.remove("border-b-gray-700");
        parentRef.current?.classList.remove("border-b-[1px]");
      };
      inputRef.current.onblur = () => {
        parentRef.current?.classList.add("border-b-gray-700");
        parentRef.current?.classList.add("border-b-[1px]");
        parentRef.current?.classList.remove("border-b-primaryOrange");
        parentRef.current?.classList.remove("border-b-2");
      };
    }
  }, []);
  
  const placeholder = useTypingEffect("", [
    "spicy pizza",
    "cheesy pizza",
    "hot chicken",
    "loaded fries",
    "fresh salad",
  ]);

  return (
    <div
      className="flex px-[1em]  rounded-full py-[0.1em] gap-1 items-center w-full lg:max-w-[88%] my-4 border-[1px]  border-orange-300 transition-all border-b-[1px] border-b-orange-300"
      ref={parentRef}
    >
      <div className="flex items-center justify-center w-4 h-4">
        <SearchIcon
          className="text-primaryOrange h-full w-full cursor-default"
          width={80}
          height={80}
        />
        <span className="sr-only">Search</span>
      </div>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={`Search for ${placeholder}`}
        id="search"
        type="search"
        autoComplete="off"
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent w-full rounded-none placeholder:text-gray-400 placeholder:text-sm"
      />
      {isSearching && (
        <div className="flex items-center justify-center w-4 h-4">
          <LoadingSpinner className="w-4 h-4 border-t-primaryOrange" />
        </div>
      )}
    </div>
  );
}

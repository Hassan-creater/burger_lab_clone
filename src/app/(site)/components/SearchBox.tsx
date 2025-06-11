"use client";

import { SearchIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { useSearchParam } from "@/hooks/useSearchParam";
import { useEffect, useRef } from "react";

type SearchBoxProps = {};

export default function SearchBox({}: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useSearchParam("query");

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

  return (
    <div
      className="flex gap-1 items-center w-[95%] lg:max-w-[85%] my-4 border-b-[1px] border-b-gray-700 transition-all"
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
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products here..."
        id="search"
        type="search"
        autoComplete="off"
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent w-full rounded-none placeholder:text-gray-400 placeholder:text-sm"
      />
    </div>
  );
}

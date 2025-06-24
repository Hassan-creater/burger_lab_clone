import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { useSearchParam } from "./useSearchParam";
import { getOrders } from "@/functions";

export const useOrders = (userId: string) => {
  const [page, setPage] = useSearchParam("page");

  useEffect(() => {
    if (!page || page === "" || Number(page) <= 0 || isNaN(Number(page))) {
      setPage("1");
    }
  }, [page, setPage]);

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    status,
    hasPreviousPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["orders", page, userId],
    initialPageParam: 1,
    queryFn: async () => await getOrders(userId, Number(page)),
    getNextPageParam: (lastPage) => {
      if (lastPage.orders) {
        if (
          lastPage.orders.orders.length === 0 ||
          lastPage.orders.currentPage === lastPage.orders.totalPages ||
          lastPage.orders.currentPage === lastPage.orders.totalPages - 1
        ) {
          return undefined;
        }

        return lastPage.orders.currentPage + 1;
      }
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.orders) {
        if (
          firstPage.orders.currentPage === 1 ||
          firstPage.orders.orders.length === 0
        ) {
          return undefined;
        }

        return firstPage.orders.currentPage - 1;
      }
    },
  });

  const handleNextPage = useCallback(() => {
    if (hasNextPage) {
      setPage((page) => String(Number(page) + 1));
      fetchNextPage();
      scrollTo({ behavior: "smooth", top: 0 });
    }
  }, [fetchNextPage, setPage, hasNextPage]);

  const handlePreviousPage = useCallback(() => {
    setPage(Number(page) > 1 ? String(Number(page) - 1) : String(1));
    if (hasPreviousPage) {
      fetchPreviousPage();
      scrollTo({ behavior: "smooth", top: 0 });
    }
  }, [fetchPreviousPage, setPage, page, hasPreviousPage]);

  const handleSpecificPage = useCallback(
    (pageNumber: number) => {
      setPage(String(pageNumber));
      refetch();
      scrollTo({ behavior: "smooth", top: 0 });
    },
    [setPage, refetch]
  );

  const pageLinks = useMemo(() => {
    const totalPages = (data?.pages[0].orders?.totalPages || 1) - 1;
    const maxVisiblePages = 5;
    const currentPage = Number(page) || 1;
    const ellipsis = -1;

    if (totalPages <= maxVisiblePages) {
      console.log(
        Array.from({ length: totalPages }, (_, i) => i),
        totalPages
      );
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const pages: number[] = [];
    const endPages: number[] = [totalPages - 1, totalPages];

    if (currentPage <= 3) {
      return [currentPage - 1, currentPage, ellipsis, ...endPages];
    } else if (currentPage >= totalPages - 2) {
      return [...pages, ellipsis, ...endPages];
    } else {
      return [
        1 - 1,
        ellipsis,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        ellipsis,
        totalPages,
      ];
    }
  }, [data?.pages, page]);

  return {
    data,
    status,
    handleNextPage,
    handlePreviousPage,
    hasNextPage,
    hasPreviousPage,
    handleSpecificPage,
    pageLinks,
  };
};

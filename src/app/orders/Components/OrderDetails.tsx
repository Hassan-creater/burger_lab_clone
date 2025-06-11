"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import OrderDetailsModal from "@/components/modals/OrderDetailsModal";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ServiceError from "@/components/ServiceError";
import { useUserStore } from "@/store/slices/userSlice";

function OrderDetails() {
  const { user } = useUserStore();

  const {
    data,
    status,
    handleNextPage,
    handlePreviousPage,
    hasNextPage,
    hasPreviousPage,
    handleSpecificPage,
    pageLinks,
  } = useOrders(user?.userId!);

  if (status === "pending") {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "error" || data?.pages[0].status === 500) {
    return <ServiceError />;
  }

  if (data?.pages.length === 0) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>No Orders Found</p>
      </div>
    );
  }

  return (
    <>
      {(data?.pages[0]?.orders?.orders.length || 0) > 0 ? (
        data?.pages.map((page) =>
          page.orders?.orders.map((order, index) => (
            <OrderDetailsModal
              key={order.order_created_on}
              order={order}
              index={index}
            />
          ))
        )
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          <p>No Orders Found</p>
        </div>
      )}
      <Pagination className="w-[95%] lg:w-[85%]">
        <PaginationContent className="font-semibold max-w-full overflow-x-scroll no-scrollbar h-max p-1 mx-auto">
          <PaginationItem onClick={() => handlePreviousPage()}>
            <Button
              variant="secondary"
              className="bg-transparent font-bold disabled:text-gray-400 space-x-2"
              disabled={!hasPreviousPage}
            >
              <LucideChevronLeft size={20} />
              Previous
            </Button>
          </PaginationItem>
          {pageLinks.map((linkNo, index) => (
            <PaginationItem key={index}>
              {linkNo === -1 ? (
                <PaginationEllipsis />
              ) : (
                <Button
                  variant="secondary"
                  className={cn(
                    "bg-transparent font-bold text-lg",
                    data?.pages[0].orders?.currentPage === linkNo + 1 &&
                      "outline-primaryOrange outline"
                  )}
                  onClick={() => handleSpecificPage(linkNo + 1)}
                >
                  {linkNo + 1}
                </Button>
              )}
            </PaginationItem>
          ))}
          <PaginationItem onClick={() => handleNextPage()}>
            <Button
              variant="secondary"
              className="bg-transparent font-bold disabled:text-gray-400 space-x-2"
              disabled={!hasNextPage}
            >
              Next
              <LucideChevronRight size={20} />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}

export default OrderDetails;

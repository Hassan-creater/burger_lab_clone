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
import { Loader2, LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ServiceError from "@/components/ServiceError";
import { useUserStore } from "@/store/slices/userSlice";
import { getServerCookie } from "@/app/(site)/page";
import { apiClient } from "@/lib/api";
import { useEffect, useState } from "react";
import axios from "axios";

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

   

  const [order, setOrder] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);// ✅ initialize as array

  const storedOrderIds = JSON.parse(localStorage.getItem("orders") || "[]");

  useEffect(() => {
    const fetchOrders = async () => {
      const validOrders: string[] = [];
      const invalidOrderIds: string[] = [];
  
      // Process all orders in parallel
      const results = await Promise.allSettled(
        storedOrderIds.map(async (id: string) => {
          try {
            const res = await apiClient.get(`/order/${id}`);
            if (res.status === 200 || res.status === 201) {
              return res.data.data;
            }
            // Treat non-200/201 as invalid
            throw new Error(`Unexpected status: ${res.status}`);
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              invalidOrderIds.push(id);
            }
            return null;
          }
        })
      );
  
      // Process results
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value) {
          validOrders.push(result.value);
        } else if (result.status === "rejected") {
          invalidOrderIds.push(storedOrderIds[index]);
        }
      });
  
      // Update localStorage if any invalid orders found
      if (invalidOrderIds.length > 0) {
        const updatedOrderIds = storedOrderIds.filter(
          (id: string) => !invalidOrderIds.includes(id)
        );
        localStorage.setItem("orders", JSON.stringify(updatedOrderIds));
      }
  
      setOrder(validOrders);
      setIsLoading(false);
    };
  
    fetchOrders();
  }, []);
  
  



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

 console.log(order);
  

  return (
    <>
      {/* Main Component */}
{isLoading ? (
  <div className="w-full h-screen flex justify-center items-center">
    <Loader2 className="animate-spin h-10 w-10 text-orange-500" />
  </div>
) : order?.length > 0 ? (
  <div className="space-y-4">
    {order.map((orderData, index) => (
      <OrderDetailsModal
        key={orderData.order.id}  // Use unique ID from nested order
        order={orderData}   // Pass the nested order object directly
        index={index}
      />
    ))}
  </div>
) : (
  <div className="w-full h-screen flex justify-center items-center">
    <p>No Orders Found</p>
  </div>
)
}
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

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
import { Loader2, LucideChevronLeft, LucideChevronRight, Router } from "lucide-react";
import { cn } from "@/lib/utils";
import ServiceError from "@/components/ServiceError";
import { useUserStore } from "@/store/slices/userSlice";
import { apiClient } from "@/lib/api";
import { useEffect, useState } from "react";
import axios from "axios";
import { designVar } from "@/designVar/desighVar";
import { useCartContext } from "@/context/context";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";


function OrderDetails() {
 const {user} = useCartContext()

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

   

  
 const getOrders  = async ()=>{
  try {
    const res = await apiClient.get(`/order/user/${user?.id}`);
    if (res.status === 200 || res.status === 201) {
      return res.data.data?.orders;
    }
    // Treat non-200/201 as invalid
    throw new Error(`Unexpected status: ${res.status}`);
  } catch (error : any) {
    if(error.response.status == 401){
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      Cookies.remove("userData" , {path : "/"});
      localStorage.removeItem("defaultAddress")
      window.location.href = "/"
    }
    return null;
  }
 }
  

  const {data: order , isLoading} = useQuery({
    queryKey : ["orders"],
    queryFn : getOrders,
    enabled : !! user?.id
  })



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
      <div className={`w-full h-screen flex justify-center items-center ${designVar.fontFamily}`}>
        <p>No Orders Found</p>
      </div>
    );
  }


  

  return (
    <>
      {/* Main Component */}
{isLoading ? (
  <div className="w-full h-screen flex justify-center items-center">
    <Loader2 className="animate-spin h-10 w-10 text-orange-500" />
  </div>
) : order?.length > 0 ? (
  <div className="space-y-4">
    {order?.map((orderData : any, index : number) => (
      <OrderDetailsModal
        key={orderData?.id}  // Use unique ID from nested order
        order={orderData}   // Pass the nested order object directly
        index={index}
      />
    ))}
  </div>
) : (
  <div className={`w-full h-screen flex justify-center items-center ${designVar.fontFamily}`}>
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

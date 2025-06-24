"use client";


import { Button } from "@/components/ui/button";
import { useCartContext } from "@/context/context";
import { apiClient } from "@/lib/api";

import { Address } from "@/models/Address";
import {
  QueryObserverResult,
  useQueryClient,

} from "@tanstack/react-query";
import { LucideEdit, LucideTrash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// import dynamic from "next/dynamic";
// import { toast } from "sonner";

// const AddressModal = dynamic(() => import("../modals/AddressModal"), {
//   ssr: false,
// });

type addressFetch = QueryObserverResult<
  | {
      status: number;
      addresses: Address[];
    }
  | {
      status: number;
      addresses: null;
    },
  Error
>;

type AddressCardProps = {
  address?: Address;
  // setOrderDetails?: React.Dispatch<React.SetStateAction<OrderDetails>>;
};

export default function AddressCard({
  address,
}: AddressCardProps) {

  const {setDefaultAddress , defaultAddress} = useCartContext()
  const queryClient = useQueryClient();


  console.log(defaultAddress);

  const deleteAddress = async (id: string) => {
    if (defaultAddress === id) {
      toast.error("You cannot delete your default address");
      return;
    }
  
    const promise = apiClient.delete(`/address/delete/${id}`);
  
    toast.promise(promise, {
      loading: "Deleting address...",
      success: "Address deleted successfully",
      error: "Failed to delete address",
    });
  
    try {
      const res = await promise;
  
      if (res.status === 204) {
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      }
    } catch (error) {
      console.error("Address deletion failed:", error);
    }
  };


   

  return (
    <article className="p-4 flex min-w-52 w-full h-max border-[1px] shadow-sm shadow-black/20 border-gray-800/50 flex-col gap-1 rounded-xl bg-white">
      <h4 className="text-sm text-gray-800 font-medium">{address?.line1}</h4>
      <p className="line-clamp-1 text-xs text-gray-500">{`${address?.line2}, ${address?.city}, ${address?.country}`}</p>
      <div className="flex items-center justify-between w-full mt-4">
        
        <Button
          variant="ghost"
          className="px-2"
        
        >
          <LucideTrash2 onClick={()=>{deleteAddress(address?.id ?? "")}} className="w-6 h-6 text-black" />
          <span className="sr-only">Delete</span>
        </Button>


          {
           defaultAddress == address?.id ? (
            <span onClick={()=>{setDefaultAddress("")}}  className="text-sm text-green-500 bg-green-500/10 px-2 py-1 rounded-md">Default</span>
           ) : (
            <span onClick={()=>{setDefaultAddress(address?.id ?? "")}}  className="text-sm text-gray-500">Set as Default </span>
           )
          }
          
      </div>
    </article>
  );
}

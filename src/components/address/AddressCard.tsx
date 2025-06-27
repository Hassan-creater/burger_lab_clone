"use client";


import { Button } from "@/components/ui/button";
import { useCartContext } from "@/context/context";
import { apiClient } from "@/lib/api";
import { designVar } from "@/designVar/desighVar";
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
    <article className="w-full h-[10em] flex flex-col justify-between p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 max-w-xs">
    {/* Address Line */}
    <div>
      <h4 className={`text-base font-semibold text-gray-800 mb-1 truncate ${designVar.fontFamily}`}>
        {address?.line1}
      </h4>
      <p className={`text-sm text-gray-500 leading-snug line-clamp-2 ${designVar.fontFamily}`}>
        {`${address?.line2}, ${address?.city}, ${address?.country}`}
      </p>
    </div>
  
    {/* Footer */}
    <div className="flex items-center justify-between mt-2">
      {/* Delete Icon */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteAddress(address?.id ?? "")}
        className="hover:bg-red-100 rounded-full"
      >
        <LucideTrash2 className="w-4 h-4 text-red-500" />
        <span className="sr-only">Delete</span>
      </Button>
  
      {/* Default Badge/Button */}
      {defaultAddress === address?.id ? (
        <span
          onClick={() => setDefaultAddress("")}
          className={`cursor-pointer px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full border border-green-200 hover:bg-green-200 transition ${designVar.fontFamily}`}
        >
        Default
        </span>
      ) : (
        <span
          onClick={() => setDefaultAddress(address?.id ?? "")}
          className={`cursor-pointer px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200 hover:bg-orange-100 hover:text-orange-600 transition ${designVar.fontFamily}`}
        >
          Set as Default
        </span>
      )}
    </div>
  </article>
  
  

  );
}

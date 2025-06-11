"use client";

import { OrderDetails } from "@/app/checkout/page";
import { Button } from "@/components/ui/button";
import { deleteAddress } from "@/functions";
import { Address } from "@/models/Address";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { LucideEdit, LucideTrash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

const AddressModal = dynamic(() => import("../modals/AddressModal"), {
  ssr: false,
});

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
  address: Address;
  refetch: (options?: RefetchOptions | undefined) => Promise<addressFetch>;
  setOrderDetails?: React.Dispatch<React.SetStateAction<OrderDetails>>;
};

export default function AddressCard({
  address,
  refetch,
  setOrderDetails,
}: AddressCardProps) {
  const delAddress = useMutation({
    mutationFn: () => deleteAddress(address.id),
    onSuccess() {
      toast.success("Address deleted Successfully", {
        style: { backgroundColor: "green", color: "white" },
        closeButton: true,
        dismissible: true,
      });
      refetch();
    },
    onError() {
      toast.error("Failed to delete Address", {
        style: { backgroundColor: "red", color: "white" },
        closeButton: true,
        dismissible: true,
      });
    },
  });

  return (
    <article className="p-4 flex min-w-52 w-full h-max border-[1px] shadow-sm shadow-black/20 border-gray-800/50 flex-col gap-1 rounded-xl bg-white">
      <h4 className="text-sm text-gray-800 font-medium">{address.line1}</h4>
      <p className="line-clamp-1 text-xs text-gray-500">{`${address.line2}, ${address.city}, ${address.country}`}</p>
      <div className="flex items-center justify-between w-full mt-4">
        <AddressModal
          streetAdd={address.line1}
          type="EDIT"
          addressId={address.id}
          refetch={refetch}
        >
          <Button variant="ghost" className="px-2">
            <LucideEdit className="w-6 h-6 text-primaryOrange" />
            <span className="sr-only">Edit</span>
          </Button>
        </AddressModal>
        <Button
          variant="ghost"
          className="px-2"
          onClick={() => delAddress.mutate()}
        >
          <LucideTrash2 className="w-6 h-6 text-black" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </article>
  );
}

"use client";

import { LucidePlus } from "lucide-react";
import AddressCard from "./AddressCard";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getAllAddresses } from "@/functions";
import dynamic from "next/dynamic";
import { OrderDetails } from "@/app/checkout/page";
import LoadingSpinner from "../LoadingSpinner";
import ServiceError from "../ServiceError";

type AddressDetailsProps = {
  className?: string;
  setOrderDetails?: React.Dispatch<React.SetStateAction<OrderDetails>>;
};

const AddressModal = dynamic(() => import("../modals/AddressModal"), {
  ssr: false,
});

export default function AddressDetails({
  setOrderDetails,
  className,
}: AddressDetailsProps) {
  //TODO TEMPORARY
  const userId = 80;
  const { data, refetch, status } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => getAllAddresses(userId),
  });

  if (status === "pending")
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  if (data?.status === 500) {
    return <ServiceError />;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-sm min-[500px]:text-lg font-semibold text-gray-800">
          My Addresses
        </h2>
        <AddressModal type="ADD" refetch={refetch}>
          <Button
            className="text-primaryOrange space-x-1 hover:text-primaryOrange"
            variant="ghost"
          >
            <LucidePlus className="size-4 min-[500px]:size-6" />
            <p className="text-sm min-[500px]:text-lg font-medium">
              Add new address
            </p>
          </Button>
        </AddressModal>
      </div>
      {!data?.addresses || data?.addresses.length === 0 ? (
        <div className="min-h-72 flex items-center justify-center w-full font-normal text-lg text-gray-800 text-center">
          You don&apos;t have a stored address.
        </div>
      ) : (
        <div
          className={cn(
            "w-full mt-5 grid grid-cols-1 min-[550px]:grid-cols-2 gap-4 md:grid-cols-3 min-h-72",
            className
          )}
        >
          {data?.addresses.map((address) => (
            <AddressCard
              key={address.id}
              setOrderDetails={setOrderDetails}
              address={address}
              refetch={refetch}
            />
          ))}
        </div>
      )}
    </>
  );
}

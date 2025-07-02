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
import { useUserStore } from "@/store/slices/userSlice";
import { useCartContext } from "@/context/context";
import AddressForm from "@/app/addresses/compoenent/AddressForm";
import { apiClient } from "@/lib/api";
import Cookies from "js-cookie";
import { designVar } from "@/designVar/desighVar";

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
  

  const Data = Cookies.get("userData");
  const parsedData = Data ? JSON.parse(Data) : null;
  const userid = parsedData?.id;
  const {setNewAddress , newAddress} = useCartContext();


  const getAddresses = async ()=>{
    const res = await apiClient.get(`/address/user/${userid}`);
    return res.data;
  }

  const { data , status } = useQuery({
    queryKey: ["addresses", userid],
    queryFn: getAddresses,
  });
 
  const Addresses = data?.data;

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
    <div className="w-full h-full max-w-[1400px] mx-auto ">
      {/* { 
        newAddress && (
      // <div className="absolute w-full h-screen bg-black/50 z-10">
      //   <AddressForm />
      // </div>

      )}
      */}
      <div className="flex items-center justify-between ">
        <h2 className={`text-sm min-[500px]:text-lg font-semibold text-gray-800 ${designVar.fontFamily}`}>
          My Addresses
        </h2>
    
          {/* <Button
            className={`  ${designVar.widthFullButton.width} ${designVar.widthFullButton.registerButton.backgroundColor} ${designVar.widthFullButton.registerButton.borderRadius} ${designVar.widthFullButton.registerButton.paddingX} ${designVar.widthFullButton.registerButton.paddingY} ${designVar.widthFullButton.registerButton.fontSize} ${designVar.widthFullButton.registerButton.fontWeight} ${designVar.widthFullButton.registerButton.color} ${designVar.widthFullButton.registerButton.cursor} ${designVar.widthFullButton.registerButton.transition} ${designVar.widthFullButton.registerButton.hover.backgroundColor} ${designVar.widthFullButton.registerButton.hover.borderRadius} ${designVar.widthFullButton.registerButton.hover.color} ${designVar.widthFullButton.registerButton.hover.color} ${designVar.widthFullButton.registerButton.hover.backgroundColor} ${designVar.widthFullButton.textSize} ${designVar.widthFullButton.maxAddressWidth} flex items-center gap-2`}
            variant="ghost"
            onClick={()=>{setNewAddress(true)}}
           >
            <LucidePlus className="size-4 min-[500px]:size-5" />
            <p className={`${designVar.fontFamily}`}>
              A
            </p>
          </Button> */}
          <AddressForm />
      
      </div>
      {!Addresses || Addresses.length === 0 ? (
        <div className={`min-h-72 flex items-center justify-center w-full font-normal text-lg text-gray-800 text-center ${designVar.fontFamily}`}>
          You don&apos;t have a stored address.
        </div>
      ) : (
        <div
          className={cn(
            "w-full mt-5  max-w-[1200px] mx-auto grid grid-cols-1 min-[550px]:grid-cols-2 gap-4 md:grid-cols-3 min-h-72",
            className
          )}
        >
          {Addresses?.map((address : any) => (
            <AddressCard
              key={address.id}
              address={address}
            />
          ))}
        </div>
      )}
    </div>
  );
}

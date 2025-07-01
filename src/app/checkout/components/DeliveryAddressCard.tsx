"use client";

import { useCartContext } from "@/context/context";
import { designVar } from "@/designVar/desighVar";
import { Address } from "@/models/Address";


// import dynamic from "next/dynamic";
// import { toast } from "sonner";

// const AddressModal = dynamic(() => import("../modals/AddressModal"), {
//   ssr: false,
// });



type DeliveryAddressCardProps = {
  address?: Address;

  // setOrderDetails?: React.Dispatch<React.SetStateAction<OrderDetails>>;
};

export default function DeliveryAddressCard({
  address,

}: DeliveryAddressCardProps) {

  const {setDefaultAddress , defaultAddress , setDeliveryAddress } = useCartContext() 
  
  const isDefault = defaultAddress === address?.id;
  
  

  return (
    <article onClick={() => setDeliveryAddress(address?.line1 + " , " + address?.line2)} className={`w-full xl:w-[17em] h-[10em] flex flex-col justify-between p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 max-w-xs cursor-pointer ${isDefault ? "border-[1.5px] border-green-300" : ""}`}>
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

"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CouponValidation } from "@/models/Coupon";
import { OrderDetails } from "@/app/checkout/page";
import { useUserStore } from "@/store/slices/userSlice";
import { useCartContext } from "@/context/context";
import { apiClient } from "@/lib/api";

type PromoBarProps = {
  discount: string;
  setDiscount: React.Dispatch<React.SetStateAction<string>>;
  setOrderDetails?: React.Dispatch<React.SetStateAction<OrderDetails>>;
  setCouponValidation: React.Dispatch<React.SetStateAction<boolean>>;
};

const PromoBar = ({
  setDiscount,
  discount,
  setOrderDetails,
  setCouponValidation,
}: PromoBarProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user , setAuthOpen , setCouponData , couponData , setCouponCode } = useCartContext();
  

  //  coupon vali
  // dation
  const handleApplyPromo = async () => {
    setIsLoading(true);
    setCouponValidation(true);
  
    try {
      const res = await apiClient.post(`/coupon/${promoCode}/redeem`);
      if (res.data.success === false) {
        toast.error(res.data.error || "Coupon redemption failed");
        return;
      }
      // Success path
      const couponResult = res.data.data; // { valid, discount, couponId }
      setCouponData(couponResult);
      setCouponCode(promoCode);
      console.log(res.data);
      setDiscount(couponData.discount);
      toast.success(res.data.message || "Coupon applied!");
      setCouponValidation(false);
  
    } catch (err: any) {
      const serverError =
        err.response?.data?.error ||
        err.message ||
        "An unexpected error occurred";
      toast.error(serverError);
      setCouponValidation(false);
    } finally {
      setPromoCode("");
      setIsLoading(false);
      setCouponValidation(false);
    }
  };


  

  return (
    <div className="flex items-center justify-between w-full h-auto gap-2">
      <Input
        type="text"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
        className="focus-visible:ring-black placeholder:text-gray-500 placeholder:italic text-sm"
        placeholder="Enter Promo Code"
      />
      <Button
        variant="outline"
        disabled={isLoading || !promoCode}
        onClick={()=>{
          if(user){
            handleApplyPromo();
          }else{
            setAuthOpen(true);
          }
        }}
        className={cn(
          "text-sm w-max bg-primaryOrange hover:bg-primaryOrange/80 text-black rounded-3xl !h-10",
          discount !== "0" && "bg-green-600 hover:bg-green-600/80"
        )}
      >
        {isLoading ? "Applying..." : discount !== "0" ? "Applied" : "Apply"}
      </Button>
    </div>
  );
};

export default PromoBar;

"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CouponValidation } from "@/models/Coupon";
import { OrderDetails } from "@/app/checkout/page";
import { useUserStore } from "@/store/slices/userSlice";

type PromoBarProps = {
  discount: string;
  setDiscount: React.Dispatch<React.SetStateAction<string>>;
  setOrderDetails?: React.Dispatch<React.SetStateAction<OrderDetails>>;
};

const PromoBar = ({
  setDiscount,
  discount,
  setOrderDetails,
}: PromoBarProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUserStore();

  // Using dummy coupon validation
  const handleApplyPromo = () => {
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Demo coupon: "SAVE10"
      if (promoCode.toUpperCase() === "SAVE10") {
        const validationResult: CouponValidation = {
          valid: true,
          discount: "10",
          couponId: "1",
        };

        toast.success("Coupon Applied Successfully", {
          closeButton: true,
          dismissible: true,
          style: {
            color: "white",
            backgroundColor: "green",
          },
        });

        setDiscount(validationResult.discount);
        setOrderDetails &&
          setOrderDetails((prev) => ({
            ...prev,
            couponId: parseInt(validationResult.couponId),
            discount: validationResult.discount,
          }));
      } else {
        const validationResult: CouponValidation = {
          valid: false,
          message: "Invalid coupon code",
        };

        toast.error(validationResult.message, {
          closeButton: true,
          dismissible: true,
          style: {
            color: "white",
            backgroundColor: "red",
          },
        });
      }

      setIsLoading(false);
    }, 500); // Simulate 500ms delay
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
        onClick={handleApplyPromo}
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

"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { validateCoupon } from "@/functions";
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

  const { user } = useUserStore();
  const applyPromo = useMutation({
    mutationFn: () => validateCoupon(promoCode, user?.userId!),
    onSuccess: (data) => {
      if (data.status === 500) {
        toast.error(data.validation as string, {
          closeButton: true,
          dismissible: true,
          style: {
            color: "white",
            backgroundColor: "red",
          },
        });
      }

      if (data.status === 200) {
        if ((data.validation as CouponValidation).valid) {
          toast.success("Coupon Applied Successfully", {
            closeButton: true,
            dismissible: true,
            style: {
              color: "white",
              backgroundColor: "green",
            },
          });
          setDiscount((data.validation as CouponValidation).discount);
          setOrderDetails &&
            setOrderDetails((prev) => ({
              ...prev,
              couponId: parseInt(
                (data.validation as CouponValidation).couponId
              ),
              discount: (data.validation as CouponValidation).discount,
            }));
        } else {
          toast.error((data.validation as CouponValidation).message, {
            closeButton: true,
            dismissible: true,
            style: {
              color: "white",
              backgroundColor: "red",
            },
          });
        }
      }
    },
  });

  return (
    <div className="flex gap-0 items-center my-3">
      <Input
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
        disabled={parseInt(discount) > 0}
        placeholder="Promo code"
        className={cn(
          "w-full focus-visible:ring-0 focus-visible:ring-offset-0 border-2 focus-visible:border-primaryOrange",
          promoCode && "rounded-r-none border-r-0"
        )}
      />
      {promoCode && (
        <Button
          variant="default"
          onClick={() => applyPromo.mutate()}
          disabled={parseInt(discount) > 0 || applyPromo.isPending}
          className="rounded-l-none border-2 border-primaryOrange bg-primaryOrange text-black hover:bg-primaryOrange hover:text-inherit transition-none active:scale-100"
        >
          {applyPromo.isPending ? "Applying..." : "Apply"}
        </Button>
      )}
    </div>
  );
};

export default PromoBar;

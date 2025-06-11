"use client";

import AddressDetails from "@/components/address/AddressDetails";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useCart, { CartFromLocalStorage } from "@/hooks/useCart";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LucideMapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import PaymentOption from "./components/PaymentOption";
import Cart from "@/components/cart/Cart";
import { useUserStore } from "@/store/slices/userSlice";
import { toast } from "sonner";

export type OrderDetails = {
  comment: string;
  addressid: string;
  items: any[];
  total: number;
  deliveryCharge: string;
  discount: string;
  tax: string;
  couponId?: string | number;
};

function Checkout() {
  const { user } = useUserStore();
  const localBranchData = useLocalStorage("branch", null);
  const { items } = useCart();
  const router = useRouter();

  const [orderDetails, setOrderDetails] = useState<OrderDetails>(() => ({
    comment: "",
    addressid: "",
    items: items,
    total: 0,
    deliveryCharge: "0",
    tax: "0",
    discount: "0",
  }));

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  /* Original order placement mutation code
  const addOrder = useMutation({
    mutationFn: () => placeOrder(...),
    onSuccess: (data) => {
      // ... success handling
    },
  });
  */

  // Using dummy order placement
  const addOrder = {
    mutate: () => {
      setIsPlacingOrder(true);
      // Simulate API delay
      setTimeout(() => {
        const dummyOrderResult = {
          status: 200,
          order: {
            orderId: Math.floor(Math.random() * 1000) + 1,
            userId: user?.userId,
            total: orderDetails.total,
            status: "pending",
            created_at: new Date().toISOString(),
          },
        };

        // Clear cart and redirect
        router.push("/order-complete/" + dummyOrderResult.order.orderId);
        setIsPlacingOrder(false);

        toast.success("Order placed successfully!", {
          closeButton: true,
          dismissible: true,
          style: {
            color: "white",
            backgroundColor: "green",
          },
        });
      }, 1000);
    },
    isPending: isPlacingOrder
  };

  return (
    <main className="w-[90%] lg:max-w-[85%] mx-auto my-5 min-h-screen">
      <h1 className="text-lg font-bold mb-5">Checkout</h1>
      <div className="w-full h-auto flex flex-col lg:flex-row gap-5">
        <section className="w-full lg:w-2/3 flex flex-col gap-5 h-max">
          {localBranchData.storedValue?.orderType === "delivery" ? (
            <div className="bg-primaryBg h-max px-3 py-8 rounded-lg">
              <AddressDetails
                className="md:grid-cols-2"
                setOrderDetails={setOrderDetails}
              />
            </div>
          ) : (
            <div className="px-3 py-8 space-y-1 text-lg rounded-lg bg-primaryBg">
              <p className="text-normal text-lg">
                This is a{" "}
                {localBranchData.storedValue?.orderType?.toUpperCase()} order
              </p>
              <div className="flex w-full item-center justify-between">
                <p className="text-gray-500 text-lg">
                  Collect from Branch:{" "}
                  <Link
                    href="/"
                    className="font-semibold text-primaryOrange"
                  >
                    {localBranchData.storedValue?.name}
                  </Link>
                </p>
                <LucideMapPin className="w-5 h-5" />
              </div>
            </div>
          )}
          <div className="bg-primaryBg h-max px-3 py-8 rounded-lg">
            <div className="flex flex-col gap-2">
              <Label className="text-[1rem] font-normal leading-relaxed">
                Special Instructions ( Optional )
              </Label>
              <Textarea
                className="focus-visible:ring-primaryOrange placeholder:text-gray-500 text-black"
                value={orderDetails.comment}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, comment: e.target.value })
                }
                placeholder="Add any comment, e.g about allergies, or delivery instructions here."
              />
            </div>
          </div>
          <div className="bg-primaryBg h-max px-3 py-8 rounded-lg space-y-4">
            <h3 className="text-[1rem] font-normal leading-relaxed">
              Select Payment Method
            </h3>
            <PaymentOption type="COD" />
          </div>
        </section>
        <section className="w-full lg:w-1/3 relative bg-primaryBg rounded-lg px-5 py-8 h-max">
          <h3 className="text-lg font-semibold leading-relaxed">Your cart</h3>
          <Cart
            type="CHECKOUT"
            setOrderDetails={setOrderDetails}
            addOrder={addOrder}
          />
        </section>
      </div>
    </main>
  );
}

export default Checkout;

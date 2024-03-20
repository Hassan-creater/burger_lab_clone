"use client";

import AddressDetails from "@/components/address/AddressDetails";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useCart, { CartFromLocalStorage } from "@/hooks/useCart";
import useLocalStorage from "@/hooks/useLocalStorage";
import { ChevronRight, LucideMapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PaymentOption from "./components/PaymentOption";
import Cart from "@/components/cart/Cart";
import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "@/functions";
import { CartItem } from "@/types";

export type OrderDetails = {
  comment: string;
  addressid: string;
  items: CartItem[];
  total: number;
  deliveryCharge: string;
  discount: string;
  tax: string;
  couponId?: string | number;
};

export const dynamic = "force-dynamic";

function Checkout() {
  //TODO TEMPORARY
  const userId = 80;
  const localBranchData = useLocalStorage("branch", null);
  const { storedValue }: CartFromLocalStorage = useLocalStorage(
    "cartStore",
    []
  );
  const { items } = useCart();

  const [orderDetails, setOrderDetails] = useState<OrderDetails>(() => ({
    comment: "",
    addressid: "",
    items: items,
    total: 0,
    deliveryCharge: "0",
    tax: "0",
    discount: "0",
  }));

  const addOrder = useMutation({
    mutationFn: () =>
      placeOrder(
        orderDetails.total,
        orderDetails.tax,
        orderDetails.deliveryCharge,
        orderDetails.comment,
        orderDetails.discount,
        userId,
        orderDetails.couponId,
        localBranchData.storedValue?.orderType === "delivery"
          ? orderDetails.addressid
          : localBranchData.storedValue?.orderType === "dineIn"
          ? "0"
          : "99999",
        items
      ),
  });

  const router = useRouter();

  useEffect(() => {
    document.title = "Checkout - Burger Lab";
  }, []);

  useEffect(() => {
    if (
      items.length === 0 &&
      storedValue?.state &&
      storedValue?.state?.items.length === 0
    ) {
      router.push("/");
    }
  }, [items, router, storedValue]);

  return (
    <main className="w-[95%] my-5 mx-auto px-5 pt-7 pb-8 min-h-screen bg-white rounded-lg space-y-4">
      <div className="flex item-center gap-1 w-full h-auto">
        <Link
          className="text-xs font-normal text-gray-500 hover:underline"
          href="/"
        >
          Home
        </Link>
        <ChevronRight className="text-gray-500" size={15} />
        <p className="text-xs font-normal text-[#fabf2c]">Checkout</p>
      </div>
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
                  <span className="text-black">{`${localBranchData.storedValue?.delivery_areas}, ${localBranchData.storedValue?.city}`}</span>
                </p>
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${localBranchData.storedValue?.lat},${localBranchData.storedValue?.lon}`}
                  className="size-max bg-primaryOrange px-4 py-1 rounded-lg"
                  target="_blank"
                  rel="noreferrer"
                >
                  <LucideMapPin color="black" />
                </Link>
              </div>
            </div>
          )}
          <div className="bg-primaryBg h-max px-3 py-8 rounded-lg space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="text-[1rem] font-normal leading-relaxed">
                Chose Delivery Time
              </Label>
              <Input
                value="ASAP"
                readOnly
                className="focus-visible:ring-primaryOrange text-gray-500"
              />
            </div>
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

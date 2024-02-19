"use client";

import { cn, formatPrice } from "@/lib/utils";
import { CaretDown, ShoppingCartIcon } from "../icons";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import useCart from "@/hooks/useCart";
import { useCallback, useEffect, useState } from "react";
import CartItem from "./CartItem";

interface CartProps {
  className?: string;
}

const Cart = ({ className }: CartProps) => {
  const { items, clearCart, removeItemFromCart, loading } = useCart();
  const [cartItemsQuantity, setCartItemsQuantity] = useState(0);
  const [subTotal, setSubTotal] = useState(0.0);
  const [total, setTotal] = useState(0.0);

  const deliveryCharges = 0.0;

  const calculateSubTotal = useCallback(
    () =>
      setSubTotal(
        items.reduce(
          (accumulator, currentItem) =>
            accumulator +
            currentItem.totalPerPriceWithAddOns * (currentItem.quantity ?? 1),
          0
        )
      ),
    [items]
  );

  const calculateAndSetItemQuantity = useCallback(
    () =>
      setCartItemsQuantity(
        items.reduce(
          (accumulator, current) => accumulator + (current.quantity ?? 0),
          0
        )
      ),
    [items]
  );

  const calculateAndSetTotal = useCallback(
    () => setTotal(subTotal + deliveryCharges),
    [subTotal]
  );

  useEffect(() => {
    if (items && !loading) {
      calculateSubTotal();
      calculateAndSetItemQuantity();
      calculateAndSetTotal();
    }
  }, [
    items,
    loading,
    calculateSubTotal,
    calculateAndSetItemQuantity,
    calculateAndSetTotal,
  ]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          className={cn("flex items-center gap-2 h-full relative", className)}
        >
          <span className="w-5 h-5 rounded-full bg-[#fabf2c] text-white absolute top-2 right-1 z-30 text-xs flex items-center justify-center">
            {cartItemsQuantity}
          </span>
          <ShoppingCartIcon width={26} height={26} />
          <CaretDown width={7} height={7} />
        </div>
      </SheetTrigger>
      <SheetContent className="rounded-tl-2xl rounded-bl-2xl px-4">
        <SheetHeader className="flex flex-row w-full items-center justify-between mt-2 rounded-3xl ">
          <SheetTitle className="font-bold text-md">Your Cart</SheetTitle>
          <Button
            variant="link"
            onClick={clearCart}
            className="text-[#fabf2c] !p-2 underline font-bold text-md"
          >
            Clear Cart
          </Button>
        </SheetHeader>
        {!loading && items.length > 0 ? (
          <>
            <div className="flex flex-col gap-2 no-scrollbar items-center w-full h-[calc(100dvh-260px)] overflow-y-scroll">
              {items.map((cartItem) => (
                <CartItem
                  key={cartItem.id}
                  cartItem={cartItem}
                  removeItem={removeItemFromCart}
                />
              ))}
            </div>
            <SheetFooter className="flex flex-col w-[93%] gap-2 absolute bottom-3 z-50">
              <hr className="bg-categorySeparatorGradient w-full mx-auto h-px mb-2 block" />
              <div className="flex items-center justify-between w-full h-auto">
                <p className="font-normal text-sm">Subtotal</p>
                <p className="font-normal text-gray-500 text-sm">
                  {formatPrice(subTotal)}
                </p>
              </div>
              <div className="flex items-center justify-between w-full h-auto">
                <p className="font-normal text-sm">Delivery Charges</p>
                <p className="font-normal text-gray-500 text-sm">
                  {deliveryCharges > 0 ? formatPrice(deliveryCharges) : "Free"}
                </p>
              </div>
              <div className="flex items-center justify-between w-full h-auto">
                <p className="font-bold text-lg">Grand Total</p>
                <p className="font-bold text-gray-500 text-lg">
                  {formatPrice(total)}
                </p>
              </div>
              <Button
                onClick={() => {}}
                variant="outline"
                title="checkout"
                className="text-center w-full p-2 text-black font-bold rounded-3xl bg-[#fabf2c] hover:bg-[#fabf2a] outline-0 border-0"
              >
                Checkout
              </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="w-full h-[90%] flex flex-col gap-1 items-center justify-center">
            <ShoppingCartIcon
              className="opacity-50 mb-5"
              width={60}
              height={60}
            />
            <p className="text-sm font-normal text-gray-500">
              Looks pretty Empty.
            </p>
            <p className="text-sm font-normal text-gray-500">
              Start Shopping Now!
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;

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
import React, { useEffect, useMemo, useState } from "react";
import CartItem from "./CartItem";
import Link from "next/link";
import PromoBar from "./PromoBar";
import useLocalStorage from "@/hooks/useLocalStorage";
import { OrderDetails } from "@/app/checkout/page";
import { useRouter } from "next/navigation";
import { Loader2, LucideChevronRightCircle } from "lucide-react";
import { useWindowSize } from "@/hooks/useWindowSize";

import { apiClient } from "@/lib/api";
import { useCartContext } from "@/context/context";
import { toast } from "sonner";
import ShoppingBagIcon from "../icons/cart-shopping";


interface CartProps {
  className?: string;
  type: "CHECKOUT" | "CART";
  setOrderDetails?: React.Dispatch<React.SetStateAction<OrderDetails>>;
  addOrder?: any; // Using any for mutation result type for simplicity
  orderDetails? : any
}

const Cart = ({ type, setOrderDetails, addOrder, className  }: CartProps) => {
  const {
    items,
    clearCart,
    removeItemFromCart,
    loading,
    calculateAndSetItemQuantity,
    calculateSubTotal,
    calculateAndSetTotal,
  } = useCart();

  const localBranchData = useLocalStorage("branch", null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemsQuantity, setCartItemsQuantity] = useState(0);
  const [subTotal, setSubTotal] = useState(0.0);
  const [total, setTotal] = useState(0.0);
  const [discount, setDiscount] = useState("0");

  // Using dummy tax data instead
  const data = {
    status: 200,
    tax: "10" // 10% tax rate
  };

  const router = useRouter();


  const deliveryCharges = useMemo(
    () => (localBranchData.storedValue?.orderType === "delivery" ? 150 : 0),
    [localBranchData.storedValue?.orderType]
  );

  const discountAmount = useMemo(
    () =>
      (parseInt(discount ?? "0") / 100) *
      (subTotal +
        deliveryCharges +
        (parseInt(data?.tax ?? "0") / 100) * subTotal),
    [discount, subTotal, data?.tax, deliveryCharges]
  );

  const taxAmount = useMemo(
    () => (parseInt(data?.tax ?? "0") / 100) * subTotal,
    [data?.tax, subTotal]
  );





  useEffect(() => {
    if (addOrder?.data?.order) {
      clearCart();
      router.push("/order-complete/" + addOrder.data?.order?.orderId);
    }
  }, [addOrder?.data, clearCart, router]);

  useEffect(() => {
    if (type === "CHECKOUT") {
      setOrderDetails &&
        setOrderDetails((prev) => ({
          ...prev,
          tax: taxAmount.toString(),
          total: total,
          discount: discountAmount.toString(),
          deliveryCharge: deliveryCharges.toString(),
        }));
    }
  }, [
    setOrderDetails,
    taxAmount,
    total,
    discountAmount,
    deliveryCharges,
    type,
  ]);

  useEffect(() => {
    if (items && !loading) {
      calculateSubTotal(setSubTotal);
      calculateAndSetItemQuantity(setCartItemsQuantity);
      calculateAndSetTotal(
        subTotal,
        deliveryCharges,
        setTotal,
        data?.tax ?? "0",
        discount ?? "0"
      );
    }
  }, [
    items,
    loading,
    calculateSubTotal,
    calculateAndSetItemQuantity,
    calculateAndSetTotal,
    data?.tax,
    subTotal,
    discount,
    deliveryCharges,
  ]);

  const windowWidth = useWindowSize();

  const {AddedInCart , ClearCart , AddressData , defaultAddress , deliveryAddress , deliveryName , deliveryPhone , comment , user , setAuthOpen} = useCartContext();
  const [isLoading, setIsLoading] = useState(false);

 





  const handlePlaceOrder = async () => {
    const payload = {
      status: "pending",
      orderType: AddressData?.orderType,
      ...(defaultAddress && {addressId: defaultAddress}),  
      ...(deliveryAddress && {deliveryAddress: deliveryAddress}),
      ...(deliveryName && {deliveryName: deliveryName}),
      ...(deliveryPhone && {deliveryPhone: deliveryPhone}),
      ...(comment && {comment: comment}),
      items: AddedInCart.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
    
        // only include addons if present
        ...(item.addons?.length
          ? { addons: item.addons.map(addon => ({ id: addon.id, quantity: addon.quantity })) }
          : {}),
    
        // only include extras if present
        ...(item.extras?.length
          ? { extras: item.extras.map(extra => ({ id: extra.id, quantity: extra.quantity })) }
          : {}),
      })),
    };
    
    
    
  if(AddressData?.orderType != "delivery"  && AddressData?.orderType ){
 
    setIsLoading(true);
    const res = await apiClient.post("/order/add",payload);
    if(res.status === 201){
      ClearCart();
      toast.success("Order placed successfully");
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      existingOrders.push(res.data.data.orderId);
      localStorage.setItem("orders", JSON.stringify(existingOrders));
      localStorage.removeItem("orderType")
      sessionStorage.clear();
      router.push("/order-complete/" + res.data.data.orderId);
      setIsLoading(false);
      
    }

  }else if(AddressData?.orderType == "delivery"  && deliveryAddress && deliveryName && deliveryPhone && AddressData?.orderType){
    setIsLoading(true);
    const res = await apiClient.post("/order/add",payload);
    if(res.status === 201){
      ClearCart();
      toast.success("Order placed successfully");
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      existingOrders.push(res.data.data.orderId);
      localStorage.setItem("orders", JSON.stringify(existingOrders));
      localStorage.removeItem("orderType")
      sessionStorage.clear();
      router.push("/order-complete/" + res.data.data.orderId);
      setIsLoading(false);
    }
  } 
  else{
    toast.error("Please select City and Area for placing order");
    setIsLoading(false);
  }
    

  };



  

  if (type === "CART") {
    return (
      <Sheet open={isCartOpen} onOpenChange={() => setIsCartOpen(!isCartOpen)}>
        <SheetTrigger asChild>
          {windowWidth >= 200 ? (
            <Button
              className={cn(
                "flex items-center  gap-2 h-full relative hover:bg-inherit",
                className
              )}
              size="icon"
              variant="ghost"
            >
              <span className="w-5 h-5 rounded-full bg-[#fabf2c] text-white absolute -top-0 right-3 z-30 text-xs flex items-center justify-center">
                {AddedInCart.length}
              </span>
              <ShoppingBagIcon width={26} height={26} />
              <CaretDown width={7} height={7} />
            </Button>
          ) : (
            <div
              className={cn(
                "fixed -bottom-1 p-4 py-6 flex md:hidden w-full bg-primaryOrange left-[0.01rem] items-center justify-between",
                items.length === 0 && "hidden"
              )}
            >
              <div className="flex flex-col items-center justify-center">
                <p className="text-black font-normal">
                  {cartItemsQuantity} Item(s)
                </p>
                <p className="text-black font-bold text-lg">
                  {formatPrice(total)}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-black font-bold text-lg">View Cart</p>
                <LucideChevronRightCircle className="size-8 text-black" />
              </div>
            </div>
          )}
        </SheetTrigger>
        <SheetContent
          className="rounded-t-2xl md:rounded-tl-2xl md:rounded-bl-2xl px-4 h-full"
          side={windowWidth >= 768 ? "right" : "bottom"}
        >
          <SheetHeader className="flex flex-row w-full items-center justify-between mt-2 rounded-3xl">
            <SheetTitle className="font-bold text-md">Your Cart</SheetTitle>
            <Button
              variant="link"
              onClick={()=>{ClearCart()}}
              className="text-[#fabf2c] !p-2 underline font-bold text-md"
            >
              Clear Cart
            </Button>
          </SheetHeader>
          {AddedInCart.length > 0 ? (
            <>
              <div className="flex flex-col gap-2 no-scrollbar items-center w-full h-[calc(100dvh-290px)] overflow-y-scroll pb-[2em] ">
                {AddedInCart?.map((cartItem : any) => (
                  <CartItem
                    key={cartItem.variantId}
                    cartItem={cartItem}
                    removeItem={removeItemFromCart}
                  />
                ))}
              </div>
              <SheetFooter className="flex bg-white flex-col w-[93%] gap-2 absolute bottom-3 z-50">
                <hr className="bg-categorySeparatorGradient w-full mx-auto h-px mb-2 block" />
                <div className="flex items-center justify-between w-full h-auto">
                  <p className="font-normal text-sm">Subtotal</p>
                  <p className="font-normal text-gray-500 text-sm">
                    {formatPrice(AddedInCart.reduce((acc, item) => acc + item.totalPrice, 0))}
                  </p>
                </div>
                {/* <PromoBar
                  discount={discount}
                  setDiscount={setDiscount}
                  setOrderDetails={setOrderDetails}
                /> */}
                <div className="flex items-center justify-between w-full h-auto">
                  <p className="font-normal text-sm">
                    Tax ({parseInt(data?.tax ?? "0") + "%"})
                  </p>
                  <p className="font-normal text-gray-500 text-sm">
                    {formatPrice(AddedInCart.reduce((acc, item) => acc + item.totalPrice * (parseInt(data?.tax ?? "0") / 100), 0))}
                  </p>
                </div>
                <div className="flex items-center justify-between w-full h-auto">
                  <p className="font-normal text-sm">Delivery Charges</p>
                  <p className="font-normal text-gray-500 text-sm">
                    {deliveryCharges > 0
                      ? formatPrice(deliveryCharges)
                      : "Free"}
                  </p>
                </div>
                <div className="flex items-center justify-between w-full h-auto">
                  <p className="font-bold text-[1rem] sm:text-lg">
                    Grand Total (Incl. Tax)
                  </p>
                  <p className="font-bold text-gray-500 text-lg">
                    {formatPrice(AddedInCart.reduce((acc, item) => acc + item.totalPrice, 0) + AddedInCart.reduce((acc, item) => acc + item.totalPrice * (parseInt(data?.tax ?? "0") / 100), 0) + deliveryCharges)}
                  </p>
                </div>
             
                  <Link href="/checkout">
                    <Button
                      variant="outline"
                      title="checkout"
                      onClick={() => {setIsCartOpen(false) ; sessionStorage.setItem("canCheckout", "true")}}
                      className="text-center w-full p-2 text-black font-bold rounded-3xl bg-[#fabf2c] hover:bg-[#fabf2a] outline-0 border-0"
                    >
                      Checkout
                    </Button>
                  </Link>
               
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
  } else {
    return (
      <>
        <div className="flex flex-col gap-2 no-scrollbar items-center w-full h-max min-h-[calc(100dvh-290px)]">
          {  AddedInCart?.map((cartItem : any) => (
            <CartItem
              key={cartItem.variantId}
              cartItem={cartItem}
              
            />
          ))}
        </div>
        <section className="flex flex-col w-full gap-2">
          <hr className="bg-categorySeparatorGradient w-full mx-auto h-px mb-2 block" />
          <PromoBar
            discount={discount}
            setDiscount={setDiscount}
            setOrderDetails={setOrderDetails}
          />
          <div className="flex items-center justify-between w-full h-auto">
            <p className="font-normal text-sm">Subtotal</p>
            <p className="font-normal text-gray-500 text-sm">
              {formatPrice(AddedInCart.reduce((acc, item) => acc + item.totalPrice, 0))}
            </p>
          </div>
          <div className="flex items-center justify-between w-full h-auto">
            <p className="font-normal text-sm">
              Tax ({parseInt(data?.tax ?? "0") + "%"})
            </p>
            <p className="font-normal text-gray-500 text-sm">
              {formatPrice(AddedInCart.reduce((acc, item) => acc + item.totalPrice * (parseInt(data?.tax ?? "0") / 100), 0))}
            </p>
          </div>
          <div className="flex items-center justify-between w-full h-auto">
            <p className="font-normal text-sm">
              Discount ({parseInt(discount ?? "0") + "%"})
            </p>
            <p className="font-normal text-gray-500 text-sm">
              - {formatPrice(AddedInCart.reduce((acc, item) => acc + item.totalPrice * (parseInt(discount ?? "0") / 100), 0))}
            </p>
          </div>
          <div className="flex items-center justify-between w-full h-auto">
            <p className="font-normal text-sm">Delivery Charges</p>
            <p className="font-normal text-gray-500 text-sm">
              {deliveryCharges > 0 ? formatPrice(deliveryCharges) : "Free"}
            </p>
          </div>
          <div className="flex items-center justify-between w-full h-auto">
            <p className="font-bold text-[1rem] sm:text-lg">
              Grand Total (Incl. Tax)
            </p>
            <p className="font-bold text-gray-500 text-lg">
              {formatPrice(AddedInCart.reduce((acc, item) => acc + item.totalPrice, 0) + AddedInCart.reduce((acc, item) => acc + item.totalPrice * (parseInt(data?.tax ?? "0") / 100), 0) + deliveryCharges)}
            </p>
          </div>
          <Button
            variant="outline"
            title="checkout"
            disabled={AddedInCart.length === 0 || addOrder?.isPending }
            onClick={()=>{
              if(user){
                handlePlaceOrder();
              }else{
                setAuthOpen(true);
              }
            }}
            className="text-center w-full p-2 text-black font-bold rounded-3xl bg-[#fabf2c] hover:bg-[#fabf2a] outline-0 border-0"
          >
            {
              isLoading ? <Loader2 className="size-4 animate-spin" /> : "Place order"
            }
          </Button>
        </section>
      </>
    );
  }
};

export default Cart;

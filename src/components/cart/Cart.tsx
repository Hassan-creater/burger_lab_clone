"use client";

import { cn, extractUnavailableAddonsOrExtrasError, formatPrice } from "@/lib/utils";
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
import { Loader2, LucideChevronRightCircle, Search } from "lucide-react";
import { useWindowSize } from "@/hooks/useWindowSize";

import { apiClient, apiClientCustomer } from "@/lib/api";
import { useCartContext } from "@/context/context";
import { toast } from "sonner";
import ShoppingBagIcon from "../icons/cart-shopping";
import { useQuery } from "@tanstack/react-query";
import { designVar } from "@/designVar/desighVar";
import DealItem from "./DealCartItem";
import { json } from "stream/consumers";
import { loadCartFromStorage } from "@/cartStorage/cartStorage";


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
  const [couponValidation, setCouponValidation] = useState<boolean>(false);
  const {AddedInCart  , dealData, ClearCart , AddressData , defaultAddress , deliveryAddress , deliveryName , deliveryPhone , comment , user , setAuthOpen , couponData ,setCouponData, updateCart, couponCode , isTaxAppliedBeforeCoupon ,pickupClose , deliveryClose , dineInClose , updateDealCart  } = useCartContext();
  const [isLoading, setIsLoading] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, { addons: boolean; extras: boolean }>>({});

  const handleSetShowAddons = (key: string, val: boolean) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: { ...(prev[key] || { addons: false, extras: false }), addons: val },
    }));
  };
  const handleSetShowExtras = (key: string, val: boolean) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: { ...(prev[key] || { addons: false, extras: false }), extras: val },
    }));
  };

  // Using dummy tax data instead
  // const  getTax = async () => {
  //   const res = await apiClientCustomer.get("/company")
  //    return res.data.data;
  // }

  // const {data : taxData , isLoading : taxLoading} = useQuery({
  //   queryKey : ["tax"],
  //   queryFn : getTax,
  // })
 

 

  const data = {
    status: 200,
    tax: AddressData?.tax // 10% tax rate
  };

  const router = useRouter();

  // useEffect(() => {
  //   if(taxData){
  //     setTaxData(taxData);
  //   }
  // }, [taxData]);


  const deliveryCharges = useMemo(
    () => (localBranchData.storedValue?.orderType === "delivery" ? 150 : 0),
    [localBranchData.storedValue?.orderType]
  );

  const oldDiscountAmount = useMemo(
    () =>
      (parseInt(discount ?? "0") / 100) *
      (subTotal +
        deliveryCharges +
        (parseInt(data?.tax ?? "0") / 100) * subTotal),
    [discount, subTotal, data?.tax, deliveryCharges]
  );

  // Calculate subtotals
  const dealDataSafe = Array.isArray(dealData) ? dealData : [];
  const itemSubtotal = AddedInCart.reduce((acc, item) => acc + item.totalPrice, 0);
  const dealSubtotal = dealDataSafe.reduce((acc, deal) => acc + (deal.totalPrice || 0), 0);
  const combinedSubtotal = itemSubtotal + dealSubtotal;
  
  // Calculate tax and discount based on isTaxAppliedBeforeCoupon
  let taxAmount, discountAmount, grandTotal;
  
  if (isTaxAppliedBeforeCoupon) {
    // Apply tax first, then discount on original subtotal
    taxAmount = combinedSubtotal * (parseInt(data?.tax ?? "0") / 100);
    discountAmount = combinedSubtotal * (parseInt(couponData?.discount ?? "0") / 100);
    grandTotal = combinedSubtotal + taxAmount - discountAmount + deliveryCharges;
  } else {
    // Apply discount first, then tax on discounted amount
    discountAmount = combinedSubtotal * (parseInt(couponData?.discount ?? "0") / 100);
    const discountedSubtotal = combinedSubtotal - discountAmount;
    taxAmount = discountedSubtotal * (parseInt(data?.tax ?? "0") / 100);
    grandTotal = discountedSubtotal + taxAmount + deliveryCharges;
  }



 useEffect(()=>{
  if(couponData){
    setCouponData({});
  }
 },[])


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



 


 

 


  const handlePlaceOrder = async () => {
    if(!AddressData?.branchId){
      toast.error("Please select location.");
      return;
    }

    let orderPayload = {
      status: "pending",
      orderType: AddressData?.orderType,
      branchId : AddressData?.branchId,
     
      ...(couponCode && {couponCode: couponCode}),
      ...(defaultAddress && {addressId: defaultAddress}),  
      ...(deliveryAddress && {deliveryAddress: deliveryAddress}),
      ...(deliveryName && {deliveryName: deliveryName}),
      ...(deliveryPhone && {deliveryPhone: deliveryPhone}),
      ...(comment && {comment: comment}),
      items: AddedInCart?.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        ...(item.addons?.length
          ? { addons: item.addons.map(addon => ({ id: addon.id, quantity: addon.quantity })) }
          : {}),
        ...(item.extras?.length
          ? { extras: item.extras.map(extra => ({ id: extra.id, quantity: extra.quantity })) }
          : {}),
      })),
      dealItems : dealData?.map((deal: any) => ({
        dealId: deal.dealId,
        quantity: deal.variantQuantity,
        ...(deal.addons?.length
          ? { addons: deal.addons.map((addon: any) => ({ id: addon.id, quantity: addon.quantity })) }
          : {}),
        ...(deal.extras?.length
          ? { extras: deal.extras.map((extra: any) => ({ id: extra.id, quantity: extra.quantity })) }
          : {}),
      }))
    };

    if(AddressData?.orderType){
      setIsLoading(true);
      try {
        const res = await apiClient.post("/order/add", orderPayload);
        if(res.status === 201){
          ClearCart();
          toast.success("Order placed successfully");
          localStorage.removeItem("orderType")
          sessionStorage.clear();
          router.push("/order-complete/" + res.data.data.displayId);
        }
      } catch (err: any) {
        const backendError = err?.response?.data;
          if (backendError?.error && typeof backendError.error === 'string') {
            try {
              const parsed = JSON.parse(backendError.error);
          

            // Handle unavailable variants
            if (parsed.unavailableVariants?.length > 0) {
              const unavailableVariantIds = new Set(parsed.unavailableVariants);
              
              // Filter out unavailable variants from AddedInCart
              const filteredCart = AddedInCart.filter(item => !unavailableVariantIds.has(item.variantId));

              // Filter out unavailable variants from dealData
              const filteredDeals = dealData.filter((deal: any) => !unavailableVariantIds.has(deal.variantId));

        

              localStorage.removeItem("my_cart_payload")
              updateCart(filteredCart);

              // Update order payload with filtered items
              orderPayload.items = filteredCart.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity,
                ...(item.addons?.length
                  ? { addons: item.addons.map(addon => ({ id: addon.id, quantity: addon.quantity })) }
                  : {}),
                ...(item.extras?.length
                  ? { extras: item.extras.map(extra => ({ id: extra.id, quantity: extra.quantity })) }
                  : {}),
              }));

              orderPayload.dealItems = filteredDeals.map((deal: any) => ({
                dealId: deal.dealId,
                quantity: deal.variantQuantity,
                ...(deal.addons?.length
                  ? { addons: deal.addons.map((addon: any) => ({ id: addon.id, quantity: addon.quantity })) }
                  : {}),
                ...(deal.extras?.length
                  ? { extras: deal.extras.map((extra: any) => ({ id: extra.id, quantity: extra.quantity })) }
                  : {}),
              }));

              toast.error("Some items are unavailable and have been removed from your order");
              
              // // Retry order with updated payload
              // const retryResponse = await apiClient.post("/order/add", orderPayload);
              // if(retryResponse.status === 201) {
              //   ClearCart();
              //   toast.success("Order placed successfully");
              //   localStorage.removeItem("orderType")
              //   sessionStorage.clear();
              //   router.push("/order-complete/" + retryResponse.data.data.displayId);
              // }
              return;
            }

            // Handle unavailable deals and unavailable addons for deals
            if (parsed.dealItems?.length > 0) {
              let filteredDeals = dealData;

              // Remove unavailable deals
              if (parsed.dealItems?.length > 0) {
                const unavailableDealIds = new Set(parsed.dealItems);
                filteredDeals = filteredDeals.filter((deal: any) => !unavailableDealIds.has(deal.dealId));
              }

              // Remove unavailable addons from deals and adjust price
              if (parsed.unavailableAddons?.length > 0) {
                const unavailableAddonIds = new Set(parsed.unavailableAddons);
                filteredDeals = filteredDeals.map((deal: any) => {
                  const removedAddons = deal.addons?.filter((addon: any) => unavailableAddonIds.has(addon.id)) || [];
                  const removedAddonsTotal = removedAddons.reduce(
                    (total: number, addon: any) => total + (addon.price * addon.quantity),
                    0
                  );
                  return {
                    ...deal,
                    addons: deal.addons?.filter((addon: any) => !unavailableAddonIds.has(addon.id)) || [],
                    totalPrice: deal.totalPrice - removedAddonsTotal,
                  };
                });
              }

              // Update localStorage and deal cart
              if (filteredDeals.length === 0) {
                localStorage.removeItem("deal_paylod");
                updateDealCart([]);
              } else {
                updateDealCart(filteredDeals);
              }

              // Update order payload with filtered deals
              orderPayload.dealItems = filteredDeals.map((deal: any) => ({
                dealId: deal.dealId,
                quantity: deal.variantQuantity,
                ...(deal.addons?.length
                  ? { addons: deal.addons.map((addon: any) => ({ id: addon.id, quantity: addon.quantity })) }
                  : {}),
                ...(deal.extras?.length
                  ? { extras: deal.extras.map((extra: any) => ({ id: extra.id, quantity: extra.quantity })) }
                  : {}),
              }));

              toast.error("Some deals/addons are unavailable and have been removed from your order");
              return;
            }

            // Handle unavailableAddons for both cart items and deals, but only update the relevant one
            if (parsed.unavailableAddons?.length > 0) {
              const unavailableAddonIds = new Set(parsed.unavailableAddons);

              // Check if any deal contains the unavailable addon
              const dealHasUnavailableAddon = dealData.some(deal =>
                (deal.addons || []).some((addon: any) => unavailableAddonIds.has(addon.id))
              );
              // Check if any cart item contains the unavailable addon
              const itemHasUnavailableAddon = AddedInCart.some(item =>
                (item.addons || []).some((addon: any) => unavailableAddonIds.has(addon.id))
              );

              if (dealHasUnavailableAddon) {
                // Update only deals
                const filteredDeals = dealData.map((deal: any) => {
                  const removedAddons = deal.addons?.filter((addon: any) => unavailableAddonIds.has(addon.id)) || [];
                  const removedAddonsTotal = removedAddons.reduce((total: number, addon: any) => total + ((addon?.price || 0) * addon.quantity), 0);
                  return {
                    ...deal,
                    addons: deal.addons?.filter((addon: any) => !unavailableAddonIds.has(addon.id)) || [],
                    totalPrice: deal.totalPrice - removedAddonsTotal,
                  };
                });
                const nonEmptyDeals = filteredDeals.filter((deal: any) => deal);
                const flatDeals = nonEmptyDeals.flat ? nonEmptyDeals.flat() : nonEmptyDeals;
                if (flatDeals.length === 0) {
                  localStorage.removeItem("deal_paylod");
                  updateDealCart([]);
                } else {
                  localStorage.removeItem("deal_paylod");
                  updateDealCart(flatDeals);
                }
                orderPayload.dealItems = flatDeals.map((deal: any) => ({
                  dealId: deal.dealId,
                  quantity: deal.variantQuantity,
                  ...(deal.addons?.length
                    ? { addons: deal.addons.map((addon: any) => ({ id: addon.id, quantity: addon.quantity })) }
                    : {}),
                  ...(deal.extras?.length
                    ? { extras: deal.extras.map((extra: any) => ({ id: extra.id, quantity: extra.quantity })) }
                    : {}),
                }));
                toast.error("Some deal addons are unavailable and have been removed from your order");
                return;
              } else if (itemHasUnavailableAddon) {
                // Update only cart items
                const filteredCart = AddedInCart.map(item => {
                  const removedAddons = item.addons?.filter(addon => unavailableAddonIds.has(addon.id)) || [];
                  const removedAddonsTotal = removedAddons.reduce((total, addon) => total + ((addon?.price || 0) * addon.quantity), 0);
                  return {
                    ...item,
                    addons: item.addons?.filter(addon => !unavailableAddonIds.has(addon.id)) || [],
                    totalPrice: item.totalPrice - removedAddonsTotal
                  };
                });
                localStorage.removeItem("my_cart_payload");
                updateCart(filteredCart);
                orderPayload.items = filteredCart.map(item => ({
                  variantId: item.variantId,
                  quantity: item.quantity,
                  ...(item.addons?.length
                    ? { addons: item.addons.map(addon => ({ id: addon.id, quantity: addon.quantity })) }
                    : {}),
                  ...(item.extras?.length
                    ? { extras: item.extras.map(extra => ({ id: extra.id, quantity: extra.quantity })) }
                    : {}),
                }));
                toast.error("Some item addons are unavailable and have been removed from your order");
                return;
              }
            }

            // Handle unavailableExtras for both cart items and deals, but only update the relevant one
            if (parsed.unavailableExtras?.length > 0) {
              const unavailableExtraIds = new Set(parsed.unavailableExtras);

              // Check if any deal contains the unavailable extra
              const dealHasUnavailableExtra = dealData.some(deal =>
                (deal.extras || []).some((extra: any) => unavailableExtraIds.has(extra.id))
              );
              // Check if any cart item contains the unavailable extra
              const itemHasUnavailableExtra = AddedInCart.some(item =>
                (item.extras || []).some((extra: any) => unavailableExtraIds.has(extra.id))
              );

              if (dealHasUnavailableExtra) {
                // Update only deals
                const filteredDeals = dealData.map((deal: any) => {
                  const removedExtras = deal.extras?.filter((extra: any) => unavailableExtraIds.has(extra.id)) || [];
                  const removedExtrasTotal = removedExtras.reduce((total: number, extra: any) => total + ((extra?.price || 0) * extra.quantity), 0);
                  return {
                    ...deal,
                    extras: deal.extras?.filter((extra: any) => !unavailableExtraIds.has(extra.id)) || [],
                    totalPrice: deal.totalPrice - removedExtrasTotal,
                  };
                });
                const nonEmptyDeals = filteredDeals.filter((deal: any) => deal);
                const flatDeals = nonEmptyDeals.flat ? nonEmptyDeals.flat() : nonEmptyDeals;
                if (flatDeals.length === 0) {
                  localStorage.removeItem("deal_paylod");
                  updateDealCart([]);
                } else {
                  updateDealCart(flatDeals);
                }
                orderPayload.dealItems = flatDeals.map((deal: any) => ({
                  dealId: deal.dealId,
                  quantity: deal.variantQuantity,
                  ...(deal.addons?.length
                    ? { addons: deal.addons.map((addon: any) => ({ id: addon.id, quantity: addon.quantity })) }
                    : {}),
                  ...(deal.extras?.length
                    ? { extras: deal.extras.map((extra: any) => ({ id: extra.id, quantity: extra.quantity })) }
                    : {}),
                }));
                toast.error("Some deal extras are unavailable and have been removed from your order");
                return;
              } else if (itemHasUnavailableExtra) {
                // Update only cart items
                const filteredCart = AddedInCart.map(item => {
                  const removedExtras = item.extras?.filter(extra => unavailableExtraIds.has(extra.id)) || [];
                  const removedExtrasTotal = removedExtras.reduce((total, extra) => total + ((extra?.price || 0) * extra.quantity), 0);
                  return {
                    ...item,
                    extras: item.extras?.filter(extra => !unavailableExtraIds.has(extra.id)) || [],
                    totalPrice: item.totalPrice - removedExtrasTotal
                  };
                });
                localStorage.removeItem("my_cart_payload");
                updateCart(filteredCart);
                orderPayload.items = filteredCart.map(item => ({
                  variantId: item.variantId,
                  quantity: item.quantity,
                  ...(item.addons?.length
                    ? { addons: item.addons.map(addon => ({ id: addon.id, quantity: addon.quantity })) }
                    : {}),
                  ...(item.extras?.length
                    ? { extras: item.extras.map(extra => ({ id: extra.id, quantity: extra.quantity })) }
                    : {}),
                }));
                toast.error("Some item extras are unavailable and have been removed from your order");
                return;
              }
            }

                toast.error(err?.message || 'Failed to place order. Please try again.');
            } catch {
              toast.error(err?.message || 'Failed to place order. Please try again.');
            }
          } else {
            toast.error(backendError?.error || err?.message || 'Failed to place order. Please try again.');
          }
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please select City and Area for placing order");
      setIsLoading(false);
    }
  };


  const totalCartItems = AddedInCart.length + dealDataSafe.length;

  const [showSearchIcon, setShowSearchIcon] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setShowSearchIcon(window.scrollY > 200);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  if (type === "CART") {
    return (
      <Sheet open={isCartOpen} onOpenChange={() => setIsCartOpen(!isCartOpen)}>
        <SheetTrigger asChild>
          {windowWidth >= 500 ? (
            <Button
              className={cn(
                "flex items-center  gap-2 h-full relative hover:bg-inherit",
                className
              )}
              size="icon"
              variant="ghost"
            >
              <span className="w-5 h-5 rounded-full bg-[#fabf2c] text-white absolute -top-4 right-2 z-30 text-xs flex items-center justify-center">
                {
                  dealDataSafe.length > 0 ? (AddedInCart.length + dealDataSafe.length) : AddedInCart.length
                }
              </span>
              <ShoppingBagIcon width={26} height={26} />
              <CaretDown width={7} height={7} />
            </Button>
          ) : (
            <div>
            {showSearchIcon && (
              <div
              className={cn(
                "fixed bottom-[80px] right-4 z-[9999] p-3 bg-[#fabf2c] rounded-full shadow-md transition-all duration-500 transform",
                showSearchIcon
                  ? "opacity-100 pointer-events-auto translate-y-0"
                  : "opacity-0 pointer-events-none translate-y-6"
              )}
              onClick={(e) => {
                e.stopPropagation();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Search width={26} height={26} className="text-black" />
            </div>
            
            
            )}
        
            <div
              className="fixed bottom-4 right-4 z-[9999] flex items-center justify-center bg-[#fabf2c] rounded-full p-3 shadow-lg transition-all duration-300"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBagIcon width={26} height={26} className="text-white" />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </div>
          </div>
        
        
          )}
        </SheetTrigger>
        <SheetContent
          className="rounded-t-2xl md:rounded-tl-2xl md:rounded-bl-2xl px-4 h-full"
          side={windowWidth >= 768 ? "right" : "bottom"}
        >
          <SheetHeader className="flex flex-row w-full items-center justify-between mt-2 rounded-3xl">
            <SheetTitle className={`font-bold text-md ${designVar.fontFamily}`}>Your Cart</SheetTitle>
            <Button
              variant="link"
              onClick={()=>{ClearCart()}}
              className={`text-[#fabf2c] !p-2 underline font-bold text-md ${designVar.fontFamily}`}
            >
              Clear Cart
            </Button>
          </SheetHeader>
          {AddedInCart.length > 0 || dealDataSafe.length > 0 ? (
            <>
              <div className="flex flex-col gap-2 no-scrollbar items-center w-full h-[calc(100dvh-290px)] overflow-y-scroll pb-[2em] ">
                {AddedInCart?.map((cartItem : any) => (
                  <CartItem
                    key={cartItem.totalPrice + cartItem.variantId + cartItem.variantName + cartItem.quantity}
                    cartItem={cartItem}
                    removeItem={removeItemFromCart}
                    showAddons={!!openDropdowns[cartItem.variantId + cartItem.variantName + cartItem.quantity]?.addons}
                    setShowAddons={val => handleSetShowAddons(cartItem.variantId + cartItem.variantName + cartItem.quantity, val)}
                    showExtras={!!openDropdowns[cartItem.variantId + cartItem.variantName + cartItem.quantity]?.extras}
                    setShowExtras={val => handleSetShowExtras(cartItem.variantId + cartItem.variantName + cartItem.quantity, val)}
                  />
                ))}



                  {dealDataSafe?.map((cartItems : any) => (
                  <DealItem
                    key={cartItems.variantTotalPrice + cartItems.dealId}
                    cartItem={cartItems}
                    removeItem={removeItemFromCart}
                  />
                ))}
              </div>
              <SheetFooter className="flex bg-white flex-col w-[93%] gap-2 absolute bottom-3 z-50">
                <hr className="bg-categorySeparatorGradient w-full mx-auto h-px mb-2 block" />
                {/* Subtotals for items and deals */}
               
                {/* Combined subtotal */}
                <div className="flex items-center justify-between w-full h-auto">
                  <p className={`font-normal text-sm ${designVar.fontFamily}`}>Subtotal</p>
                  <p className={`font-normal text-gray-500 text-sm ${designVar.fontFamily}`}>{formatPrice(combinedSubtotal)}</p>
                </div>
                <div className="flex items-center justify-between w-full h-auto">
                  <p className={`font-normal text-sm ${designVar.fontFamily}`}>Tax ({parseInt(data?.tax ?? "0") + "%"})</p>
                  <p className={`font-normal text-gray-500 text-sm ${designVar.fontFamily}`}>{formatPrice(taxAmount)}</p>
                </div>
              
                <div className="flex items-center justify-between w-full h-auto">
                  <p className={`font-normal text-sm ${designVar.fontFamily}`}>Delivery Charges</p>
                  <p className={`font-normal text-gray-500 text-sm ${designVar.fontFamily}`}>{deliveryCharges > 0 ? formatPrice(deliveryCharges) : "Free"}</p>
                </div>
                <div className="flex items-center justify-between w-full h-auto">
                  <p className={`font-bold text-[1rem] sm:text-lg ${designVar.fontFamily}`}>Grand Total (Incl. Tax)</p>
                  <p className={`font-bold text-gray-500 text-lg ${designVar.fontFamily}`}>
                    {formatPrice(grandTotal)}
                  </p>
                </div>
             
                  <Link href="/checkout">
                    <Button
                      variant="outline"
                      title="checkout"
                      onClick={() => {setIsCartOpen(false) ; sessionStorage.setItem("canCheckout", "true")}}
                      className={`${designVar.widthFullButton.width} ${designVar.widthFullButton.backgroundColor} ${designVar.widthFullButton.borderRadius} ${designVar.widthFullButton.paddingX} ${designVar.widthFullButton.paddingY} ${designVar.widthFullButton.fontSize} ${designVar.widthFullButton.fontWeight} ${designVar.widthFullButton.color} ${designVar.widthFullButton.cursor} ${designVar.widthFullButton.transition} ${designVar.widthFullButton.hover.backgroundColor} ${designVar.widthFullButton.hover.borderRadius} ${designVar.widthFullButton.hover.color} ${designVar.widthFullButton.hover.color} ${designVar.widthFullButton.hover.backgroundColor}`}
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
              <p className={`text-sm font-normal text-gray-500 ${designVar.fontFamily}`}>
                Looks pretty Empty.
              </p>
              <p className={`text-sm font-normal text-gray-500 ${designVar.fontFamily}`}>
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
              key={cartItem.totalPrice + cartItem.variantId + cartItem.variantName + cartItem.quantity}
              cartItem={cartItem}
              showAddons={!!openDropdowns[cartItem.variantId + cartItem.variantName + cartItem.quantity]?.addons}
              setShowAddons={val => handleSetShowAddons(cartItem.variantId + cartItem.variantName + cartItem.quantity, val)}
              showExtras={!!openDropdowns[cartItem.variantId + cartItem.variantName + cartItem.quantity]?.extras}
              setShowExtras={val => handleSetShowExtras(cartItem.variantId + cartItem.variantName + cartItem.quantity, val)}
            />
          ))}

              {dealDataSafe?.map((cartItems : any) => (
                  <DealItem
                    key={cartItems.variantTotalPrice + cartItems.dealId}
                    cartItem={cartItems}
                    removeItem={removeItemFromCart}
                  />
                ))}


        </div>
        <section className="flex flex-col w-full gap-2">
          <hr className="bg-categorySeparatorGradient w-full mx-auto h-px mb-2 block" />
          <PromoBar
            discount={discount}
            setDiscount={setDiscount}
            setOrderDetails={setOrderDetails}
            setCouponValidation={setCouponValidation}
          />
          {/* Subtotals for items and deals */}
          {/* {itemSubtotal > 0 && (
            <div className="flex items-center justify-between w-full h-auto">
              <p className={`font-normal text-sm ${designVar.fontFamily}`}>Subtotal</p>
              <p className={`font-normal text-gray-500 text-sm ${designVar.fontFamily}`}>
                {formatPrice(AddedInCart.reduce((acc, item) => acc + item.totalPrice, 0))}
              </p>
            </div>
          )} */}
          {/* {dealSubtotal > 0 && (
            <div className="flex items-center justify-between w-full h-auto">
              <p className={`font-normal text-sm ${designVar.fontFamily}`}>Deals Subtotal</p>
              <p className={`font-normal text-gray-500 text-sm ${designVar.fontFamily}`}>
                {formatPrice(dealSubtotal)}
              </p>
            </div>
          )} */}
          {/* Combined subtotal */}
          <div className="flex items-center justify-between w-full h-auto">
            <p className={`font-normal text-sm ${designVar.fontFamily}`}>Subtotal</p>
            <p className={`font-normal text-gray-500 text-sm ${designVar.fontFamily}`}>
              {formatPrice(combinedSubtotal)}
            </p>
          </div>
          <div className="flex items-center justify-between w-full h-auto">
            <p className={`font-normal text-sm ${designVar.fontFamily}`}>Tax ({parseInt(data?.tax ?? "0") + "%"})</p>
            <p className={`font-normal text-gray-500 text-sm ${designVar.fontFamily}`}>
              {formatPrice(taxAmount)}
            </p>
          </div>
          <div className="flex items-center justify-between w-full h-auto">
            <p className={`font-normal text-sm ${designVar.fontFamily}`}>Discount ({parseInt(couponData?.discount ?? "0") + "%"})</p>
            <p className={`font-normal text-gray-500 text-sm ${designVar.fontFamily}`}>
              {formatPrice(discountAmount)}
            </p>
          </div>
          <div className="flex items-center justify-between w-full h-auto">
          <p className={`font-normal text-sm ${designVar.fontFamily}`}>Delivery Charges</p>
            <p className={`font-normal text-gray-500 text-sm ${designVar.fontFamily}`}>
              {deliveryCharges > 0 ? formatPrice(deliveryCharges) : "Free"}
            </p>
          </div>
          <div className="flex items-center justify-between w-full h-auto">
              <p className={`font-bold text-[1rem] sm:text-lg ${designVar.fontFamily}`}>Grand Total (Incl. Tax)</p>
            <p className={`font-bold text-gray-500 text-lg ${designVar.fontFamily}`}>
              {formatPrice(grandTotal)}
            </p>
          </div>
          <Button
            variant="outline"
            title="checkout"
            disabled={(AddedInCart.length === 0 && dealData.length ===0) || addOrder?.isPending  || couponValidation}
            onClick={()=>{
              if(user){
                if(dineInClose || pickupClose || deliveryClose){
                  toast.error(dineInClose || pickupClose || deliveryClose)
                  return
                }else{
                  handlePlaceOrder();
                }
              }else{
                setAuthOpen(true);
              }
            }}
            className={`${designVar.widthFullButton.width} ${designVar.widthFullButton.backgroundColor} ${designVar.widthFullButton.borderRadius} ${designVar.widthFullButton.paddingX} ${designVar.widthFullButton.paddingY} ${designVar.widthFullButton.fontSize} ${designVar.widthFullButton.fontWeight} ${designVar.widthFullButton.color} ${designVar.widthFullButton.cursor} ${designVar.widthFullButton.transition} ${designVar.widthFullButton.hover.backgroundColor} ${designVar.widthFullButton.hover.borderRadius} ${designVar.widthFullButton.hover.color} ${designVar.widthFullButton.hover.color} ${designVar.widthFullButton.hover.backgroundColor}`}
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

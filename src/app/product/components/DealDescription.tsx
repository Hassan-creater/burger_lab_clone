


"use client";

import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useCartContext } from "@/context/context";
import { formatPrice } from "@/lib/utils";
import { Item } from "@/models/Item";
import ProductDescriptionSkelton from "@/components/ui/productDescriptionSkelton";
import { designVar } from "@/designVar/desighVar";
import { toast } from "sonner";
import { saveDealCartData } from "@/cartStorage/cartStorage";

interface ProductDescriptionProps {
  deal: any;
  setOpen: (open: boolean) => void;
}

interface DealData {
  addons: any[];
  extras: any[];
  variants: any[];
  price: number;
  discountedPrice?: number;
  image?: string;
  name?: string;
  description?: string;
  id?: string;
}

const DealDescription = ({ deal , setOpen }: ProductDescriptionProps): React.ReactElement => {
 // Fetch product variants
  const getItemById = async (): Promise<DealData> => {
    const res = await apiClient.get(`/deal/${deal.id}/view/customer`);
    return res.data.data;
  };

  const { data, isLoading } = useQuery<DealData>({
    queryKey: ['DealInfo', deal.id],
    queryFn: getItemById,
  });



  const safeData = data || { addons: [], extras: [], variants: [], price: 0 };
  const Addons = safeData.addons;
  const Extras = safeData.extras;
  const Variants = safeData.variants;

  // State management
  const [mainQuantity, setMainQuantity] = useState(1);
  const [addonQuantities, setAddonQuantities] = useState<{ [id: number]: number }>({});
  const [extraQuantities, setExtraQuantities] = useState<{ [id: number]: number }>({});
  const prevMainQuantity = useRef(mainQuantity);
  const { updateDealCart, dineInClose, deliveryClose, pickupClose } = useCartContext();

  // Double/halve addon and extra quantities when mainQuantity changes
  useEffect(() => {
    if (mainQuantity === prevMainQuantity.current) return;

    setAddonQuantities(prev => {
      const newQuantities = { ...prev };
      if (mainQuantity > prevMainQuantity.current) {
        Object.keys(newQuantities).forEach(id => {
          if (newQuantities[Number(id)] > 0) {
            newQuantities[Number(id)] = newQuantities[Number(id)] * 2;
          }
        });
      } else if (mainQuantity < prevMainQuantity.current) {
        Object.keys(newQuantities).forEach(id => {
          if (newQuantities[Number(id)] > 0) {
            newQuantities[Number(id)] = Math.max(1, Math.floor(newQuantities[Number(id)] / 2));
          }
        });
      }
      return newQuantities;
    });

    setExtraQuantities(prev => {
      const newQuantities = { ...prev };
      if (mainQuantity > prevMainQuantity.current) {
        Object.keys(newQuantities).forEach(id => {
          if (newQuantities[Number(id)] > 0) {
            newQuantities[Number(id)] = newQuantities[Number(id)] * 2;
          }
        });
      } else if (mainQuantity < prevMainQuantity.current) {
        Object.keys(newQuantities).forEach(id => {
          if (newQuantities[Number(id)] > 0) {
            newQuantities[Number(id)] = Math.max(1, Math.floor(newQuantities[Number(id)] / 2));
          }
        });
      }
      return newQuantities;
    });

    prevMainQuantity.current = mainQuantity;
  }, [mainQuantity]);

  // Quantity handlers
  const handleMainQuantityIncrease = () => setMainQuantity(q => q + 1);
  const handleMainQuantityDecrease = () => setMainQuantity(q => Math.max(1, q - 1));

  // Addon handlers
  const handleSelectAddon = (id: number) => {
    setAddonQuantities(prev => ({
      ...prev,
      [id]: 1
    }));
  };

  const handleAddonIncrease = (id: number) => {
    setAddonQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 1) + 1
    }));
  };

  const handleAddonDecrease = (id: number) => {
    setAddonQuantities(prev => {
      const newQty = (prev[id] || 1) - 1;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  // Extra handlers
  const handleSelectExtra = (id: number) => {
    setExtraQuantities(prev => ({
      ...prev,
      [id]: 1
    }));
  };

  const handleExtraIncrease = (id: number) => {
    setExtraQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 1) + 1
    }));
  };

  const handleExtraDecrease = (id: number) => {
    setExtraQuantities(prev => {
      const newQty = (prev[id] || 1) - 1;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  // Add helper for addon price
  const getAddonEffectivePrice = (addon: any) => {
    if (
      typeof addon?.discountedPrice === 'number' &&
      typeof addon?.price === 'number' &&
      addon.discountedPrice < addon.price
    ) {
      return addon.discountedPrice;
    }
    return addon?.price;
  };

  // Price calculations
  const totalAddonsPrice = useMemo(() => {
    return Addons.reduce(
      (sum: number, ao: any) => sum + (addonQuantities[ao.id] ? addonQuantities[ao.id] * getAddonEffectivePrice(ao) : 0),
      0
    );
  }, [Addons, addonQuantities]);

  const totalExtrasPrice = useMemo(() => {
    return Extras.reduce(
      (sum: number, ex: any) => sum + (extraQuantities[ex.id] ? extraQuantities[ex.id] * (ex.price || 0) : 0),
      0
    );
  }, [Extras, extraQuantities]);

  // Total price logic: useMemo to always calculate based on latest data
  const totalPrice = useMemo(() => {
    const basePrice = safeData.discountedPrice ?? safeData.price ?? 0;
    const addonsPrice = Addons.reduce((sum: number, ao: any) => sum + ((addonQuantities[ao.id] || 0) * getAddonEffectivePrice(ao)), 0);
    const extrasPrice = Extras.reduce((sum: number, ex: any) => sum + ((extraQuantities[ex.id] || 0) * (ex.price || 0)), 0);
    return (basePrice  * mainQuantity)  + addonsPrice + extrasPrice;
  }, [safeData, Addons, Extras, addonQuantities, extraQuantities, mainQuantity]);

  // Add to cart handler
  const handleAddToCart = () => {
    if (deliveryClose || dineInClose || pickupClose) {
      toast.error(deliveryClose || dineInClose || pickupClose);
      setOpen(false);
      return;
    }

    const allvariant = Variants || [];
    const dealImage = deal?.image;
    const variantTotalPrice = deal?.discountedPrice;
    const variantQuantity = mainQuantity;
    const dealId = deal?.id;

    const addons = Addons?.filter((ao: any) => addonQuantities[ao.id])
      .map((ao: any) => ({
        id: ao.id,
        name: ao.name,
        price: getAddonEffectivePrice(ao),
        quantity: addonQuantities[ao.id]
      })) || [];

    const extras = Extras?.filter((ex: any) => extraQuantities[ex.id])
      .map((ex: any) => ({
        id: ex.id,
        name: ex.name,
        price: ex.price,
        quantity: extraQuantities[ex.id]
      })) || [];

    const dealCartData = {
      allvariant,
      dealImage,
      totalPrice,
      variantTotalPrice,
      variantQuantity,
      dealId,
      addons,
      extras
    };

    updateDealCart(dealCartData);
    setOpen(false);
    toast.success("Item added to cart!");
  };

  return (
    <>
      {isLoading ? (
        <ProductDescriptionSkelton />
      ) : (
        <article className={`flex w-full sm:w-[37em] flex-col lg:flex-col shadow-lg rounded-2xl overflow-scroll overflow-x-hidden productdetail pb-[5em] ${designVar.fontFamily}`}>
          {/* Product Image */}
          <div className="w-full lg:w-full flex flex-col">
            <div className="relative w-full h-[25em] overflow-hidden rounded-xl flex justify-center items-center">
              <img 
                src={deal.image} 
                alt={deal.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            
            <div className="w-full p-4 mt-[1em]">
              <div className="flex justify-between items-start bg-white p-2 rounded-md shadow-xl">
                <div>
                  <h1 className="text-[20px] font-bold text-gray-800">{deal.name}</h1>
                  {deal.description && (
                    <p className="mt-2 text-gray-600 max-w-2xl text-[14px]">{deal.description}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Variants */}
            <div className="w-full pb-2 pt-1">
              {Variants?.length > 0 && (
                <div className="mt-6 px-4 w-full">
                  <div className="inline-flex items-center text-sm lg:text-md font-bold text-gray-700 mb-4">
                    <span className="bg-orange-500 px-4 py-1 rounded-lg">Included in this Deal</span>
                  </div>
                  <div className="flex flex-col gap-3 mt-3 bg-gray-100 p-2 rounded-md w-full">
                    {Variants?.map((v: any) => (
                      <div
                        key={v.id}
                        className="p-3 rounded-xl border border-gray-200 bg-white flex items-center justify-between w-full"
                      >
                        <div className="flex items-center w-full">
                          <img
                            src={v?.image}
                            alt={v?.name}
                            className="w-8 h-8 rounded-md object-cover mr-3"
                          />
                          <div>
                            <span className="font-medium hidden sm:block">{v?.name?.slice(0, 28)} x {v?.quantity} ...</span>
                            <span className="text-[13px] block sm:hidden">{v?.name?.slice(0, 13)} x  {v?.quantity}  ...</span>
                          </div>
                        </div>
                        <div className="text-right w-full">
                          <span className="text-[12px] sm:text-[15px] font-normal text-gray-700 whitespace-nowrap">
                            {formatPrice(v?.price * v.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
    
          {/* Product Details */}
          <div className="w-ful flex flex-col">
            <div className=" space-y-8 overflow-y-auto flex-1">
              <div className=" px-5 hover:shadow-lg transition-all bg-white">
                {/* Addons */}
                {Addons.length > 0 && (
                  <div className="mt-5">
                    <div className="inline-flex items-center text-sm lg:text-md font-bold text-gray-700 mb-4">
                      <span className="bg-black text-white px-3 py-1 rounded-l-lg">More</span>
                      <span className="bg-orange-500 px-4 py-1 rounded-r-lg">Select Addons</span>
                    </div>
                    <div className="flex flex-col gap-3 mt-3 bg-gray-100 p-2 rounded-md">
                      {Addons.map((ao: any) => {
                        const qty = addonQuantities[ao.id] || 0;
                        const selected = qty > 0;
                        const showDiscount = typeof ao.discountedPrice === 'number' && typeof ao.price === 'number' && ao.discountedPrice < ao.price;
                        return (
                          <div
                            key={ao.id}
                            className={`p-3 rounded-xl border transition-all cursor-pointer ${
                              selected ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-white"
                            } hover:bg-gray-50`}
                            onClick={() => !selected && handleSelectAddon(ao.id)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                  selected ? "bg-orange-500 border-orange-500" : "bg-white border-gray-300"
                                }`}>
                                  {selected && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <span className="font-medium hidden sm:block">{(ao.name).slice(0, 30)}...</span>
                                <span className="text-[13px] block sm:hidden">{(ao.name).slice(0, 12)}...</span>
                              </div>
                              {showDiscount ? (
                                <>
                                  <span className="text-[12px] sm:text-[15px]">+{`(${formatPrice(ao.discountedPrice)})`}</span>
                                  <span className="line-through text-orange-500 text-[11px] ml-1">{formatPrice(ao.price)}</span>
                                </>
                              ) : (
                                <span className="text-[12px] sm:text-[15px]">+{`(${formatPrice(ao.price)})`}</span>
                              )}
                              {selected && (
                                <div className="flex items-center gap-2 " onClick={e => e.stopPropagation()}>
                                  <button
                                    className=" w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
                                    onClick={() => handleAddonDecrease(ao.id)}
                                  >
                                    −
                                  </button>
                                  <span className=" w-6 sm:w-6 text-center text-gray-800 font-semibold">{qty}</span>
                                  <button
                                    className=" w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
                                    onClick={() => handleAddonIncrease(ao.id)}
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
    
                {/* Extras */}
                {Extras?.length > 0 && (
                  <div className="mt-6">
                    <div className="inline-flex items-center text-sm lg:text-md font-bold text-gray-700 mb-4">
                      <span className="bg-black text-white px-3 py-1 rounded-l-lg">More</span>
                      <span className="bg-orange-500 px-4 py-1 rounded-r-lg">Select Extras</span>
                    </div>
                    <div className="flex flex-col gap-3 mt-3 bg-gray-100 p-2 rounded-md">
                      {Extras.map((ex: any) => {
                        const qty = extraQuantities[ex.id] || 0;
                        const selected = qty > 0;
                        return (
                          <div
                            key={ex.id}
                            className={`p-3 rounded-xl border transition-all cursor-pointer ${
                              selected ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-white"
                            } hover:bg-gray-50`}
                            onClick={() => !selected && handleSelectExtra(ex.id)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                  selected ? "bg-orange-500 border-orange-500" : "bg-white border-gray-300"
                                }`}>
                                  {selected && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-[13px] hidden sm:block sm:font-medium">{(ex.name).slice(0, 30)}...</span>
                                <span className="text-[13px] block sm:hidden sm:font-medium">{(ex.name).slice(0, 12)}...</span>
                              </div>
                              <span className=" text-[10px] sm:text-[15px]">
                                +{`(${formatPrice(ex.price)})`}
                              </span>
                            {selected && (
                              <div className="flex items-center gap-2 " onClick={e => e.stopPropagation()}>
                                <button
                                  className=" w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
                                  onClick={() => handleExtraDecrease(ex.id)}
                                >
                                  −
                                </button>
                                <span className=" w-4 sm:w-6 text-center text-gray-800 font-semibold">{qty}</span>
                                <button
                                  className=" w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
                                  onClick={() => handleExtraIncrease(ex.id)}
                                >
                                  +
                                </button>
                              </div>
                            )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer with quantity and add to cart */}
             <div className="w-full absolute bottom-[0.3em] rounded-xl left-0 p-4 bg-white shadow-xl shadow-gray-300 flex flex-row-reverse justify-between items-center">
            <button
              className={`w-[13em] sm:w-[17em] py-2 text-white font-bold rounded-xl transition-all flex justify-between items-center
                bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl px-[1em]`}
              onClick={handleAddToCart}
            >
              <span className=" text-[14px] sm:text-[16px] font-semibold rounded-md">Add to Cart</span>
              <span className="rounded-md  text-[12px]  sm:text-[16px]">
                {formatPrice(totalPrice)}
              </span>
            </button>

            <div className="flex items-center  flex-row-reverse">
              <button
                className=" w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
                onClick={handleMainQuantityIncrease}
              >
                +
              </button>
              <span className=" w-6 sm:w-8 text-center text-gray-800 font-semibold">
                {mainQuantity}
              </span>
              <button
                className=" w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
                onClick={handleMainQuantityDecrease}
                disabled={mainQuantity === 1}
              >
                −
              </button>
            </div>
          </div>
          </div>
        </article>
      )}
    </>
  );
};

export default DealDescription;
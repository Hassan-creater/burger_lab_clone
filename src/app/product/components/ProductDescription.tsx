
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useCartContext } from "@/context/context";
import { formatPrice } from "@/lib/utils";
import { Item } from "@/models/Item";
import ProductDescriptionSkelton from "@/components/ui/productDescriptionSkelton";
import { designVar } from "@/designVar/desighVar";
import { toast } from "sonner";
import Image from "next/image";
interface ProductDescriptionProps {
  product: Item;
  setOpen?: (open: boolean) => void;
}

const ProductDescription = ({ product , setOpen }: ProductDescriptionProps) => {

  const { updateCart , dineInClose , pickupClose , deliveryClose } = useCartContext();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showMessage, setShowMessage] = useState('');


  
  // State management
  const [variantQtys, setVariantQtys] = useState<Record<string, number>>({});
  const [addonQtys, setAddonQtys] = useState<Record<string, Record<string, number>>>({});
  const [extraQtys, setExtraQtys] = useState<Record<string, Record<string, number>>>({});
  // const [selectedAddons, setSelectedAddons] = useState<Record<string, Set<string>>>({});
  // const [selectedExtras, setSelectedExtras] = useState<Record<string, Set<string>>>({});
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);

  // Fetch product variants
  const getItemById = async () => {
    const res = await apiClient.get(`/item/${product.id}/view/customer`);
    return res.data;
  };

  const { data , isLoading } = useQuery({
    queryKey: ['ItemId', product.id],
    queryFn: getItemById,
  });

 

  const variants = data?.data?.item?.variants;



  // Set default variant and quantity to 1, and initialize addon/extra qtys
  useEffect(() => {
    if (variants && variants.length > 0) {
      const firstVariantId = variants[0]?.id;
      setSelectedVariantId(firstVariantId);
      // Set default quantity to 1 for all variants
      const initialQtys: Record<string, number> = {};
      const initialAddonQtys: Record<string, Record<string, number>> = {};
      const initialExtraQtys: Record<string, Record<string, number>> = {};
      variants.forEach((v: any) => {
        initialQtys[v?.id] = 1;
        initialAddonQtys[v?.id] = {};
        (v?.addons || []).forEach((ao: any) => {
          initialAddonQtys[v?.id][ao?.id] = 0;
        });
        initialExtraQtys[v?.id] = {};
        (v?.extras || []).forEach((ex: any) => {
          initialExtraQtys[v?.id][ex?.id] = 0;
        });
      });
      setVariantQtys(initialQtys);
      setAddonQtys(initialAddonQtys);
      setExtraQtys(initialExtraQtys);
    }
  }, [variants]);

  const selectedVariant = variants?.find((v: any) => v?.id === selectedVariantId);

  // Quantity handlers - only update UI state
  const changeVariantQty = (variantId: string, delta: number) => {
    setVariantQtys((prev) => {
      const currentQty = prev[variantId] || 1;
      const newQty = Math.max(1, currentQty + delta); // Minimum quantity is 1
      return { ...prev, [variantId]: newQty };
    });
  };

  // Handlers for addon/extra quantity
  const changeAddonQty = (variantId: string, addonId: string, delta: number) => {
    setAddonQtys(prev => {
      const prevQty = prev[variantId]?.[addonId] || 0;
      const newQty = Math.max(0, prevQty + delta);
      return {
        ...prev,
        [variantId]: {
          ...prev[variantId],
          [addonId]: newQty,
        },
      };
    });
  };
  const changeExtraQty = (variantId: string, extraId: string, delta: number) => {
    setExtraQtys(prev => {
      const prevQty = prev[variantId]?.[extraId] || 0;
      const newQty = Math.max(0, prevQty + delta);
      return {
        ...prev,
        [variantId]: {
          ...prev[variantId],
          [extraId]: newQty,
        },
      };
    });
  };

  // // Addon/Extra handlers
  // const toggleAddon = (variantId: string, addonId: string) => {
  //   setSelectedAddons(prev => {
  //     const newSet = new Set(prev[variantId] || []);
  //     if (newSet.has(addonId)) newSet.delete(addonId);
  //     else newSet.add(addonId);
  //     return { ...prev, [variantId]: newSet };
  //   });
  // };

  // const toggleExtra = (variantId: string, extraId: string) => {
  //   setSelectedExtras(prev => {
  //     const newSet = new Set(prev[variantId] || []);
  //     if (newSet.has(extraId)) newSet.delete(extraId);
  //     else newSet.add(extraId);
  //     return { ...prev, [variantId]: newSet };
  //   });
  // };

  // Helper function to get the correct price
  const getEffectivePrice = (variant: any) => {
    
    if (
      typeof variant?.discountedPrice === 'number' &&
      typeof variant?.price === 'number' &&
      variant?.discountedPrice < variant?.price && variant?.discountedPrice != 0
    ) {
     
      return variant?.discountedPrice;
    }

    return variant?.price || 0;
  };

  // Helper for addon price
  const getAddonEffectivePrice = (addon: any) => {
    if (
      typeof addon?.discountedPrice === 'number' &&
      typeof addon?.price === 'number' &&
      addon?.discountedPrice < addon?.price && addon?.discountedPrice != 0
    ) {
      return addon?.discountedPrice;
    }
    return addon?.price || 0;
  };

  // Helper for extra price (same logic as addon)
  const getExtraEffectivePrice = (extra: any) => {
    if (
      typeof extra?.discountedPrice === 'number' &&
      typeof extra?.price === 'number' &&
      extra?.discountedPrice < extra?.price && extra?.discountedPrice != 0
    ) {
      return extra?.discountedPrice;
    }
    return extra?.price || 0;
  };

  // Calculate variant total price (use actual addon/extra qtys)
  const computeVariantTotal = (variant: any) => {
  
    const qty = variantQtys[variant?.id] || 1;
    const basePrice = getEffectivePrice(variant) * qty;
    let total = basePrice;
    const addonQtyMap = addonQtys[variant?.id] || {};
    (variant?.addons || []).forEach((ao: any) => {
      const addonQty = addonQtyMap[ao?.id] || 0;
      total += getAddonEffectivePrice(ao) * addonQty;
    });
    const extraQtyMap = extraQtys[variant?.id] || {};
    (variant?.extras || []).forEach((ex: any) => {
      const extraQty = extraQtyMap[ex?.id] || 0;
      total += getExtraEffectivePrice(ex) * extraQty;
    });

    return isNaN(total) ? 0 : total;
  };

  // Add to cart as new item (use actual addon/extra qtys)
  const addToCart = (variant: any) => {
    const qty = variantQtys[variant?.id] || 1;
    const addons = Object.entries(addonQtys[variant?.id] || {})
      .filter(([_, q]) => q > 0)
      .map(([id, q]) => ({ id, quantity: q }));
    const extras = Object.entries(extraQtys[variant?.id] || {})
      .filter(([_, q]) => q > 0)
      .map(([id, q]) => ({ id, quantity: q }));
    const newItem = {
      variant,
      quantity: qty,
      addons,
      extras,
    };
    setCartItems(prev => [...prev, newItem]);
    setVariantQtys(prev => ({ ...prev, [variant?.id]: 1 }));
    setAddonQtys(prev => ({ ...prev, [variant?.id]: Object.fromEntries(Object.keys(prev[variant?.id] || {}).map(id => [id, 0])) }));
    setExtraQtys(prev => ({ ...prev, [variant?.id]: Object.fromEntries(Object.keys(prev[variant?.id] || {}).map(id => [id, 0])) }));
    setShowMessage(`${variant?.name} added to cart!`);
    setTimeout(() => setShowMessage(''), 3000);
  };

  // Handle add to cart button click
  const handleAddToCartClick = () => {
    if (!selectedVariant) return;
    addToCart(selectedVariant);
  };

  // Prepare cart payload for context
  const cartPayload = useMemo(() => {
    return cartItems.map(item => {
      const basePrice = getEffectivePrice(item?.variant) * item?.quantity;
    
      const addons = (item?.addons || []).map((ao: any) => {
        const addonData = item?.variant?.addons?.find((a: any) => a?.id === ao?.id);
        return {
          id: ao?.id,
          name: addonData?.name || "Unknown Addon",
          price: getAddonEffectivePrice(addonData) || 0,
          quantity: ao?.quantity,
        };
      });
    
      const extras = (item?.extras || []).map((exItem: any) => {
        const extraDef = item?.variant?.extras?.find((e: any) => e?.id === exItem?.id);
        const unitPrice = getExtraEffectivePrice(extraDef);
        return {
          id: exItem?.id,
          name: extraDef?.name || "Unknown Extra",
          price: unitPrice,
          quantity: exItem?.quantity,
        };
      });
    
      const addonsTotal = addons.reduce((sum: number, ao: any) => sum + ao.price * ao.quantity, 0);
      const extrasTotal = extras.reduce((sum: number, ex: any) => sum + ex.price * ex.quantity, 0);
      const totalPrice = basePrice + addonsTotal + extrasTotal;
    
      return {
        itemImage: product?.image,
        variantId: item?.variant?.id,
        variantName: item?.variant?.name,
        variantPrice: getEffectivePrice(item?.variant),
        quantity: item?.quantity,
        totalPrice,
        addons,
        extras,
      };
    });
  }, [cartItems, product]);



  // Update cart context
  const prevPayloadRef = useRef<string | null>(null);
  useEffect(() => {
    const serialized = JSON.stringify(cartPayload);
    if (serialized !== prevPayloadRef.current) {
      updateCart(cartPayload);
      setCartItems([]); // 👈 CLEAR cartItems after updating
  
      prevPayloadRef.current = serialized;
    }
  }, [cartPayload, updateCart]);


// skelton loader
  const loading =  <article className="flex w-full h-full flex-col rounded-2xl overflow-y-scroll overflow-x-hidden bg-white shadow-lg pb-[3em] animate-pulse">
  {/* Top Section */}
  <div className="w-full flex flex-col">
    <div className="w-full p-4 mt-[1em]">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="mt-2 h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
    <div className="relative w-[95%] mx-auto h-[20em] overflow-hidden rounded-xl bg-gray-200"></div>

    {/* Variants Placeholder */}
    <div className="mt-8 px-4">
      <div className="h-6 w-48 bg-gray-200 rounded mb-3"></div>
      <div className="flex flex-col gap-3 bg-gray-100 p-2 rounded-lg">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-3 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-md mr-3"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Bottom Section */}
  <div className="w-full flex flex-col p-4 mt-6">
    <div className="space-y-8 overflow-y-auto flex-1">
      {[...Array(2)].map((_, section) => (
        <div key={section} className="py-5 bg-white rounded-lg">
          {/* Section Header */}
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="flex flex-col gap-3 bg-gray-100 p-2 rounded-lg">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="p-3 rounded-xl border bg-white flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Fixed Footer */}
    <div className="w-full fixed bottom-0 left-0 p-4 bg-white shadow-xl flex justify-between items-center rounded-t-xl">
      <div className="h-10 bg-gray-200 rounded w-32"></div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="h-6 bg-gray-200 rounded w-8"></div>
        <div className="h-6 bg-gray-200 rounded w-8"></div>
      </div>
    </div>
  </div>
</article>

  

  return (
    <>
    {
      isLoading ? // skelton loader 
        loading : 
    // product description
    <article className={`flex w-full sm:w-[37em]  flex-col lg:flex-col shadow-lg rounded-2xl overflow-scroll overflow-x-hidden productdetail pb-[5em] ${designVar.fontFamily}`}>
      {/* Left - Product Image & Variants */}
      <div className="w-full  lg:w-full flex flex-col  ">
        {/* Product Image */}
        <div className="w-full p-4 mt-[1em]">
      <div className="flex justify-between items-start bg-white p-2 rounded-md">
        <div>
          <h1 className="text-[20px] font-bold text-gray-800">{product.name}</h1>
          {product.description && (
            <div>
              <p
                className={`mt-2 text-gray-600 max-w-2xl text-[14px] ${
                  expanded ? "" : "line-clamp-2"
                }`}
              >
                {product.description}
              </p>
              {product.description.length > 80 && ( // Adjust character threshold as needed
                <button
                  className="text-blue-500 mt-1 text-[12px] underline focus:outline-none"
                  onClick={toggleExpand}
                >
                  {expanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

        <div className="relative w-[95%] mx-auto h-[20em] overflow-hidden rounded-xl flex justify-center items-center ">
       <Image 
         src={product.image} 
         alt={product.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        onError={e => {
          const target = e.currentTarget as HTMLImageElement;
          if (target.src !== "/logo-symbol-2.png") {
         target.src = "/logo-symbol-2.png";
          }
          }}
       />
      </div>
        
       
        
        
        {/* Variant Selector */}
        <div className="mt-8 px-4 relative ">
        <div className="z-0 relative -mb-3 flex justify-start">
                  <span className="bg-orange-500 px-6 py-2 pb-4 rounded-t-lg text-white text-sm  lg:text-md font-[600] shadow-md ">
                    Select Variants
                  </span>
                </div>
          
          <div className="flex justify-start  gap-3 bg-white border border-gray-200  p-2 rounded-lg z-10 relative overflow-x-scroll no-scrollbar">
            {variants?.map((v: any) => {
              const isActive = v?.id === selectedVariantId;
              const showDiscount = typeof v.discountedPrice === 'number' && typeof v.price === 'number' && v.discountedPrice < v.price && v.discountedPrice != 0;
            
              return (
                <div key={v?.id} className="relative flex flex-col items-center group shrink-0">
                  <button
                    onClick={() => setSelectedVariantId(v?.id)}
                    className={`
                      flex flex-col items-center p-2 rounded-xl transition-all duration-300
                       border-2 w-[8em] h-[10em]
                      ${isActive 
                        ? 'border-orange-500 bg-orange-50 shadow-md' 
                        : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'}
                      overflow-hidden
                    `}
                  >
                    <div className="relative rounded-lg overflow-hidden mb-1">
                      <Image 
                        src={v?.image} 
                        alt={v?.name} 
                        className="w-full h-20 object-cover" 
                        onError={e => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.src !== "/logo-symbol-2.png") {
                         target.src = "/logo-symbol-2.png";
                          }
                          }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg" />
                      
                      {isActive && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <span className="text-[12px] font-medium text-gray-700 b h-1/2 flex justify-center items-center">
                      {(v?.name).slice(0, 15)}...
                    </span>
                    <div className={`
                     rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1
                    ${isActive 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300'}
                    shadow-sm
                  `}>
                    {showDiscount ? (
                      <>
                        <span>{formatPrice(v?.discountedPrice)}</span>
                      </>
                    ) : (
                      <span>{formatPrice(v?.price)}</span>
                    )}
                    </div>
                    {showDiscount && (
                      <span className="line-through text-orange-500 text-[11px] mr-1">{formatPrice(v?.price)}</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    
      {/* Right - Product Details */}
      <div className="w-ful flex flex-col ">
        {selectedVariant && (
          <div className=" space-y-8 overflow-y-auto flex-1">
            <div className="  p-5 hover:shadow-lg transition-all bg-white">
               {/* Addons */}
             {selectedVariant.addons?.filter((ao: any) => 
               ao !== null && 
               ao?.id && 
               ao?.name && 
               ao?.price > 0
             ).length > 0 && (
                <div className="mt-6 relative">
                    <div className="z-0 relative flex justify-start pb-2">
                  <span className="bg-orange-500 px-7 py-2 pb-4 rounded-t-lg text-white text-sm  lg:text-md font-[600] shadow-md ">
                    Select Addons
                  </span>
                </div>
                <div className="flex flex-col gap-3 bg-white rounded-lg p-2 relative z-10 -mt-4">
  {selectedVariant.addons
    .filter((ao: any) =>
      ao &&
      ao.id &&
      ao.name &&
      ao.price > 0
    )
    .map((ao: any) => {
      const qty = addonQtys[selectedVariant.id]?.[ao.id] || 0;
      const selected = qty > 0;
      const showDiscount =
        typeof ao.discountedPrice === 'number' &&
        ao.discountedPrice < ao.price && ao.discountedPrice != 0;

      return (
        <div
          key={ao.id}
          className={`p-3 rounded-full border transition-all bg-white flex items-center justify-between ${
            selected
              ? 'border-orange-500'
              : 'border-gray-200 hover:border-gray-300 '
          } cursor-pointer`}
          onClick={() => {
            if (selected) {
              // Uncheck: reset quantity to zero
              changeAddonQty(selectedVariant.id, ao.id, -qty);
            } else {
              // Check: add one
              changeAddonQty(selectedVariant.id, ao.id, 1);
            }
          }}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                selected
                  ? 'bg-orange-500 border-orange-500'
                  : 'border-gray-300'
              }`}
            >
              {selected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1
                       0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8
                       12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="font-medium hidden sm:block">
              {ao.name.slice(0, 30)}...
            </span>
            <span className="text-[13px] block sm:hidden">
              {ao.name.slice(0, 11)}...
            </span>
          </div>
          <div className="flex items-center gap-2">
            {showDiscount ? (
              <>
                <span className="text-[12px] sm:text-[15px]">
                  +({formatPrice(ao.discountedPrice)})
                </span>
                <span className="line-through text-orange-500 text-[11px] ml-1">
                  {formatPrice(ao.price)}
                </span>
              </>
            ) : (
              <span className="text-[12px] sm:text-[15px]">
                +({formatPrice(ao.price)})
              </span>
            )}
            {selected && (
              <div className="flex gap-2 p-1 rounded-full justify-center items-center border border-slate-300">
                <button
                  className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-black font-bold hover:bg-orange-600 hover:text-white cursor-pointer transition-colors"
                  onClick={e => {
                    e.stopPropagation();
                    // Decrease by 1
                    changeAddonQty(selectedVariant.id, ao.id, -1);
                  }}
                >
                  −
                </button>
                <span className="text-gray-800 text-[13px] font-semibold">
                  {qty}
                </span>
                <button
                  className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
                  onClick={e => {
                    e.stopPropagation();
                    // Increase by 1
                    changeAddonQty(selectedVariant.id, ao.id, 1);
                  }}
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
             {selectedVariant.extras?.filter((ex: any) => 
               ex !== null && 
               ex?.id && 
               ex?.name && 
               ex?.price > 0
             ).length > 0 && (
                <div className="mt-5 relative">
                  <div className="z-0 relative flex justify-start pb-2">
                  <span className="bg-orange-500 px-7 py-2 pb-4 rounded-t-lg text-white text-sm  lg:text-md font-[600] shadow-md ">
                    Select Extras
                  </span>
                </div>
                <div className="flex flex-col gap-3 bg-white rounded-lg p-2 relative z-10 -mt-4">
  {selectedVariant.extras
    .filter((ex: any) =>
      ex &&
      ex.id &&
      ex.name &&
      ex.price > 0
    )
    .map((ex: any) => {
      const qty      = extraQtys[selectedVariant.id]?.[ex.id] || 0;
      const selected = qty > 0;
      const showDiscount =
        typeof ex.discountedPrice === 'number' &&
        ex.discountedPrice < ex.price && ex.discountedPrice != 0;

      return (
        <div
          key={ex.id}
          className={`p-3 rounded-full border transition-all bg-white flex items-center justify-between ${
            selected
              ? 'border-orange-500'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          } cursor-pointer`}
          onClick={() => {
            if (selected) {
              // Uncheck: reset to zero
              changeExtraQty(selectedVariant.id, ex.id, -qty);
            } else {
              // Check: add one
              changeExtraQty(selectedVariant.id, ex.id, 1);
            }
          }}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                selected
                  ? 'bg-orange-500 border-orange-500'
                  : 'border-gray-300'
              }`}
            >
              {selected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1
                       0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8
                       12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="font-medium hidden sm:block">
              {ex.name.slice(0, 30)}…
            </span>
            <span className="text-[13px] block sm:hidden">
              {ex.name.slice(0, 12)}…
            </span>
          </div>
          <div className="flex items-center gap-2">
            {showDiscount ? (
              <>
                <span className="text-[12px] sm:text-[15px]">
                  +({formatPrice(ex.discountedPrice)})
                </span>
                <span className="line-through text-orange-500 text-[11px] ml-1">
                  {formatPrice(ex.price)}
                </span>
              </>
            ) : (
              <span className="text-[12px] sm:text-[15px]">
                +({formatPrice(getExtraEffectivePrice(ex))})
              </span>
            )}
            {selected && (
              <div className="flex gap-2 border border-slate-300 justify-center items-center rounded-full p-1">
                <button
                  className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-black font-bold hover:bg-orange-600 hover:text-white cursor-pointer transition-colors"
                  onClick={e => {
                    e.stopPropagation();
                    changeExtraQty(selectedVariant.id, ex.id, -1);
                  }}
                >
                  −
                </button>
                <span className="text-gray-800 text-[13px] font-semibold">
                  {qty}
                </span>
                <button
                  className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
                  onClick={e => {
                    e.stopPropagation();
                    changeExtraQty(selectedVariant.id, ex.id, 1);
                  }}
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
          
        )}
    
        {/* Total Price & Add to Cart */}
        <div className="w-full fixed bottom-0 rounded-xl p-4 left-0 bg-white shadow-xl shadow-gray-300 flex flex-row-reverse justify-between items-center mt-auto z-20">
          <button
            onClick={() => {
              if(dineInClose || pickupClose || deliveryClose){
                toast.error(dineInClose || pickupClose || deliveryClose);
                return;
              }
                handleAddToCartClick();
                setOpen && setOpen(false);
            }}
            className={`w-[13em] sm:w-[17em] py-2 text-white font-bold rounded-xl transition-all flex justify-between items-center
              bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl px-[1em]`}
          >
            <span className=" text-[14px] sm:text-[16px] font-semibold  rounded-md">Add to Cart</span>  <span className="text-[12px]  sm:rounded-md">
                {selectedVariant ? formatPrice(computeVariantTotal(selectedVariant)) : formatPrice(0)}
              </span>
          </button>


          <div className="flex items-center border border-slate-300 rounded-lg p-2 ">
  <button 
    onClick={() => changeVariantQty(selectedVariant?.id, -1)} 
    className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-black hover:text-white cursor-pointer border border-slate-300 font-bold hover:bg-orange-600 transition-colors shadow-sm "
  >
    −
  </button>
  
  <span className="w-6 sm:w-10 text-center text-gray-800 font-semibold">
    {variantQtys[selectedVariant?.id] || 1}
  </span>
  
  <button 
    onClick={() => changeVariantQty(selectedVariant?.id, 1)} 
    className=" w-6 h-6 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg- text-black border border-slate-300 font-bold hover:bg-orange-600 hover:text-white cursor-pointer transition-colors shadow-sm "
  >
    +
  </button>
</div>

            
          </div>
      </div>
    </article>

    }
    
    
    </>
  );
};

export default ProductDescription;
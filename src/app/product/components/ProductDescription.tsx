
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
  const [selectedAddons, setSelectedAddons] = useState<Record<string, Set<string>>>({});
  const [selectedExtras, setSelectedExtras] = useState<Record<string, Set<string>>>({});
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

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

  // Set default variant and quantity to 1
  useEffect(() => {
    if (variants && variants.length > 0) {
      const firstVariantId = variants[0].id;
      setSelectedVariantId(firstVariantId);
      
      // Set default quantity to 1 for all variants
      const initialQtys: Record<string, number> = {};
      variants.forEach((v: any) => {
        initialQtys[v.id] = 1;
      });
      setVariantQtys(initialQtys);
    }
  }, [variants]);

  const selectedVariant = variants?.find((v: any) => v.id === selectedVariantId);

  // Quantity handlers - only update UI state
  const changeVariantQty = (variantId: string, delta: number) => {
    setVariantQtys((prev) => {
      const currentQty = prev[variantId] || 1;
      const newQty = Math.max(1, currentQty + delta); // Minimum quantity is 1
      return { ...prev, [variantId]: newQty };
    });
  };

  // Addon/Extra handlers
  const toggleAddon = (variantId: string, addonId: string) => {
    setSelectedAddons(prev => {
      const newSet = new Set(prev[variantId] || []);
      if (newSet.has(addonId)) newSet.delete(addonId);
      else newSet.add(addonId);
      return { ...prev, [variantId]: newSet };
    });
  };

  const toggleExtra = (variantId: string, extraId: string) => {
    setSelectedExtras(prev => {
      const newSet = new Set(prev[variantId] || []);
      if (newSet.has(extraId)) newSet.delete(extraId);
      else newSet.add(extraId);
      return { ...prev, [variantId]: newSet };
    });
  };

  // Calculate variant total price
  const computeVariantTotal = (variant: any) => {
    const qty = variantQtys[variant?.id] || 1;
    
    let total = variant?.price * qty;
    
    const addons = selectedAddons[variant?.id] || new Set();
    addons.forEach(addonId => {
      const addon = variant?.addons?.find((ao: any) => ao.id === addonId);
      if (addon) total += addon.price * qty;
    });
    
    const extras = selectedExtras[variant?.id] || new Set();
    extras.forEach(extraId => {
      const extra = variant?.extras?.find((ex: any) => ex.id === extraId);
      if (extra) total += extra.price * qty;
    });
    
    return total;
  };

  // Add to cart as new item
  const addToCart = (variant: any) => {
    const qty = variantQtys[variant?.id] || 1;
    
    const addons = Array.from(selectedAddons[variant?.id] || []).map(addonId => ({
      id: addonId,
      quantity: qty
    }));
    
    const extras = Array.from(selectedExtras[variant?.id] || []).map(extraId => ({
      id: extraId,
      quantity: qty
    }));
    
    const newItem = {
      variant,       // Contains variant data
      quantity: qty, // Quantity for THIS item
      addons,        // Addons specific to THIS item
      extras         // Extras specific to THIS item
    };
  
    // ✅ Always adds a NEW entry to the cart array
    setCartItems(prev => [...prev, newItem]);
    setVariantQtys(prev => ({ ...prev, [variant?.id]: 1 })); // Reset quantity to 1
 setSelectedAddons(prev => ({ ...prev, [variant?.id]: new Set() }));
setSelectedExtras(prev => ({ ...prev, [variant?.id]: new Set() }));
    
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
      const basePrice = item?.variant?.price * item?.quantity;
    
      const addons = (item?.addons || []).map((ao: any) => {
        const addonData = item?.variant?.addons?.find((a: any) => a.id === ao.id);
        return {
          id: ao.id,
          name: addonData?.name || "Unknown Addon",
          price: addonData?.price || 0,
          quantity: ao.quantity,
        };
      });
    
      const extras = (item?.extras || []).map((exItem: any) => {
        const extraDef = item?.variant?.extras?.find((e: any) => e.id === exItem.id);
        const unitPrice = extraDef?.priceDifference ?? extraDef?.price ?? 0;
        return {
          id: exItem.id,
          name: extraDef?.name || "Unknown Extra",
          price: unitPrice,
          quantity: exItem.quantity,
        };
      });
    
      const addonsTotal = addons.reduce((sum: number, ao: any) => sum + ao.price * ao.quantity, 0);
      const extrasTotal = extras.reduce((sum: number, ex: any) => sum + ex.price * ex.quantity, 0);
      const totalPrice = basePrice + addonsTotal + extrasTotal;
    
      return {
        itemImage: product.image,
        variantId: item?.variant?.id,
        variantName: item?.variant?.name,
        variantPrice: item?.variant?.price,
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

  

  return (
    <>
    {
      isLoading ? // skelton loader 
        <ProductDescriptionSkelton/> : 

    // product description
    <article className={`flex w-full  flex-col lg:flex-col shadow-lg rounded-2xl overflow-scroll overflow-x-hidden productdetail pb-[5em] ${designVar.fontFamily}`}>
      {/* Left - Product Image & Variants */}
      <div className="w-full  lg:w-full flex flex-col  ">
        {/* Product Image */}
        <div className="relative w-full h-[25em] overflow-hidden rounded-xl flex justify-center items-center">
       <img 
         src={product.image} 
         alt={product.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
       />
      </div>
        
        <div className="w-full p-4 mt-[1em]">
        <div className="flex justify-between items-start bg-white p-2 rounded-md shadow-xl">
          <div>
            <h1 className="text-[20px] font-bold text-gray-800">{product.name}</h1>
            {product.description && (
              <p className="mt-2 text-gray-600 max-w-2xl text-[14px]">{product.description}</p>
            )}
          </div>
        </div>
        </div>
        
        
        {/* Variant Selector */}
        <div className="mt-6 px-4 ">
          <div className="inline-flex items-center text-sm lg:text-md font-bold text-gray-700 mb-3">
            <span className="bg-black text-white px-3 py-1 rounded-l-lg">More</span>
            <span className="bg-orange-500 px-4 py-1 rounded-r-lg">Select Variant</span>
          </div>
          
          <div className="flex space-x-3  overflow-x-auto pb-2 pt-1 no-scrollbar">
            {variants?.map((v: any) => {
              const isActive = v.id === selectedVariantId;
              return (
                <div key={v.id} className="relative flex flex-col items-center group shrink-0">
                  <button
                    onClick={() => setSelectedVariantId(v.id)}
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
                      <img 
                        src={v.image} 
                        alt={v.name} 
                        className="w-full h-20 object-cover" 
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
                      {(v.name).slice(0, 25)}...
                    </span>
                    <div className={`
                     rounded-full px-2 py-0.5 text-xs font-bold
                    ${isActive 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300'}
                    shadow-sm
                  `}>
                    {formatPrice(v.price)}
                  </div>
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
          <div className="mt-6 space-y-8 overflow-y-auto flex-1">
            <div className="border  p-5 hover:shadow-lg transition-all bg-white">
               {/* Addons */}
              {selectedVariant.addons?.length > 0 && (
                <div className="mt-5">
                  <div className="inline-flex items-center text-sm lg:text-md font-bold text-gray-700 mb-4">
                    <span className="bg-black text-white px-3 py-1 rounded-l-lg">More</span>
                    <span className="bg-orange-500 px-4 py-1 rounded-r-lg">Select Addons</span>
                  </div>
                  <div className="flex flex-col  gap-3 mt-3 bg-gray-100 p-2 rounded-md">
                    {selectedVariant.addons.map((ao: any) => (
                      <div 
                        key={ao.id} 
                        className={`p-3 rounded-xl border transition-all cursor-pointer bg-white
                          ${selectedAddons[selectedVariant.id]?.has(ao.id) 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                        onClick={() => toggleAddon(selectedVariant.id, ao.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3
                              ${selectedAddons[selectedVariant.id]?.has(ao.id) 
                                ? 'bg-orange-500 border-orange-500' 
                                : 'border-gray-300'}`}
                            >
                              {selectedAddons[selectedVariant.id]?.has(ao.id) && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="font-medium">{(ao.name).slice(0, 30)}...</span>
                          </div>
                          <span className="text-[15px]">
                            +{`(${formatPrice(ao.price)})`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
    
              {/* Extras */}
              {selectedVariant.extras?.length > 0 && (
                <div className="mt-6">
                  <div className="inline-flex items-center text-sm lg:text-md font-bold text-gray-700 mb-4">
                    <span className="bg-black text-white px-3 py-1 rounded-l-lg">More</span>
                    <span className="bg-orange-500 px-4 py-1 rounded-r-lg">Select Extras</span>
                  </div>
                  <div className="flex flex-col gap-3 mt-3 bg-gray-100 p-2 rounded-md">
                    {selectedVariant.extras.map((ex: any) => (
                      <div 
                        key={ex.id} 
                        className={`p-3 rounded-xl border transition-all cursor-pointer bg-white
                          ${selectedExtras[selectedVariant.id]?.has(ex.id) 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                        onClick={() => toggleExtra(selectedVariant.id, ex.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3
                              ${selectedExtras[selectedVariant.id]?.has(ex.id) 
                                ? 'bg-orange-500 border-orange-500' 
                                : 'border-gray-300'}`}
                            >
                              {selectedExtras[selectedVariant.id]?.has(ex.id) && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="font-medium">{(ex.name).slice(0, 30)}...</span>
                          </div>
                          <span className="text-[15px]">
                          +{`(${formatPrice(ex.price)})`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
        )}
    
        {/* Total Price & Add to Cart */}
        <div className="w-full  absolute bottom-[0.3em] rounded-xl left-0 p-4 bg-white shadow-xl shadow-gray-300 flex flex-row-reverse justify-between items-center">
          <button
            onClick={() => {
              if(dineInClose || pickupClose || deliveryClose){
                toast.error(dineInClose || pickupClose || deliveryClose);
                return;
              }
                handleAddToCartClick();
                setOpen && setOpen(false);
            }}
            className={`w-[17em] py-2 text-white font-bold rounded-xl transition-all flex justify-between items-center
              bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl px-[1em]`}
          >
            <span className=" text-[16px] font-semibold  rounded-md">Add to Cart</span>  <span className="  rounded-md">
                {formatPrice(computeVariantTotal(selectedVariant))}
              </span>
          </button>


          <div className="flex items-center gap-2">
  <button 
    onClick={() => changeVariantQty(selectedVariant?.id, -1)} 
    className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
  >
    −
  </button>
  
  <span className="w-8 text-center text-gray-800 font-semibold">
    {variantQtys[selectedVariant?.id] || 1}
  </span>
  
  <button 
    onClick={() => changeVariantQty(selectedVariant?.id, 1)} 
    className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
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
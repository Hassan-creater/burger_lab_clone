// "use client";

// import LikeButton from "@/components/LikeButton";
// // import QuantityCounter from "@/components/cart/QuantityCounter";
// // import { Button } from "@/components/ui/button";
// // import useCart from "@/hooks/useCart";
// import { formatPrice } from "@/lib/utils";
// // import { AddOn } from "@/types";
// // import AdditionalInfo from "./AdditionalInfo";
// import ImageModal from "@/components/modals/ImageModal";
// // import useProductDescription from "@/hooks/useProductDescription";
// import { Item } from "@/models/Item";
// import { Favorite } from "@/models/Favorites";
// import { useContext, useEffect, useMemo, useRef, useState } from "react";
// import { apiClient } from "@/lib/api";
// import { useQuery } from "@tanstack/react-query";
// import { loadCartFromStorage, mergeAndSaveCart, removeVariantFromCart } from "@/cartStorage/cartStorage";
// import {CartContext, useCartContext } from "@/context/context";
// import { getClientCookie } from "@/lib/getCookie";

// // import useCart from "@/hooks/useCart";

// interface ProductDescriptionProps {
//   product: Item;
//   favorites: Favorite[] | null;
// }

// const ProductDescription = ({
//   product,
//   // favorites,
// }: ProductDescriptionProps) => {
//   // const { handleAddToCart } = useCart();
//   // const [isFav, setIsFav] = useState(() => {
//   //   return !!favorites?.some((favorite) => favorite.itemid === product.id);
//   // });
//   // const {
//   //   item,
//   //   quantityToAdd,
//   //   setQuantityToAdd,
//   //   extraOptions,
//   //   setExtraOptions,
//   //   totalPrice,
//   // } = useProductDescription(product);
//   const user = getClientCookie("accessToken");
//   // const router = useRouter();

//   const getItemById = async ()=>{
//     const res = await apiClient.get(`/item/${product.id}/view/customer`);

//     return res.data;
//   } 

//   const {data} = useQuery({
//     queryKey : ['ItemId'],
//     queryFn : getItemById,
//   })


//   const variants = data?.data?.item?.variants;



//   const [cartItems, setCartItems] = useState<any[]>([]);
//   const {updateCart} = useCartContext();
//   const [showMessage, setShowMessage] = useState('');

//   // variant id in cart 
//   // const variantIdsInCart = new Set(cartItems.map(item => item.variant.id));


//   // VARIANT ADD TO CART LOGIC 
//     // State: variantQtys[v.id] = number
//     const [variantQtys, setVariantQtys] = useState<Record<string, number>>({});
//     // State: addonQtys[v.id][ao.id] = number
//     const [addonQtys, setAddonQtys] = useState<Record<string, Record<string, number>>>({});


// const [selectedAddons, setSelectedAddons] = useState<Record<string, Set<string>>>({});
// const [selectedExtras, setSelectedExtras] = useState<Record<string, Set<string>>>({});

//     // at top of your component
// const [extrasQtys, setExtrasQtys] = useState<Record<string, Record<string, number>>>({});

// // Handler


// const handleAddToCartClick = () => {
//   if (!selectedVariant) return;
//   addToCart(selectedVariant);
//   setShowMessage(`${selectedVariant.name} added to cart!`);
//   setTimeout(() => setShowMessage(''), 3000);
// };

  
// const changeVariantQty = (variantId: string, delta: number) => {
//   setVariantQtys((prev) => {
//     const currentQty = prev[variantId] || 0;
//     const newQty = Math.max(0, currentQty + delta);
    
//     // Update cart items
//     setCartItems((prevCart) => {
//       if (newQty === 0) {
//         return prevCart.filter(item => item.variant.id !== variantId);
//       }
      
//       return prevCart.map(item => 
//         item.variant.id === variantId
//           ? { 
//             ...item, 
//             quantity: newQty,
//             // Update addons/extras quantities to match new variant quantity
//             addons: item.addons.map((ao: any) => ({ ...ao, quantity: newQty })),
//             extras: item.extras.map((ex: any) => ({ ...ex, quantity: newQty }))
//           }
//           : item
//       );
//     });
    
//     return { ...prev, [variantId]: newQty };
//   });
// };


    
    
  
//     // // change addon quantity function 
//     // const changeAddonQty = (variantId: string, addonId: string, delta: number) => {
//     //   setAddonQtys((prev) => {
//     //     const vAddons = prev[variantId] || {};
//     //     const newCount = Math.max(0, (vAddons[addonId] || 0) + delta);
    
//     //     // Sync with cart if this variant is in cart
//     //     setCartItems((prevCart) =>
//     //       prevCart.map((item) => {
//     //         if (item.variant.id !== variantId) return item;
    
//     //         let updated = false;
//     //         const updatedAddons = item.addons.map((ao: any) => {
//     //           if (ao.id === addonId) {
//     //             updated = true;
//     //             return { ...ao, quantity: newCount };
//     //           }
//     //           return ao;
//     //         });
    
//     //         // Add addon if not in list yet and count > 0
//     //         if (!updated && newCount > 0) {
//     //           updatedAddons.push({ id: addonId, quantity: newCount });
//     //         }
    
//     //         return { ...item, addons: updatedAddons };
//     //       })
//     //     );
    
//     //     return {
//     //       ...prev,
//     //       [variantId]: {
//     //         ...vAddons,
//     //         [addonId]: newCount,
//     //       },
//     //     };
//     //   });
//     // };

//     // // change extra quantity function 
//     // const changeExtraQty = (variantId: string, extraId: string, delta: number) => {
//     //   setExtrasQtys((prev) => {
//     //     const prevExtras = prev[variantId] || {};
//     //     const newQty = Math.max(0, (prevExtras[extraId] || 0) + delta);
    
//     //     // 1) Update extrasQtys
//     //     const updatedExtrasState = {
//     //       ...prev,
//     //       [variantId]: {
//     //         ...prevExtras,
//     //         [extraId]: newQty,
//     //       },
//     //     };
    
//     //     // 2) Derive the new cartItems with updated extras
//     //     setCartItems((prevCart) =>
//     //       prevCart.map((item) => {
//     //         if (item.variant.id !== variantId) return item;
    
//     //         // Start from the current extras in the cart
//     //         const currentExtras = item.extras || [];
    
//     //         // Update or add
//     //         let found = false;
//     //         const newExtrasList = currentExtras.map((ex: any) => {
//     //           if (ex.id === extraId) {
//     //             found = true;
//     //             return { ...ex, quantity: newQty };
//     //           }
//     //           return ex;
//     //         });
    
//     //         // If not found and now > 0, add it
//     //         if (!found && newQty > 0) {
//     //           newExtrasList.push({ id: extraId, quantity: newQty });
//     //         }
    
//     //         // Filter out zero‑quantity extras
//     //         const filteredExtras = newExtrasList.filter((ex: any) => ex.quantity > 0);
    
//     //         return { ...item, extras: filteredExtras };
//     //       })
//     //     );
    
//     //     return updatedExtrasState;
//     //   });
//     // };

//    // Toggle addon selection
// const toggleAddon = (variantId: string, addonId: string) => {
//   setSelectedAddons(prev => {
//     const newSet = new Set(prev[variantId] || []);
//     if (newSet.has(addonId)) newSet.delete(addonId);
//     else newSet.add(addonId);

//     // Reflect the new Set in your record
//     const updated = { ...prev, [variantId]: newSet };

//     // Now completely rebuild the cart’s addons list for that variant:
//     setCartItems(items =>
//       items.map(item => {
//         if (item.variant.id !== variantId) return item;
//         const qty = variantQtys[variantId] || 1;
//         const addons = Array.from(newSet).map(id => ({ id, quantity: qty }));
//         return { ...item, addons };
//       })
//     );

//     return updated;
//   });
// };

// // Toggle extra selection
// // Toggle extra selection
// const toggleExtra = (variantId: string, extraId: string) => {
//   setSelectedExtras(prev => {
//     // 1) Flip the ID in the Set
//     const newSet = new Set(prev[variantId] || []);
//     if (newSet.has(extraId)) newSet.delete(extraId);
//     else newSet.add(extraId);

//     // 2) Update the record
//     const updatedExtras = { ...prev, [variantId]: newSet };

//     // 3) Rebuild cartItems.extras from scratch
//     setCartItems(items =>
//       items.map(item => {
//         if (item.variant.id !== variantId) return item;
//         const qty = variantQtys[variantId] || 1;
//         // Create one entry per selected extra
//         const extras = Array.from(newSet).map(id => ({
//           id,
//           quantity: qty
//         }));
//         return { ...item, extras };
//       })
//     );

//     return updatedExtras;
//   });
// }
    
//     // Calculate total for a variant
//     const computeVariantTotal = (variant: any) => {
//       const qty = variantQtys[variant.id] || 0;
//       if (qty === 0) return 0;
      
//       // Base price
//       let total = variant.price * qty;
      
//       // Add addons
//       const addons = selectedAddons[variant.id] || new Set();
//       addons.forEach(addonId => {
//         const addon = variant.addons?.find((ao: any) => ao.id === addonId);
//         if (addon) total += addon.price * qty;
//       });
      
//       // Add extras
//       const extras = selectedExtras[variant.id] || new Set();
//       extras.forEach(extraId => {
//         const extra = variant.extras?.find((ex: any) => ex.id === extraId);
//         if (extra) total += extra.price * qty;
//       });
      
//       return total;
//     };
    
//     // Add to cart function
//     const addToCart = (variant: any) => {
//       const qty = variantQtys[variant.id] || 0;
//       if (qty === 0) return;
      
//       const addons = Array.from(selectedAddons[variant.id] || []).map(addonId => ({
//         id: addonId,
//         quantity: qty
//       }));
      
//       const extras = Array.from(selectedExtras[variant.id] || []).map(extraId => ({
//         id: extraId,
//         quantity: qty
//       }));
      
//       const newItem = {
//         variant,
//         quantity: qty,
//         addons,
//         extras
//       };
      
//       setCartItems(prev => [...prev, newItem]);
//     };
    
    



//     // add to cart function 
//     //   const addToCart = (variant: any) => {
//     //   const qty = variantQtys[variant.id] || 0;
//     //   if (qty === 0) return;
    
//     //   // build addons
//     //   const addons = Object.entries(addonQtys[variant.id] || {})
//     //     .filter(([, aoQty]) => aoQty > 0)
//     //     .map(([id, aoQty]) => ({ id, quantity: aoQty }));
    
//     //   // 🚀 build extras too
//     //   const extras = Object.entries(extrasQtys[variant.id] || {})
//     //     .filter(([, exQty]) => exQty > 0)
//     //     .map(([id, exQty]) => ({ id, quantity: exQty }));
    
//     //   // push full payload
//     //   setCartItems((prev) => [
//     //     ...prev,
//     //     { variant, quantity: qty, addons, extras },
//     //   ]);
//     // };
    


//     // total price function 
//     // const computeTotal = (variant: any) => {
//     //   const qty = variantQtys[variant.id] || 0;
//     //   const baseTotal = variant.price * qty;
    
//     //   const addonsTotal = variant.addons?.reduce((sum: number, ao: any) => {
//     //     const aoQty = addonQtys[variant.id]?.[ao.id] || 0;
//     //     return sum + ao.price * aoQty;
//     //   }, 0) || 0;
    
//     //   const extrasTotal = variant.extras?.reduce((sum: number, ex: any) => {
//     //     const exQty = extrasQtys[variant.id]?.[ex.id] || 0;
//     //     const price = ex.priceDifference ?? ex.price;
//     //     return sum + price * exQty;
//     //   }, 0) || 0;
    
//     //   return baseTotal + addonsTotal + extrasTotal;
//     // };
    


//     // const grandTotal = useMemo(() => {
//     //   if (!Array.isArray(variants)) return 0;
//     //   return variants.reduce((sum: number, v: any) => sum + computeTotal(v), 0);
//     // }, [variants, variantQtys, addonQtys, extrasQtys]);   // ← added extrasQtys
    


//     // const confirmedGrandTotal = useMemo(() => {
//     //   return cartItems.reduce((sum, item) => {
//     //     // 1) Base total
//     //     const base = item.variant.price * item.quantity;
    
//     //     // 2) Add‑ons total
//     //     const addonsTotal = item.addons?.reduce((aSum: number, ao: any) => {
//     //       const unit = item.variant.addons.find((a: any) => a.id === ao.id)?.price ?? 0;
//     //       return aSum + unit * ao.quantity;
//     //     }, 0) ?? 0;
    
//     //     // 3) Extras total
//     //     const extrasTotal = item.extras?.reduce((eSum: number, ex: any) => {
//     //       // find the matching extra on the variant
//     //       const variantExtra = item.variant.extras?.find((e: any) => e.id === ex.id);
//     //       if (!variantExtra) return eSum;                // skip if missing
//     //       const unitPrice = variantExtra.priceDifference 
//     //         ?? variantExtra.price 
//     //         ?? 0;                                        // fallback
//     //       return eSum + unitPrice * ex.quantity;
//     //     }, 0) ?? 0;
    
//     //     return sum + base + addonsTotal + extrasTotal;
//     //   }, 0);
//     // }, [cartItems]);
//      // ← added extrasQtys
    


//      const cartPayload = cartItems.map(item => {
//       const basePrice = item.variant.price * item.quantity;
    
//       // Build addons exactly as before
//       const addons = (item.addons || []).map((ao: any) => {
//         const addonData = item.variant.addons.find((a: any) => a.id === ao.id);
//         return {
//           id: ao.id,
//           name: addonData?.name || "Unknown Addon",
//           price: addonData?.price || 0,
//           quantity: ao.quantity,
//         };
//       });
    
//       // Build extras from item.extras, just like addons:
//       const extras = (item.extras || []).map((exItem: any) => {
//         const extraDef = item.variant.extras?.find((e: any) => e.id === exItem.id);
//         const unitPrice = extraDef?.priceDifference ?? extraDef?.price ?? 0;
//         return {
//           id: exItem.id,
//           name: extraDef?.name || "Unknown Extra",
//           price: unitPrice,
//           quantity: exItem.quantity,
//         };
//       });
    
//       const addonsTotal = addons.reduce((sum: number, ao: any) => sum + ao.price * ao.quantity, 0);
//       const extrasTotal = extras.reduce((sum: number, ex: any) => sum + ex.price * ex.quantity, 0);
//       const totalPrice = basePrice + addonsTotal + extrasTotal;
    
//       return {
//         itemImage: product.image,
//         variantId: item.variant.id,
//         variantName: item.variant.name,
//         variantPrice: item.variant.price,
//         quantity: item.quantity,
//         totalPrice,
//         addons,
//         extras,
//       };
//     });
    

//   const prevPayloadRef = useRef<string | null>(null);
   
//   useEffect(() => {
//     const serialized = JSON.stringify(cartPayload);
//     if (cartPayload.length > 0 && serialized !== prevPayloadRef.current) {
//       updateCart(cartPayload);
//       prevPayloadRef.current = serialized;
//     }
//   }, [cartPayload]);

   


    
//    useEffect(() => {
//     const payload = loadCartFromStorage() || [];
//     if (payload.length && Array.isArray(variants)) {
//       // Rebuild cart items
//       const richItems = payload.map((p: any) => {
//         const fullVariant = variants.find((v: any) => v.id === p.variantId);
//         if (!fullVariant) return null;
//         const fullAddons = (p.addons || []).map((ao: any) => ({
//           ...fullVariant.addons.find((a: any) => a.id === ao.id),
//           quantity: ao.quantity,
//         }));
//         const fullExtras = (p.extras || []).map((ex: any) => ({
//           ...fullVariant.extras.find((e: any) => e.id === ex.id),
//           quantity: ex.quantity,
//         }));
//         return { variant: fullVariant, quantity: p.quantity, addons: fullAddons, extras: fullExtras };
//       }).filter(Boolean);
//       setCartItems(richItems);

//       // Hydrate qty states
//       const vQtys: any = {};
//       const aoQtys: any = {};
//       const exQtys: any = {};
//       const selAddons: any = {};
//       const selExtras: any  = {};
//       richItems.forEach((item: any) => {
//         const vid = item.variant.id;
//         vQtys[vid] = item.quantity;

//         // Addon state
//         if (item.addons.length) {
//           aoQtys[vid] = {};
//           const setA = new Set();
//           item.addons.forEach((ao: any) => {
//             aoQtys[vid][ao.id] = ao.quantity;
//             setA.add(ao.id);
//           });
//           selAddons[vid] = setA;
//         }

//         // Extra state
//         if (item.extras.length) {
//           exQtys[vid] = {};
//           const setE = new Set();
//           item.extras.forEach((ex: any) => {
//             exQtys[vid][ex.id] = ex.quantity;
//             setE.add(ex.id);
//           });
//           selExtras[vid] = setE;
//         }
//       });
//       setVariantQtys(vQtys);
//       setAddonQtys(aoQtys);
//       setExtrasQtys(exQtys);
//       setSelectedAddons(selAddons);
//       setSelectedExtras(selExtras);
//     }
//   }, [variants, loadCartFromStorage, setCartItems, setVariantQtys, setAddonQtys, setExtrasQtys, setSelectedAddons, setSelectedExtras]);



//   const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

//   useEffect(() => {
//     if (variants && variants.length > 0) {
//       setSelectedVariantId(variants[0].id);
//     }
//   }, [variants]);

//   const selectedVariant = variants?.find((v: any) => v.id === selectedVariantId);
  
    

//   return (
//     <article className="flex w-full flex-col lg:flex-row bg-white shadow-lg rounded-2xl overflow-scroll">
//     {/* Left - Product Image & Variants */}
//     <div className="w-full lg:w-2/5 flex flex-col p-4 bg-gray-50">
//       {/* Product Image */}
//       <div className="relative aspect-auto w-full overflow-hidden rounded-xl">
//         <img 
//           src={product.image} 
//           alt={product.name} 
//           className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
//         />
//         {/* {product.isPopular && (
//           <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
//             POPULAR
//           </div>
//         )} */}
//       </div>
      
//       {/* Variant Selector */}
//       <div className="mt-6">
//         <div className="inline-flex items-center text-sm lg:text-md font-bold text-gray-700 mb-3">
//           <span className="bg-black text-white px-3 py-1 rounded-l-lg">More</span>
//           <span className="bg-orange-500 px-4 py-1 rounded-r-lg">Select Variant</span>
//         </div>
        
//         <div className="flex space-x-3 overflow-x-auto pb-2 pt-1">
//           {variants?.map((v: any) => {
//             const isActive = v.id === selectedVariantId;
//             return (
//               <div key={v.id} className="relative flex flex-col items-center group shrink-0">
//                 <button
//                   onClick={() => setSelectedVariantId(v.id)}
//                   className={`
//                     flex flex-col items-center p-2 rounded-xl transition-all duration-300
//                     min-w-[5.5rem] border-2
//                     ${isActive 
//                       ? 'border-orange-500 bg-orange-50 shadow-md' 
//                       : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'}
//                     overflow-hidden
//                   `}
//                 >
//                   <div className="relative rounded-lg overflow-hidden mb-1">
//                     <img 
//                       src={v.image} 
//                       alt={v.name} 
//                       className="w-16 h-16 object-cover" 
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg" />
                    
//                     {isActive && (
//                       <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                         </svg>
//                       </div>
//                     )}
//                   </div>
                  
//                   <span className="text-xs lg:text-sm font-medium text-gray-700">
//                     {v.name}
//                   </span>
//                 </button>
                
//                 <div className={`
//                   absolute -top-1 -left-1 rounded-full px-2 py-0.5 text-xs font-bold
//                   ${isActive 
//                     ? 'bg-orange-500 text-white' 
//                     : 'bg-white text-gray-700 border border-gray-300'}
//                   shadow-sm
//                 `}>
//                   {formatPrice(v.price)}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
  
//     {/* Right - Product Details */}
//     <div className="w-full lg:w-3/5 p-6 flex flex-col">
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{product.name}</h1>
//           {product.description && (
//             <p className="mt-2 text-gray-600 max-w-2xl">{product.description}</p>
//           )}
//         </div>
        
//         {/* {product.rating && (
//           <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//             </svg>
//             <span className="ml-1 font-medium">{product.rating}</span>
//           </div>
//         )} */}
//       </div>
      
//       {selectedVariant && (
//         <div className="mt-6 space-y-8 overflow-y-auto flex-1">
//           <div className="border rounded-2xl p-5 hover:shadow-lg transition-all bg-white">
//             {/* Variant Header & Qty */}
//             <div className="flex flex-col lg:flex-row items-center justify-between pb-4 border-b border-gray-200">
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <img 
//                     src={selectedVariant.image} 
//                     alt={selectedVariant.name} 
//                     className="w-20 h-20 object-cover rounded-xl border border-gray-200" 
//                   />
//                   {/* {selectedVariant.isBestSeller && (
//                     <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
//                       BEST
//                     </div>
//                   )} */}
//                 </div>
//                 <div>
//                   <h3 className="whitespace-nowrap md:text-xl font-bold text-gray-800">{(selectedVariant.name).slice(0, 15)}...</h3>
//                   <p className="text-orange-500 font-semibold">{formatPrice(selectedVariant.price)}</p>
//                 </div>
//               </div>
//               <div className="flex ml-[4em] lg:ml-0 items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
//                 <button 
//                   onClick={() => changeVariantQty(selectedVariant.id, -1)} 
//                   className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
//                 >
//                   −
//                 </button>
//                 <span className="w-8 text-center text-gray-800 font-medium">
//                   {variantQtys[selectedVariant.id] || 0}
//                 </span>
//                 <button 
//                   onClick={() => changeVariantQty(selectedVariant.id, 1)} 
//                   className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
  
//             {/* Addons */}
//             {selectedVariant.addons?.length > 0 && (
//               <div className="mt-5">
//                 <div className="inline-flex items-center text-sm lg:text-md font-bold text-gray-700 mb-4">
//                   <span className="bg-black text-white px-3 py-1 rounded-l-lg">More</span>
//                   <span className="bg-orange-500 px-4 py-1 rounded-r-lg">Select Addons</span>
//                 </div>
//                 <div className="flex flex-col  gap-3 mt-3">
//                   {selectedVariant.addons.map((ao: any) => (
//                     <div 
//                       key={ao.id} 
//                       className={`p-3 rounded-xl border transition-all cursor-pointer
//                         ${selectedAddons[selectedVariant.id]?.has(ao.id) 
//                           ? 'border-orange-500 bg-orange-50' 
//                           : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
//                       onClick={() => toggleAddon(selectedVariant.id, ao.id)}
//                     >
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center">
//                           <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3
//                             ${selectedAddons[selectedVariant.id]?.has(ao.id) 
//                               ? 'bg-orange-500 border-orange-500' 
//                               : 'border-gray-300'}`}
//                           >
//                             {selectedAddons[selectedVariant.id]?.has(ao.id) && (
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                               </svg>
//                             )}
//                           </div>
//                           <span className="font-medium">{(ao.name).slice(0, 15)}...</span>
//                         </div>
//                         <span className="text-green-600 font-semibold">
//                           +{formatPrice(ao.price)}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
  
//             {/* Extras */}
//             {selectedVariant.extras?.length > 0 && (
//               <div className="mt-6">
//                 <div className="inline-flex items-center text-sm lg:text-md font-bold text-gray-700 mb-4">
//                   <span className="bg-black text-white px-3 py-1 rounded-l-lg">More</span>
//                   <span className="bg-orange-500 px-4 py-1 rounded-r-lg">Select Extras</span>
//                 </div>
//                 <div className="flex flex-col gap-3 mt-3">
//                   {selectedVariant.extras.map((ex: any) => (
//                     <div 
//                       key={ex.id} 
//                       className={`p-3 rounded-xl border transition-all cursor-pointer
//                         ${selectedExtras[selectedVariant.id]?.has(ex.id) 
//                           ? 'border-orange-500 bg-orange-50' 
//                           : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
//                       onClick={() => toggleExtra(selectedVariant.id, ex.id)}
//                     >
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center">
//                           <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3
//                             ${selectedExtras[selectedVariant.id]?.has(ex.id) 
//                               ? 'bg-orange-500 border-orange-500' 
//                               : 'border-gray-300'}`}
//                           >
//                             {selectedExtras[selectedVariant.id]?.has(ex.id) && (
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                               </svg>
//                             )}
//                           </div>
//                           <span className="font-medium">{(ex.name).slice(0, 15)}...</span>
//                         </div>
//                         <span className="text-green-600 font-semibold">
//                           +{formatPrice(ex.priceDifference || ex.price)}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
  
//       {/* Total Price & Add to Cart */}
//       <div className="mt-6 pt-5 border-t border-gray-200">
//         {/* Total Price */}
//         {selectedVariant && (
//           <div className="flex justify-between items-center mb-4 px-4  rounded-xl">
//             <span className="text-sm lg:text-lg font-bold text-gray-800">Total Price:</span>
//             <span className=" lg:text-lg font-bold text-orange-600">
//               {formatPrice(computeVariantTotal(selectedVariant))}
//             </span>
//           </div>
//         )}
  
//         {/* Add to Cart Button */}
//         <button
//           onClick={()=>{
//             if(!user){
//               handleAddToCartClick();
//             }else{
//               window.location.href = "/login";
//             }
//           }}
//           disabled={!selectedVariant || (variantQtys[selectedVariant.id] || 0) === 0}
//           className={`w-full py-3  text-white font-bold rounded-xl transition-all
//             ${!selectedVariant || (variantQtys[selectedVariant.id] || 0) === 0
//               ? 'bg-gray-400 cursor-not-allowed'
//               : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl'}`}
//         >
//           Add to Cart
//         </button>
  
//         {showMessage && (
//           <div className="mt-3 text-center text-green-600 font-medium animate-pulse">
//             {showMessage}
//           </div>
//         )}
//       </div>
//     </div>
//   </article>


//   );
// };

// export default ProductDescription;





















// "use client";

// import LikeButton from "@/components/LikeButton";
// import ImageModal from "@/components/modals/ImageModal";
// import { Item } from "@/models/Item";
// import { Favorite } from "@/models/Favorites";
// import { useContext, useEffect, useMemo, useRef, useState } from "react";
// import { apiClient } from "@/lib/api";
// import { useQuery } from "@tanstack/react-query";
// import { loadCartFromStorage, mergeAndSaveCart, removeVariantFromCart } from "@/cartStorage/cartStorage";
// import { CartContext, useCartContext } from "@/context/context";
// import { getClientCookie } from "@/lib/getCookie";
// import { formatPrice } from "@/lib/utils";

// interface ProductDescriptionProps {
//   product: Item;
//   favorites: Favorite[] | null;
// }

// // Helper function to compare arrays
// const arraysEqual = (a: any[], b: any[]) => {
//   if (a === b) return true;
//   if (a == null || b == null) return false;
//   if (a.length !== b.length) return false;
  
//   const aSorted = [...a].sort();
//   const bSorted = [...b].sort();
  
//   for (let i = 0; i < aSorted.length; i++) {
//     if (aSorted[i] !== bSorted[i]) return false;
//   }
//   return true;
// };

// const ProductDescription = ({ product }: ProductDescriptionProps) => {
//   const user = getClientCookie("accessToken");
//   const { updateCart } = useCartContext();
//   const [cartItems, setCartItems] = useState<any[]>([]);
//   const [showMessage, setShowMessage] = useState('');
  
//   // State for variant quantities
//   const [variantQtys, setVariantQtys] = useState<Record<string, number>>({});
//   const [selectedAddons, setSelectedAddons] = useState<Record<string, Set<string>>>({});
//   const [selectedExtras, setSelectedExtras] = useState<Record<string, Set<string>>>({});
//   const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
//   const [initialized, setInitialized] = useState(false);

//   // Fetch product variants
//   const getItemById = async () => {
//     const res = await apiClient.get(`/item/${product.id}/view/customer`);
//     return res.data;
//   };

//   const { data } = useQuery({
//     queryKey: ['ItemId'],
//     queryFn: getItemById,
//   });

//   const variants = data?.data?.item?.variants;

//   // Set default variant
//   useEffect(() => {
//     if (variants && variants.length > 0) {
//       setSelectedVariantId(variants[0].id);
//     }
//   }, [variants]);

//   // Set default quantity to 1 for selected variant
//   useEffect(() => {
//     if (selectedVariantId && !initialized) {
//       setVariantQtys(prev => ({
//         ...prev,
//         [selectedVariantId]: 1
//       }));
//       setInitialized(true);
//     }
//   }, [selectedVariantId, initialized]);

//   const selectedVariant = variants?.find((v: any) => v.id === selectedVariantId);

//   // Quantity handlers
//   const changeVariantQty = (variantId: string, delta: number) => {
//     setVariantQtys((prev) => {
//       const currentQty = prev[variantId] || 0;
//       const newQty = Math.max(0, currentQty + delta);
      
//       setCartItems((prevCart) => {
//         if (newQty === 0) {
//           return prevCart.filter(item => item.variant.id !== variantId);
//         }
        
//         return prevCart.map(item => 
//           item.variant.id === variantId
//             ? { 
//                 ...item, 
//                 quantity: newQty,
//                 addons: item.addons.map((ao: any) => ({ ...ao, quantity: newQty })),
//                 extras: item.extras.map((ex: any) => ({ ...ex, quantity: newQty }))
//               }
//             : item
//         );
//       });
      
//       return { ...prev, [variantId]: newQty };
//     });
//   };

//   // Addon/Extra handlers
//   const toggleAddon = (variantId: string, addonId: string) => {
//     setSelectedAddons(prev => {
//       const newSet = new Set(prev[variantId] || []);
//       if (newSet.has(addonId)) newSet.delete(addonId);
//       else newSet.add(addonId);

//       const updated = { ...prev, [variantId]: newSet };

//       setCartItems(items =>
//         items.map(item => {
//           if (item.variant.id !== variantId) return item;
//           const qty = variantQtys[variantId] || 1;
//           const addons = Array.from(newSet).map(id => ({ id, quantity: qty }));
//           return { ...item, addons };
//         })
//       );

//       return updated;
//     });
//   };

//   const toggleExtra = (variantId: string, extraId: string) => {
//     setSelectedExtras(prev => {
//       const newSet = new Set(prev[variantId] || []);
//       if (newSet.has(extraId)) newSet.delete(extraId);
//       else newSet.add(extraId);

//       const updatedExtras = { ...prev, [variantId]: newSet };

//       setCartItems(items =>
//         items.map(item => {
//           if (item.variant.id !== variantId) return item;
//           const qty = variantQtys[variantId] || 1;
//           const extras = Array.from(newSet).map(id => ({
//             id,
//             quantity: qty
//           }));
//           return { ...item, extras };
//         })
//       );

//       return updatedExtras;
//     });
//   };

//   // Calculate variant total price
//   const computeVariantTotal = (variant: any) => {
//     const qty = variantQtys[variant.id] || 0;
//     if (qty === 0) return 0;
    
//     let total = variant.price * qty;
    
//     const addons = selectedAddons[variant.id] || new Set();
//     addons.forEach(addonId => {
//       const addon = variant.addons?.find((ao: any) => ao.id === addonId);
//       if (addon) total += addon.price * qty;
//     });
    
//     const extras = selectedExtras[variant.id] || new Set();
//     extras.forEach(extraId => {
//       const extra = variant.extras?.find((ex: any) => ex.id === extraId);
//       if (extra) total += extra.price * qty;
//     });
    
//     return total;
//   };

//   // Add to cart with merge logic
//   const addToCart = (variant: any) => {
//     const qty = variantQtys[variant.id] || 1;
//     if (qty === 0) return;

//     const addons = Array.from(selectedAddons[variant.id] || []).map(addonId => ({
//       id: addonId,
//       quantity: qty
//     }));
    
//     const extras = Array.from(selectedExtras[variant.id] || []).map(extraId => ({
//       id: extraId,
//       quantity: qty
//     }));
    
//     const newItem = {
//       variant,
//       quantity: qty,
//       addons,
//       extras
//     };

//     setCartItems(prev => {
//       // Check if identical item exists in cart
//       const existingItemIndex = prev.findIndex(item => 
//         item.variant.id === variant.id &&
//         arraysEqual(
//           item.addons.map((ao: any) => ao.id),
//           addons.map((ao: any) => ao.id)
//         ) &&
//         arraysEqual(
//           item.extras.map((ex: any) => ex.id),
//           extras.map((ex: any) => ex.id)
//         )
//       );

//       if (existingItemIndex >= 0) {
//         // Merge with existing item
//         const existingItem = prev[existingItemIndex];
//         const mergedItem = {
//           ...existingItem,
//           quantity: existingItem.quantity + qty,
//           addons: existingItem.addons.map((ao: any) => ({
//             ...ao,
//             quantity: ao.quantity + qty
//           })),
//           extras: existingItem.extras.map((ex: any) => ({
//             ...ex,
//             quantity: ex.quantity + qty
//           }))
//         };
        
//         return [
//           ...prev.slice(0, existingItemIndex),
//           mergedItem,
//           ...prev.slice(existingItemIndex + 1)
//         ];
//       } else {
//         // Add as new item
//         return [...prev, newItem];
//       }
//     });
    
//     setShowMessage(`${variant.name} added to cart!`);
//     setTimeout(() => setShowMessage(''), 3000);
//   };

//   // Handle add to cart button click
//   const handleAddToCartClick = () => {
//     if (!selectedVariant) return;
//     addToCart(selectedVariant);
//   };

//   // Prepare cart payload for context
//   const cartPayload = useMemo(() => {
//     return cartItems.map(item => {
//       const basePrice = item.variant.price * item.quantity;
    
//       const addons = (item.addons || []).map((ao: any) => {
//         const addonData = item.variant.addons.find((a: any) => a.id === ao.id);
//         return {
//           id: ao.id,
//           name: addonData?.name || "Unknown Addon",
//           price: addonData?.price || 0,
//           quantity: ao.quantity,
//         };
//       });
    
//       const extras = (item.extras || []).map((exItem: any) => {
//         const extraDef = item.variant.extras?.find((e: any) => e.id === exItem.id);
//         const unitPrice = extraDef?.priceDifference ?? extraDef?.price ?? 0;
//         return {
//           id: exItem.id,
//           name: extraDef?.name || "Unknown Extra",
//           price: unitPrice,
//           quantity: exItem.quantity,
//         };
//       });
    
//       const addonsTotal = addons.reduce((sum: number, ao: any) => sum + ao.price * ao.quantity, 0);
//       const extrasTotal = extras.reduce((sum: number, ex: any) => sum + ex.price * ex.quantity, 0);
//       const totalPrice = basePrice + addonsTotal + extrasTotal;
    
//       return {
//         itemImage: product.image,
//         variantId: item.variant.id,
//         variantName: item.variant.name,
//         variantPrice: item.variant.price,
//         quantity: item.quantity,
//         totalPrice,
//         addons,
//         extras,
//       };
//     });
//   }, [cartItems, product]);

//   // Update cart context
//   const prevPayloadRef = useRef<string | null>(null);
//   useEffect(() => {
//     const serialized = JSON.stringify(cartPayload);
//     if (cartPayload.length > 0 && serialized !== prevPayloadRef.current) {
//       updateCart(cartPayload);
//       prevPayloadRef.current = serialized;
//     }
//   }, [cartPayload, updateCart]);

//   // Load cart from storage
//   // useEffect(() => {
//   //   const payload = loadCartFromStorage() || [];
//   //   if (payload.length && Array.isArray(variants)) {
//   //     // Rebuild cart items
//   //     const richItems = payload.map((p: any) => {
//   //       const fullVariant = variants.find((v: any) => v.id === p.variantId);
//   //       if (!fullVariant) return null;
//   //       const fullAddons = (p.addons || []).map((ao: any) => ({
//   //         ...fullVariant.addons.find((a: any) => a.id === ao.id),
//   //         quantity: ao.quantity,
//   //       }));
//   //       const fullExtras = (p.extras || []).map((ex: any) => ({
//   //         ...fullVariant.extras.find((e: any) => e.id === ex.id),
//   //         quantity: ex.quantity,
//   //       }));
//   //       return { variant: fullVariant, quantity: p.quantity, addons: fullAddons, extras: fullExtras };
//   //     }).filter(Boolean);
//   //     setCartItems(richItems);

//   //     // Hydrate state
//   //     const vQtys: any = {};
//   //     const aoQtys: any = {};
//   //     const exQtys: any = {};
//   //     const selAddons: any = {};
//   //     const selExtras: any  = {};
      
//   //     richItems.forEach((item: any) => {
//   //       const vid = item.variant.id;
//   //       vQtys[vid] = item.quantity;

//   //       // Addon state
//   //       if (item.addons.length) {
//   //         aoQtys[vid] = {};
//   //         const setA = new Set();
//   //         item.addons.forEach((ao: any) => {
//   //           aoQtys[vid][ao.id] = ao.quantity;
//   //           setA.add(ao.id);
//   //         });
//   //         selAddons[vid] = setA;
//   //       }

//   //       // Extra state
//   //       if (item.extras.length) {
//   //         exQtys[vid] = {};
//   //         const setE = new Set();
//   //         item.extras.forEach((ex: any) => {
//   //           exQtys[vid][ex.id] = ex.quantity;
//   //           setE.add(ex.id);
//   //         });
//   //         selExtras[vid] = setE;
//   //       }
//   //     });
      
//   //     setVariantQtys(vQtys);
//   //     setSelectedAddons(selAddons);
//   //     setSelectedExtras(selExtras);
//   //   }
//   // }, [variants]);

//   return (
//     <article className="flex w-full flex-col lg:flex-row bg-white shadow-lg rounded-2xl overflow-scroll">
//       {/* Left - Product Image & Variants */}
//       <div className="w-full lg:w-2/5 flex flex-col p-4 bg-gray-50">
//         {/* Product Image */}
//         <div className="relative aspect-auto w-full overflow-hidden rounded-xl">
//           <img 
//             src={product.image} 
//             alt={product.name} 
//             className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
//           />
//         </div>
        
//         {/* Variant Selector */}
//         <div className="mt-6">
//           <div className="inline-flex items-center text-sm lg:text-md font-bold text-gray-700 mb-3">
//             <span className="bg-black text-white px-3 py-1 rounded-l-lg">More</span>
//             <span className="bg-orange-500 px-4 py-1 rounded-r-lg">Select Variant</span>
//           </div>
          
//           <div className="flex space-x-3 overflow-x-auto pb-2 pt-1">
//             {variants?.map((v: any) => {
//               const isActive = v.id === selectedVariantId;
//               return (
//                 <div key={v.id} className="relative flex flex-col items-center group shrink-0">
//                   <button
//                     onClick={() => setSelectedVariantId(v.id)}
//                     className={`
//                       flex flex-col items-center p-2 rounded-xl transition-all duration-300
//                       min-w-[5.5rem] border-2
//                       ${isActive 
//                         ? 'border-orange-500 bg-orange-50 shadow-md' 
//                         : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'}
//                       overflow-hidden
//                     `}
//                   >
//                     <div className="relative rounded-lg overflow-hidden mb-1">
//                       <img 
//                         src={v.image} 
//                         alt={v.name} 
//                         className="w-16 h-16 object-cover" 
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg" />
                      
//                       {isActive && (
//                         <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                           </svg>
//                         </div>
//                       )}
//                     </div>
                    
//                     <span className="text-xs lg:text-sm font-medium text-gray-700">
//                       {v.name}
//                     </span>
//                   </button>
                  
//                   <div className={`
//                     absolute -top-1 -left-1 rounded-full px-2 py-0.5 text-xs font-bold
//                     ${isActive 
//                       ? 'bg-orange-500 text-white' 
//                       : 'bg-white text-gray-700 border border-gray-300'}
//                     shadow-sm
//                   `}>
//                     {formatPrice(v.price)}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
    
//       {/* Right - Product Details */}
//       <div className="w-full lg:w-3/5 p-6 flex flex-col">
//         <div className="flex justify-between items-start">
//           <div>
//             <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{product.name}</h1>
//             {product.description && (
//               <p className="mt-2 text-gray-600 max-w-2xl">{product.description}</p>
//             )}
//           </div>
//         </div>
        
//         {selectedVariant && (
//           <div className="mt-6 space-y-8 overflow-y-auto flex-1">
//             <div className="border rounded-2xl p-5 hover:shadow-lg transition-all bg-white">
//               {/* Variant Header & Qty */}
//               <div className="flex flex-col lg:flex-row items-center justify-between pb-4 border-b border-gray-200">
//                 <div className="flex items-center gap-4">
//                   <div className="relative">
//                     <img 
//                       src={selectedVariant.image} 
//                       alt={selectedVariant.name} 
//                       className="w-20 h-20 object-cover rounded-xl border border-gray-200" 
//                     />
//                   </div>
//                   <div>
//                     <h3 className="whitespace-nowrap md:text-xl font-bold text-gray-800">{(selectedVariant.name).slice(0, 15)}...</h3>
//                     <p className="text-orange-500 font-semibold">{formatPrice(selectedVariant.price)}</p>
//                   </div>
//                 </div>
//                 <div className="flex ml-[4em] lg:ml-0 items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
//                   <button 
//                     onClick={() => changeVariantQty(selectedVariant.id, -1)} 
//                     className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
//                   >
//                     −
//                   </button>
//                   <span className="w-8 text-center text-gray-800 font-medium">
//                     {variantQtys[selectedVariant.id] || 0}
//                   </span>
//                   <button 
//                     onClick={() => changeVariantQty(selectedVariant.id, 1)} 
//                     className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
    
//               {/* Addons */}
//               {selectedVariant.addons?.length > 0 && (
//                 <div className="mt-5">
//                   <div className="inline-flex items-center text-sm lg:text-md font-bold text-gray-700 mb-4">
//                     <span className="bg-black text-white px-3 py-1 rounded-l-lg">More</span>
//                     <span className="bg-orange-500 px-4 py-1 rounded-r-lg">Select Addons</span>
//                   </div>
//                   <div className="flex flex-col  gap-3 mt-3">
//                     {selectedVariant.addons.map((ao: any) => (
//                       <div 
//                         key={ao.id} 
//                         className={`p-3 rounded-xl border transition-all cursor-pointer
//                           ${selectedAddons[selectedVariant.id]?.has(ao.id) 
//                             ? 'border-orange-500 bg-orange-50' 
//                             : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
//                         onClick={() => toggleAddon(selectedVariant.id, ao.id)}
//                       >
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center">
//                             <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3
//                               ${selectedAddons[selectedVariant.id]?.has(ao.id) 
//                                 ? 'bg-orange-500 border-orange-500' 
//                                 : 'border-gray-300'}`}
//                             >
//                               {selectedAddons[selectedVariant.id]?.has(ao.id) && (
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
//                                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                 </svg>
//                               )}
//                             </div>
//                             <span className="font-medium">{(ao.name).slice(0, 15)}...</span>
//                           </div>
//                           <span className="text-green-600 font-semibold">
//                             +{formatPrice(ao.price)}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
    
//               {/* Extras */}
//               {selectedVariant.extras?.length > 0 && (
//                 <div className="mt-6">
//                   <div className="inline-flex items-center text-sm lg:text-md font-bold text-gray-700 mb-4">
//                     <span className="bg-black text-white px-3 py-1 rounded-l-lg">More</span>
//                     <span className="bg-orange-500 px-4 py-1 rounded-r-lg">Select Extras</span>
//                   </div>
//                   <div className="flex flex-col gap-3 mt-3">
//                     {selectedVariant.extras.map((ex: any) => (
//                       <div 
//                         key={ex.id} 
//                         className={`p-3 rounded-xl border transition-all cursor-pointer
//                           ${selectedExtras[selectedVariant.id]?.has(ex.id) 
//                             ? 'border-orange-500 bg-orange-50' 
//                             : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
//                         onClick={() => toggleExtra(selectedVariant.id, ex.id)}
//                       >
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center">
//                             <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3
//                               ${selectedExtras[selectedVariant.id]?.has(ex.id) 
//                                 ? 'bg-orange-500 border-orange-500' 
//                                 : 'border-gray-300'}`}
//                             >
//                               {selectedExtras[selectedVariant.id]?.has(ex.id) && (
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
//                                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                 </svg>
//                               )}
//                             </div>
//                             <span className="font-medium">{(ex.name).slice(0, 15)}...</span>
//                           </div>
//                           <span className="text-green-600 font-semibold">
//                             +{formatPrice(ex.priceDifference || ex.price)}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
    
//         {/* Total Price & Add to Cart */}
//         <div className="mt-6 pt-5 border-t border-gray-200">
//           {/* Total Price */}
//           {selectedVariant && (
//             <div className="flex justify-between items-center mb-4 px-4  rounded-xl">
//               <span className="text-sm lg:text-lg font-bold text-gray-800">Total Price:</span>
//               <span className=" lg:text-lg font-bold text-orange-600">
//                 {formatPrice(computeVariantTotal(selectedVariant))}
//               </span>
//             </div>
//           )}
    
//           {/* Add to Cart Button */}
//           <button
//             onClick={() => {
//               if (!user) {
//                 handleAddToCartClick();
//               } else {
//                 window.location.href = "/login";
//               }
//             }}
//             disabled={!selectedVariant || (variantQtys[selectedVariant.id] || 0) === 0}
//             className={`w-full py-3  text-white font-bold rounded-xl transition-all
//               ${!selectedVariant || (variantQtys[selectedVariant.id] || 0) === 0
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl'}`}
//           >
//             Add to Cart
//           </button>
    
//           {showMessage && (
//             <div className="mt-3 text-center text-green-600 font-medium animate-pulse">
//               {showMessage}
//             </div>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// };

// export default ProductDescription;




"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { loadCartFromStorage } from "@/cartStorage/cartStorage";
import { useCartContext } from "@/context/context";
import { getClientCookie } from "@/lib/getCookie";
import { formatPrice } from "@/lib/utils";
import { Item } from "@/models/Item";

interface ProductDescriptionProps {
  product: Item;
  setOpen: (open: boolean) => void;
}

const ProductDescription = ({ product , setOpen }: ProductDescriptionProps) => {
  const user = getClientCookie("accessToken");
  const { updateCart } = useCartContext();
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

  const { data } = useQuery({
    queryKey: ['ItemId'],
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
    const qty = variantQtys[variant.id] || 1;
    
    let total = variant.price * qty;
    
    const addons = selectedAddons[variant.id] || new Set();
    addons.forEach(addonId => {
      const addon = variant.addons?.find((ao: any) => ao.id === addonId);
      if (addon) total += addon.price * qty;
    });
    
    const extras = selectedExtras[variant.id] || new Set();
    extras.forEach(extraId => {
      const extra = variant.extras?.find((ex: any) => ex.id === extraId);
      if (extra) total += extra.price * qty;
    });
    
    return total;
  };

  // Add to cart as new item
  const addToCart = (variant: any) => {
    const qty = variantQtys[variant.id] || 1;
    
    const addons = Array.from(selectedAddons[variant.id] || []).map(addonId => ({
      id: addonId,
      quantity: qty
    }));
    
    const extras = Array.from(selectedExtras[variant.id] || []).map(extraId => ({
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
    setVariantQtys(prev => ({ ...prev, [variant.id]: 1 })); // Reset quantity to 1
 setSelectedAddons(prev => ({ ...prev, [variant.id]: new Set() }));
setSelectedExtras(prev => ({ ...prev, [variant.id]: new Set() }));
    
    setShowMessage(`${variant.name} added to cart!`);
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
      const basePrice = item.variant.price * item.quantity;
    
      const addons = (item.addons || []).map((ao: any) => {
        const addonData = item.variant.addons.find((a: any) => a.id === ao.id);
        return {
          id: ao.id,
          name: addonData?.name || "Unknown Addon",
          price: addonData?.price || 0,
          quantity: ao.quantity,
        };
      });
    
      const extras = (item.extras || []).map((exItem: any) => {
        const extraDef = item.variant.extras?.find((e: any) => e.id === exItem.id);
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
        variantId: item.variant.id,
        variantName: item.variant.name,
        variantPrice: item.variant.price,
        quantity: item.quantity,
        totalPrice,
        addons,
        extras,
      };
    });
  }, [cartItems, product]);

  console.log(cartPayload);

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

  // Load cart from storage
  // useEffect(() => {
  //   const payload = loadCartFromStorage() || [];
  //   if (payload.length && Array.isArray(variants)) {
  //     // Rebuild cart items
  //     const richItems = payload.map((p: any) => {
  //       const fullVariant = variants.find((v: any) => v.id === p.variantId);
  //       if (!fullVariant) return null;
  //       const fullAddons = (p.addons || []).map((ao: any) => ({
  //         ...fullVariant.addons.find((a: any) => a.id === ao.id),
  //         quantity: ao.quantity,
  //       }));
  //       const fullExtras = (p.extras || []).map((ex: any) => ({
  //         ...fullVariant.extras.find((e: any) => e.id === ex.id),
  //         quantity: ex.quantity,
  //       }));
  //       return { variant: fullVariant, quantity: p.quantity, addons: fullAddons, extras: fullExtras };
  //     }).filter(Boolean);
  //     setCartItems(richItems);
  //   }
  // }, [variants]);

  return (
    <article className="flex w-full flex-col lg:flex-row bg-white shadow-lg rounded-2xl overflow-scroll">
      {/* Left - Product Image & Variants */}
      <div className="w-full lg:w-2/5 flex flex-col p-4 bg-gray-50">
        {/* Product Image */}
        <div className="relative aspect-auto w-full overflow-hidden rounded-xl">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          />
        </div>
        
        {/* Variant Selector */}
        <div className="mt-6">
          <div className="inline-flex items-center text-sm lg:text-md font-bold text-gray-700 mb-3">
            <span className="bg-black text-white px-3 py-1 rounded-l-lg">More</span>
            <span className="bg-orange-500 px-4 py-1 rounded-r-lg">Select Variant</span>
          </div>
          
          <div className="flex space-x-3 overflow-x-auto pb-2 pt-1">
            {variants?.map((v: any) => {
              const isActive = v.id === selectedVariantId;
              return (
                <div key={v.id} className="relative flex flex-col items-center group shrink-0">
                  <button
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`
                      flex flex-col items-center p-2 rounded-xl transition-all duration-300
                      min-w-[5.5rem] border-2
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
                        className="w-16 h-16 object-cover" 
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
                    
                    <span className="text-xs lg:text-sm font-medium text-gray-700">
                      {v.name}
                    </span>
                  </button>
                  
                  <div className={`
                    absolute -top-1 -left-1 rounded-full px-2 py-0.5 text-xs font-bold
                    ${isActive 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300'}
                    shadow-sm
                  `}>
                    {formatPrice(v.price)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    
      {/* Right - Product Details */}
      <div className="w-full lg:w-3/5 p-6 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{product.name}</h1>
            {product.description && (
              <p className="mt-2 text-gray-600 max-w-2xl">{product.description}</p>
            )}
          </div>
        </div>
        
        {selectedVariant && (
          <div className="mt-6 space-y-8 overflow-y-auto flex-1">
            <div className="border rounded-2xl p-5 hover:shadow-lg transition-all bg-white">
              {/* Variant Header & Qty */}
              <div className="flex flex-col lg:flex-row items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={selectedVariant.image} 
                      alt={selectedVariant.name} 
                      className="w-20 h-20 object-cover rounded-xl border border-gray-200" 
                    />
                  </div>
                  <div>
                    <h3 className="whitespace-nowrap md:text-xl font-bold text-gray-800">{(selectedVariant.name).slice(0, 15)}...</h3>
                    <p className="text-orange-500 font-semibold">{formatPrice(selectedVariant.price)}</p>
                  </div>
                </div>
                <div className="flex ml-[4em] lg:ml-0 items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                  <button 
                    onClick={() => changeVariantQty(selectedVariant.id, -1)} 
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-gray-800 font-medium">
                    {variantQtys[selectedVariant.id] || 1}
                  </span>
                  <button 
                    onClick={() => changeVariantQty(selectedVariant.id, 1)} 
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
    
              {/* Addons */}
              {selectedVariant.addons?.length > 0 && (
                <div className="mt-5">
                  <div className="inline-flex items-center text-sm lg:text-md font-bold text-gray-700 mb-4">
                    <span className="bg-black text-white px-3 py-1 rounded-l-lg">More</span>
                    <span className="bg-orange-500 px-4 py-1 rounded-r-lg">Select Addons</span>
                  </div>
                  <div className="flex flex-col  gap-3 mt-3">
                    {selectedVariant.addons.map((ao: any) => (
                      <div 
                        key={ao.id} 
                        className={`p-3 rounded-xl border transition-all cursor-pointer
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
                            <span className="font-medium">{(ao.name).slice(0, 15)}...</span>
                          </div>
                          <span className="text-green-600 font-semibold">
                            +{formatPrice(ao.price)}
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
                  <div className="flex flex-col gap-3 mt-3">
                    {selectedVariant.extras.map((ex: any) => (
                      <div 
                        key={ex.id} 
                        className={`p-3 rounded-xl border transition-all cursor-pointer
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
                            <span className="font-medium">{(ex.name).slice(0, 15)}...</span>
                          </div>
                          <span className="text-green-600 font-semibold">
                            +{formatPrice(ex.priceDifference || ex.price)}
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
        <div className="mt-6 pt-5 border-t border-gray-200">
          {/* Total Price */}
          {selectedVariant && (
            <div className="flex justify-between items-center mb-4 px-4  rounded-xl">
              <span className="text-sm lg:text-lg font-bold text-gray-800">Total Price:</span>
              <span className=" lg:text-lg font-bold text-orange-600">
                {formatPrice(computeVariantTotal(selectedVariant))}
              </span>
            </div>
          )}
    
          {/* Add to Cart Button */}
          <button
            onClick={() => {
              if (user) {
                handleAddToCartClick();
                setOpen(false);
              } else {
                window.location.href = "/login";
              }
            }}
            className={`w-full py-3 text-white font-bold rounded-xl transition-all
              bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl`}
          >
            Add to Cart
          </button>
    
          {showMessage && (
            <div className="mt-3 text-center text-green-600 font-medium animate-pulse">
              {showMessage}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductDescription;
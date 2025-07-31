
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {  ChevronDown, Trash2} from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import {  usePathname } from "next/navigation";


import { useCartContext } from "@/context/context";
import { designVar } from "@/designVar/desighVar";



type CartItems = {
  itemImage: string;
  variantName: string;
  variantId: string;
  totalPrice : number;
  variantPrice : number;
  quantity : number;
  addons : any[];
  extras : any[];
};


interface CartItemProps {
  cartItem: CartItems  | any;
  removeItem?: (itemId: string) => void;
}


 

function DealItem({ cartItem, removeItem }: CartItemProps) {

  
  const [showAddons, setShowAddons] = useState(false)
  const [showExtras, setShowExtras] = useState(false)
  const pathname = usePathname();
  const isCheckoutPage = pathname?.includes('/checkout');

  // const totalAddons =
  //   cartItem.addons?.reduce((sum: number, ao: any) => sum + ao.price * ao.quantity, 0) || 0

  // const totalExtras =
  //   cartItem.extras?.reduce((sum: number, ex: any) => sum + ex.price * ex.quantity, 0) || 0

  // const itemTotal = cartItem.variantPrice * cartItem.quantity + totalAddons + totalExtras


  const { DecreaseDealQuantity , IncreaseDealQuantity , removeDealFromCart , IncreaseDealAddonQuantity , DecreaseDealAddonQuantity , IncreaseDealExtraQuantity , DecreaseDealExtraQuantity} = useCartContext();

  // const renderAddOns = (addOnOption: any, index: number) => (
  //   <div key={index} className="flex justify-between text-sm text-gray-600">
  //     <span>{addOnOption.name}</span>
  //     <span>
  //       {formatPrice(addOnOption.price)} × {addOnOption.quantity}
  //     </span>
  //   </div>
  // );


  // const updateQuantity = (variantId: string, quantity: number) => {
  //   setCartItems((items) => items.map((item) => (item.variantId === variantId ? { ...item, quantity } : item)))
  // }
  

  return (
    <div className={`group w-full relative py-4 ${designVar.fontFamily}`}>
    <article className="flex flex-col p-4 bg-white rounded-xl border border-gray-300 hover:border-gray-300 hover:shadow-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)]">
      {/* Absolute delete button - visible on hover */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeDealFromCart(cartItem)}
        className="absolute top-6 right-3 opactiy-100 xl:opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Top row - Image and basic info */}
      <div className="flex gap-4 pb-3">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
          <Image
            src={cartItem?.dealImage}
            alt={cartItem.dealId || cartItem.variantId || cartItem.id}
            width={96}
            onError={e => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src !== "/logo-symbol-2.png") {
                target.src = "/logo-symbol-2.png";
              }
            }}
            height={96}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 text-[15px]">
              {cartItem.variantName || cartItem.name || 'Deal'}
            </h3>
            {/* Show all variant names and prices if present */}
            {Array.isArray(cartItem.allvariant) && cartItem.allvariant.length > 0 && (
              <div className="text-sm text-gray-600 mt-1">
                Variants:
                <ul className="ml-4 mt-1">
                  {cartItem.allvariant.map((v: any) => (
                    <li key={v.id} className="flex justify-between">
                      <span>{v.name}</span>
                      <span>{formatPrice(v.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-[13px] text-gray-900">
                {formatPrice(cartItem.variantTotalPrice || cartItem.variantPrice || cartItem.totalPrice)}
              </span>
             

              {
                isCheckoutPage ? (
                      <span className="font-medium text-gray-600 text-[13px]">
                Qty: {cartItem.variantQuantity || cartItem.quantity}
              </span> 
                ) : (
                  <div className="flex items-center gap-2">
                  {!isCheckoutPage && (
                    <div className="flex gap-2 justify-center items-center border border-slate-300 p-1 rounded-full">
                      <button 
                        onClick={() => DecreaseDealQuantity([cartItem])}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-black  cursor-pointer font-bold hover:text-white hover:bg-orange-600 transition-colors shadow-sm"
                      >
                        −
                      </button>
                      
                      <span className="text-gray-800 font-semibold">{cartItem.variantQuantity || cartItem.quantity}</span>
                      <button 
                        onClick={() => IncreaseDealQuantity([cartItem])}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  )}
                  {isCheckoutPage && (
                    <span className="text-gray-800 font-semibold">Qty: {cartItem.variantQuantity || cartItem.quantity}</span>
                  )}
                </div>
                )
              }

             
            </div>
          </div>
          
        </div>
      </div>

      

      {/* Add-ons & Extras */}
      {(cartItem.addons?.length > 0 || cartItem.extras?.length > 0) && (
        <div className="pt-3 border-t border-gray-100">
          {/* Add-ons Toggle */}
          {cartItem.addons?.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowAddons(!showAddons)}
                className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center justify-between w-full"
              >
                Add-ons
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAddons ? 'rotate-180' : ''}`} />
              </button>
              <div
              className={`flex flex-col gap-2 mt-2 overflow-hidden bg-white rounded-lg transition-all duration-300 ease-in-out ${showAddons ? 'py-2' : 'py-0'}`}
          style={{
           maxHeight: showAddons ? '500px' : '0px',
          opacity: showAddons ? 1 : 0,
            }}
>
                {cartItem.addons.map((addon : any) => (
                  <div
                    key={addon.id}
                    className="flex items-center text-sm rounded-full border border-gray-200 bg-white px-3 py-2 my-[0.1em] mx-[0.5em]"
                  >
                    <div className="flex justify-between w-full items-center">
                      <div>{addon.name.slice(0, 25)}...</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px]">+{formatPrice(addon.price)}</span>
                        {
                          !isCheckoutPage && (
                            <div className="flex gap-2 justify-center items-center p-1 border border-slate-300 rounded-full">
                             <button
                          className="w-5 h-5 flex items-center justify-center rounded-full  text-black hover:text-white font-bold hover:bg-orange-600 transition-colors"
                          onClick={() => {
                           
                            DecreaseDealAddonQuantity(cartItem , addon?.id)
                          }}
                          
                        >−</button>
                        <span className="text-gray-800 text-[13px] font-semibold">{addon.quantity}</span>
                        <button
                          className="w-5 h-5 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
                          onClick={() => {
                           
                            IncreaseDealAddonQuantity(cartItem  , addon?.id)
                          }}
                        >+</button>
                            </div>
                          )
                        }

                        {
                          isCheckoutPage && (
                            <span className="text-xs">Qty:{addon.quantity}</span>
                          )
                        }
                       
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extras Toggle */}
          {cartItem.extras?.length > 0 && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowExtras(!showExtras)}
                className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center justify-between w-full"
              >
                Extras
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showExtras ? 'rotate-180' : ''}`} />
              </button>
              <div
              className={`flex flex-col gap-2 mt-2 overflow-hidden bg-white rounded-lg transition-all duration-300 ease-in-out ${showExtras ? 'py-2' : 'py-0'}`}
          style={{
           maxHeight: showExtras ? '500px' : '0px',
          opacity: showExtras ? 1 : 0,
            }}
              >
                {cartItem.extras.map((extra : any) => (
                  <div
                    key={extra.id}
                    className="flex items-center text-sm bg-white rounded-full border border-gray-200 px-3 py-2 my-[0.1em] mx-[0.5em]"
                  >
                    <div className="flex w-full justify-between items-center">
                      <div className="text-[13px]">{extra.name.slice(0, 25)}...</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px]">+{formatPrice(extra.price)}</span>
                        {
                          !isCheckoutPage && (
                            <div className="flex gap-2 justify-center items-center p-1 border border-slate-300 rounded-full">
                             <button
                          className="w-5 h-5 flex items-center justify-center rounded-full hover:text-white  text-black font-bold hover:bg-orange-600 transition-colors"
                          onClick={() => {
                           
                            DecreaseDealExtraQuantity(cartItem , extra?.id);
                            
                          }}
                      
                        >−</button>
                        <span className="text-gray-800 text-[13px] font-semibold">{extra.quantity}</span>
                        <button
                          className="w-5 h-5 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
                          onClick={() => {
                           
                            IncreaseDealExtraQuantity(cartItem , extra?.id);
                          }}
                        >+</button>
                            </div>
                          ) 
                        }


                        {
                          isCheckoutPage && (
                            <span className="text-xs">Qty:{extra.quantity}</span>
                          )
                        }
                       
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Total */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
        <span className="text-[14px] font-medium text-gray-600">Deal total</span>
        <span className="text-[14px] font-semibold">
          {formatPrice(cartItem?.totalPrice)}
        </span>
      </div>
    </article>
  </div>
  
  );
}

export default DealItem;

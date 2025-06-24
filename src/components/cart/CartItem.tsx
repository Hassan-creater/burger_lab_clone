import type { AddOnOption, CartItem } from "@/types";
import React from "react";
import QuantityCounter from "./QuantityCounter";
import { Button } from "@/components/ui/button";
import { Badge, Trash2, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { BASE_URL_IMAGES } from "@/lib/constants";
import { log } from "console";

import { useCartContext } from "@/context/context";

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
  cartItem: CartItems  |any;
  removeItem?: (itemId: string) => void;
}




function CartItem({ cartItem, removeItem }: CartItemProps) {

 

  const {removeItemFromCart} = useCartContext();

  const renderAddOns = (addOnOption: any, index: number) => (
    <div key={index} className="flex justify-between text-sm text-gray-600">
      <span>{addOnOption.name}</span>
      <span>
        {formatPrice(addOnOption.price)} × {addOnOption.quantity}
      </span>
    </div>
  );


  // const updateQuantity = (variantId: string, quantity: number) => {
  //   setCartItems((items) => items.map((item) => (item.variantId === variantId ? { ...item, quantity } : item)))
  // }
  

  return (
    <div className="group w-full relative py-4">
    <article className="flex flex-col p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 shadow-sm">
      {/* Absolute delete button - visible on hover */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeItemFromCart(cartItem.variantId)}
        className="absolute top-6 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
  
      {/* Top row - Image and basic info */}
      <div className="flex gap-4 pb-3">
        {/* Product Image */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
          <Image
            src={cartItem?.itemImage || "/placeholder.svg?height=96&width=96"}
            alt={cartItem.variantName}
            width={96}
            height={96}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
          />
        </div>
  
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-2">
            <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2">
              {cartItem.variantName}
            </h3>
          </div>
  
          {/* Price and Quantity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(cartItem.variantPrice)}
              </span>
              <span className="text-sm font-medium text-gray-600">
                Qty: {cartItem.quantity}
              </span>
            </div>
          </div>
        </div>
      </div>
  
      {/* Add-ons & Extras - Full width below image */}
      {(cartItem.addons?.length > 0 || cartItem.extras?.length > 0) && (
        <div className="pt-3 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Add-ons & Extras
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            {/* Add-ons */}
            {cartItem.addons?.map((addon: any) => (
              <div key={addon.id} className="flex items-center text-sm bg-blue-50 rounded-lg px-3 py-2">
                <div className="flex-1 min-w-0">
                  <div className="text-blue-700 font-medium truncate">{addon.name}</div>
                  <div className="flex items-center text-blue-600">
                    <span>+{formatPrice(addon.price)}</span>
                    {addon.quantity > 1 && (
                      <span className="text-gray-500 ml-2">
                        ×{addon.quantity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
  
            {/* Extras */}
            {cartItem.extras?.map((extra: any) => (
              <div key={extra.id} className="flex items-center text-sm bg-green-50 rounded-lg px-3 py-2">
                <div className="flex-1 min-w-0">
                  <div className="text-green-700 font-medium truncate">{extra.name}</div>
                  <div className="flex items-center text-green-600">
                    <span>+{formatPrice(extra.price)}</span>
                    {extra.quantity > 1 && (
                      <span className="text-gray-500 ml-2">
                        ×{extra.quantity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
  
      {/* Total */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
        <span className="text-sm font-medium text-gray-600">Item Total</span>
        <span className="text-lg font-bold text-orange-600">
          {formatPrice(
            cartItem.variantPrice * cartItem.quantity +
              (cartItem.addons?.reduce((sum: number, ao: any) => sum + ao.price * ao.quantity, 0) || 0) +
              (cartItem.extras?.reduce((sum: number, ex: any) => sum + ex.price * ex.quantity, 0) || 0)
          )}
        </span>
      </div>
    </article>
  </div>
  
  );
}

export default CartItem;

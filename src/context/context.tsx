// context/CartContext.tsx
"use client";

import { loadCartFromStorage, mergeAndSaveCart, removeItems, removeVariantFromCart } from "@/cartStorage/cartStorage";
import { Josefin_Sans } from "next/font/google";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define the shape of your cart item
export interface CartItem {
  variantId: string;
  variantName: string;
  variantPrice: number;
  quantity: number;
  totalPrice: number;
  itemImage: string;
  addons: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  extras?: {
    id: string;
    name?: string;
    price?: number;
    quantity: number;
  }[];
}

interface CartContextType {
  AddedInCart: CartItem[];
  setAddedInCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  updateCart: (newItems: CartItem[]) => void;
  removeItemFromCart: (variantId: string) => void;
  ClearCart: () => void;
  UpdateAddressData: (orderType: any) => void;
  AddressData: any;
  newAddress: boolean;
  setNewAddress: React.Dispatch<React.SetStateAction<boolean>>;
  defaultAddress: string;
  setDefaultAddress: (id: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (id: string) => void;
  deliveryName: string;
  setDeliveryName: (name: string) => void;
  deliveryPhone: string;
  setDeliveryPhone: (phone: string) => void;
  comment: string;
  setComment: (comment: string) => void;
  
 
}

// Create the context
export const CartContext = createContext<CartContextType | undefined>(undefined);


// Provider component
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [AddedInCart, setAddedInCart] = useState<CartItem[]>([]);
  const [AddressData, setAddressData] = useState<any>(null);
  const [newAddress, setNewAddress] = useState<boolean>(false);
  const [defaultAddress, _setDefaultAddress] = useState<string>("");
  const [deliveryAddress, _setDeliveryAddress] = useState<string>("");
  const [deliveryName, _setDeliveryName] = useState<string>("");
  const [deliveryPhone, _setDeliveryPhone] = useState<string>("");
  const [comment, _setComment] = useState<string>("");

  const setDeliveryPhone = (phone: string) => {
    _setDeliveryPhone(phone ?? "");
  }
  const setComment = (comment: string) => {
    _setComment(comment ?? "");
  }

  const setDeliveryName = (name: string) => {
    _setDeliveryName(name ?? "");
  }

  const setDeliveryAddress = (id: string) => {
    _setDeliveryAddress(id ?? "");
  }

  const setDefaultAddress = (id: string) => {
    localStorage.setItem("defaultAddress" , id);
    const address = localStorage.getItem("defaultAddress");
    _setDefaultAddress(address ?? "");
  }


  const deduplicateItems = (items: CartItem[]) => {
    const result: CartItem[] = [];
  
    const isSameItem = (a: CartItem, b: CartItem) =>
      a.variantId === b.variantId &&
      JSON.stringify(a.addons || []) === JSON.stringify(b.addons || []) &&
      JSON.stringify(a.extras || []) === JSON.stringify(b.extras || []);
  
    for (const item of items) {
      const existing = result.find((r) => isSameItem(r, item));
      if (existing) {
        existing.quantity += item.quantity;
        existing.totalPrice += item.totalPrice;
      } else {
        result.push({ ...item });
      }
    }
  
    return result;
  };
  

  const updateCart = (newItems: CartItem[]) => {
    const deduped = deduplicateItems(newItems);
    mergeAndSaveCart(deduped);
    const updatedCart = loadCartFromStorage();
    setAddedInCart(updatedCart);
  };
  
  

  const removeItemFromCart = (variantId: string) => {
    removeVariantFromCart(variantId);
    const updatedCart = loadCartFromStorage();
    setAddedInCart(updatedCart);
  };

  const ClearCart = () => {
    removeItems();
    setAddedInCart([]);
  };


  const UpdateAddressData = (orderType: any) => {
    localStorage.setItem("addressData", JSON.stringify(orderType));
    const AddressData = JSON.parse(localStorage.getItem("addressData") || "{}");
    setAddressData(AddressData ?? {});
  };


  useEffect(() => {
    const data = loadCartFromStorage();
    const addressData = JSON.parse(localStorage.getItem("addressData") || "{}");
    setAddressData(addressData ?? "");
    setAddedInCart(data);

    const defaultAddress = localStorage.getItem("defaultAddress");
    _setDefaultAddress(defaultAddress ?? "");
  },[]);



  return (
    <CartContext.Provider value={{ AddedInCart, setAddedInCart , updateCart , removeItemFromCart , ClearCart , UpdateAddressData , AddressData , newAddress , setNewAddress , defaultAddress , setDefaultAddress , deliveryAddress , setDeliveryAddress , deliveryName , setDeliveryName , deliveryPhone , setDeliveryPhone , comment , setComment }}>
      {children}
    </CartContext.Provider>
  );
};




export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
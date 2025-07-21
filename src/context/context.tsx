// context/CartContext.tsx
"use client";

import { decreaseAddonQuantity, decreaseDealQuantity, decreaseExtraQuantity, decreaseItemAddon, decreaseItemExtra, decreaseQuantity, increaseAddonQuantity, increaseDealQuantity, increaseExtraQuantity, increaseItemAddon, increaseItemExtra, increaseQuantity, loadCartFromStorage, loadDealFromStorage, mergeAndSaveCart, removeCartItem, removeDealItem, removeItems, removeVariantFromCart, saveDealCartData } from "@/cartStorage/cartStorage";
import { Josefin_Sans } from "next/font/google";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getClientCookie } from "@/lib/getCookie";



// Define the shape of your cart item
type Favorite = {
  itemId: string;
  favId:  string;
};


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
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  token: string | null;
  authOpen: boolean;
  setAuthOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLoggedIn: (user: any, token: string , RefreshToken: string) => void;
  favorite: any;      
  setFavorite: React.Dispatch<React.SetStateAction<any>>;
  couponData: any;
  setCouponData: React.Dispatch<React.SetStateAction<any>>;
  TaxData : any;
  setTaxData: React.Dispatch<React.SetStateAction<any>>;
  dineInClose: string;
  setDineInClose: React.Dispatch<React.SetStateAction<string>>;
  pickupClose: string;
  setPickupClose: React.Dispatch<React.SetStateAction<string>>;
  deliveryClose: string;
  setDeliveryClose: React.Dispatch<React.SetStateAction<string>>;
  refreshToken: string | null;
  setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
  couponCode: string;
  setCouponCode: React.Dispatch<React.SetStateAction<string>>;
  DecreaseQuantity: (item: any) => void;
  IncreaseQuantity: (item: any) => void;
  isTaxAppliedBeforeCoupon: boolean;
  setIsTaxAppliedBeforeCoupon: React.Dispatch<React.SetStateAction<boolean>>;
  deals : any[],
  setDeals :  React.Dispatch<React.SetStateAction<any>>
  dealData : any[],
  updateDealCart: (newItems: {}) => void; 
  DecreaseDealQuantity: (deal: any) => void;
  IncreaseDealQuantity: (deal: any) => void;
  removeDealFromCart : (deal : any )=>void;
  IncreaseDealAddonQuantity: (cartItem: any , addonId : string) => void;
  DecreaseDealAddonQuantity: (cartItem: any , addonId : string) => void;
  IncreaseDealExtraQuantity: (cartItem: any , extraId : string) => void;
  DecreaseDealExtraQuantity: (cartItem: any , extraId : string) => void;
  IncreaseItemAddonQuantity: (cartItem: any , addonId : string) => void;
  DecreaseItemAddonQuantity: (cartItem: any , addonId : string) => void;
  IncreaseItemExtraQuantity: (cartItem: any , extraId : string) => void;
  DecreaseItemExtraQuantity: (cartItem: any , extraId : string) => void;
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
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>("");
  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [favorite, _setFavorite] = useState<any[]>([]);
  const [couponData, setCouponData] = useState<any>({});
  const [TaxData, setTaxData] = useState<any>({});
  const [dineInClose, setDineInClose] = useState<string>("");
  const [pickupClose, setPickupClose] = useState<string>("");
  const [deliveryClose, setDeliveryClose] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string | null>("");
  const [couponCode, setCouponCode] = useState<string>("");
  const [isTaxAppliedBeforeCoupon, setIsTaxAppliedBeforeCoupon] = useState<boolean>(false);
  const [deals , setDeals] = useState<any>([])
  const [dealData,setDealData] = useState<any>({})

  const setFavorite = ({ itemId, favId }: Favorite) => {
    // 1. Load current favorites (or empty array)
    const raw = localStorage.getItem("favorite");
    const favorites: Favorite[] = raw ? JSON.parse(raw) : [];
  
    // 2. Check if itemId is already in favorites
    const exists = favorites.some(fav => fav.itemId === itemId);
  
    // 3. Build the new favorites array
    const newFavorites = exists
      ? favorites.filter(fav => fav.itemId !== itemId)           // remove it
      : [...favorites, { itemId, favId }];                      // add it
  
    // 4. Persist back to localStorage
    localStorage.setItem("favorite", JSON.stringify(newFavorites));
  
    // 5. Update your React state (or other state manager)
    _setFavorite(newFavorites);
  };


  useEffect(() => {
    const fav = localStorage.getItem("favorite");
    if(fav){
      _setFavorite(JSON.parse(fav));
    }
  }, []);

  const setLoggedIn = (user: any, token: string , RefreshToken: string) => {
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    Cookies.set("userData", JSON.stringify(user), { expires: 1, path: "/", secure: !isLocalhost , sameSite : "lax" });
    Cookies.set("accessToken", token, {
      expires: 1, // 1 day
      path: "/",
      secure: !isLocalhost, // Secure in production only
      sameSite: "lax",
    });
    Cookies.set("refreshToken", RefreshToken ?? "", {
      expires: 1, // 1 day
      path: "/",
      secure: !isLocalhost, // Secure in production only
      sameSite: "lax",
    });

    setUser(user);
    setRefreshToken(RefreshToken ?? "");
    setToken(token);
    
  }

  useEffect(() => {
    const user = Cookies.get("userData");
     const token = getClientCookie("accessToken");
     const RefreshToken = getClientCookie("refreshToken");
    if(user){
      setUser(JSON.parse(user));
      setToken(token ?? null);
      setRefreshToken(RefreshToken ?? null);
    }
  }, []);

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

  


  const updateDealCart = (newItem : {})=>{
    saveDealCartData(newItem);
    const dealPaylod =  loadDealFromStorage();
    setDealData(dealPaylod);
  }



  const DecreaseQuantity = (item: any) => {
    decreaseQuantity(item);
    const updatedCart = loadCartFromStorage();
    setAddedInCart(updatedCart);
  }

  const IncreaseQuantity = (item: any) => {
    increaseQuantity(item);
    const updatedCart = loadCartFromStorage();
    setAddedInCart(updatedCart);
  }


  const DecreaseDealQuantity = (deal : any)=>{
    decreaseDealQuantity(deal);
    const updatedDeal = loadDealFromStorage();
    setDealData(updatedDeal);
  }  


  const IncreaseDealQuantity = (deal : any)=>{
    increaseDealQuantity(deal);
    const updatedDeal = loadDealFromStorage();
    setDealData(updatedDeal);
  }


  const IncreaseDealAddonQuantity = (CartItem : any , addonId : string)=>{
    increaseAddonQuantity(CartItem , addonId);
    const updated = loadDealFromStorage();
    setDealData(updated)
  }


  const DecreaseDealAddonQuantity = (CartItem : any , addonId : string)=>{
    decreaseAddonQuantity(CartItem , addonId);
    const updated = loadDealFromStorage();
    setDealData(updated);
  }


  const IncreaseDealExtraQuantity = (cartItem  : any , extraId : string)=>{
    increaseExtraQuantity(cartItem,extraId)
    const updated = loadDealFromStorage();
    setDealData(updated)
  }


  const DecreaseDealExtraQuantity = (cartItem  : any , extraId : string)=>{
    decreaseExtraQuantity(cartItem , extraId)
    const updated = loadDealFromStorage();
    setDealData(updated)
  }


  const  IncreaseItemAddonQuantity = (cartItem : any , addonId : string)=>{
    increaseItemAddon(cartItem , addonId);
    const updated = loadCartFromStorage();
    setAddedInCart(updated)
  }


  const  DecreaseItemAddonQuantity = (cartItem : any , addonId : string)=>{
    decreaseItemAddon(cartItem , addonId);
    const updated = loadCartFromStorage();
    setAddedInCart(updated);
  }  


  const IncreaseItemExtraQuantity = (cartItem : any , extraId : string)=>{
    increaseItemExtra(cartItem , extraId)
    const updated = loadCartFromStorage();
    setAddedInCart(updated);
  }


  const DecreaseItemExtraQuantity = (cartItem : any , extraId : string)=>{
    decreaseItemExtra(cartItem , extraId);
    const updated = loadCartFromStorage();
    setAddedInCart(updated);
  }

  

  const removeItemFromCart = (variant : any) => {
    removeCartItem(variant)
    const updatedCart = loadCartFromStorage();
    setAddedInCart(updatedCart);
  };


  const removeDealFromCart = (deal : any)=>{
    removeDealItem(deal);
    const updatedCart = loadDealFromStorage();
    setDealData(updatedCart);
  };



  const ClearCart = () => {
    removeItems();
    setDealData([]);
    setAddedInCart([]);
  };


  const UpdateAddressData = (orderType: any) => {
    // write into sessionStorage instead of localStorage
    localStorage.setItem("addressData", JSON.stringify(orderType));
  
    // read it back out
    const raw = localStorage.getItem("addressData");
    const AddressData = raw ? JSON.parse(raw) : {};
  
    setAddressData(AddressData);
  };


  useEffect(() => {
    const data = loadCartFromStorage();
    const Deal = loadDealFromStorage();
    const addressData = JSON.parse(localStorage.getItem("addressData") || "{}");
    setAddressData(addressData ?? "");
    setAddedInCart(data);

    const defaultAddress = localStorage.getItem("defaultAddress");
    _setDefaultAddress(defaultAddress ?? "");
    setDealData(Deal);
  },[]);



  return (
    <CartContext.Provider value={{ AddedInCart, setAddedInCart , updateCart , removeItemFromCart , ClearCart , UpdateAddressData , AddressData , newAddress , setNewAddress , defaultAddress , setDefaultAddress , deliveryAddress , setDeliveryAddress , deliveryName , setDeliveryName , deliveryPhone , setDeliveryPhone , comment , setComment , user , setUser , token , setLoggedIn , authOpen , setAuthOpen  , favorite , setFavorite , couponData , setCouponData , TaxData , setTaxData , dineInClose , setDineInClose , pickupClose , setPickupClose , deliveryClose , setDeliveryClose , refreshToken , setRefreshToken , couponCode , setCouponCode , DecreaseQuantity , IncreaseQuantity , isTaxAppliedBeforeCoupon , setIsTaxAppliedBeforeCoupon , deals , setDeals , dealData , updateDealCart , IncreaseDealQuantity , DecreaseDealQuantity ,removeDealFromCart , IncreaseDealAddonQuantity , DecreaseDealAddonQuantity , IncreaseDealExtraQuantity , DecreaseDealExtraQuantity , IncreaseItemAddonQuantity , DecreaseItemAddonQuantity , IncreaseItemExtraQuantity , DecreaseItemExtraQuantity }}>
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
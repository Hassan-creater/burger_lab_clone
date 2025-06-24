import { AddOn, CartState } from "@/types";
import { useEffect, useMemo, useState } from "react";
import useCart from "./useCart";
import { Item } from "@/models/Item";

export default function useProductDescription(product: any) {
  const { items } = useCart();
  
  // Always use the first variant's price
  const variantPrice = useMemo(() => 
    product.variants[0]?.price || 0, 
    [product]
  );

  const [item, setItem] = useState<CartState>({
    itemInCart: undefined,
    isItemInCart: false,
  });
  
  const [extraOptions, setExtraOptions] = useState<AddOn[] | undefined>(
    product.addOns
  );

  const [quantityToAdd, setQuantityToAdd] = useState(
    item.isItemInCart ? item.itemInCart!.quantity ?? 1 : 1
  );

  const addOnsPrice = useMemo(() => {
    return extraOptions?.reduce((acc, current) => {
      let priceToAdd: number = 0;
      current.addOnOptions?.forEach((option) => {
        if (option.isChecked) priceToAdd = option.price ?? 0;
      });
      return acc + priceToAdd;
    }, 0) || 0;
  }, [extraOptions]);

  // CORRECTED totalPrice calculation
  const totalPrice = useMemo(() => {
    if (extraOptions) {
      // For items with add-ons: (base price + add-ons) * quantity
      return (variantPrice + addOnsPrice) * quantityToAdd;
    }
    // For simple items: base price * quantity
    return variantPrice * quantityToAdd;
  }, [addOnsPrice, extraOptions, variantPrice, quantityToAdd]);

  useEffect(() => {
    const foundItem = items.find((item) => item.id === product.id);
    setItem({
      itemInCart: foundItem,
      isItemInCart: !!foundItem,
    });
    
    // Reset quantity if item is not in cart
    if (!foundItem) {
      setQuantityToAdd(1);
    }
  }, [items, product.id]);

  return {
    extraOptions,
    setExtraOptions,
    item,
    setItem,
    quantityToAdd,
    setQuantityToAdd,
    totalPrice,
    variantPrice
  };
}
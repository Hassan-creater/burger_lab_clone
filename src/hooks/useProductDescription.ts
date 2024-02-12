import { AddOn, CartState, MenuProduct } from "@/types";
import { useEffect, useMemo, useState } from "react";
import useCart from "./useCart";

export default function useProductDescription(product: MenuProduct) {
    const { items } = useCart();
    const [extraOptions, setExtraOptions] = useState<AddOn[] | undefined>(product.addOns);

    const [item, setItem] = useState<CartState>({
        itemInCart: undefined,
        isItemInCart: false,
    });

    const [quantityToAdd, setQuantityToAdd] = useState(
        item.isItemInCart ? item.itemInCart!.quantity ?? 1 : 1
    );

    const addOnsPrice = useMemo(
        () =>
            extraOptions?.reduce((acc, current) => {
                let priceToAdd: number = 0;

                current.addOnOptions?.forEach((option) => {
                    if (option.isChecked) priceToAdd = option.price ?? 0;
                });

                return acc + priceToAdd;
            }, 0) || 0,
        [extraOptions]
    );

    useEffect(() => {
        setItem(() => ({
            itemInCart: items.find((item) => item.itemId === product.itemId),
            isItemInCart: !!items.find((item) => item.itemId === product.itemId),
        }));
    }, [items, product.itemId]);

    return {
        extraOptions,
        setExtraOptions,
        item,
        setItem,
        quantityToAdd,
        setQuantityToAdd,
        addOnsPrice
    }
}
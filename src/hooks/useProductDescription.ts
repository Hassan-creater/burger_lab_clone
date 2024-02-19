import { AddOn, CartState } from "@/types";
import { useEffect, useMemo, useState } from "react";
import useCart from "./useCart";
import { Item } from "@/models/Item";

export default function useProductDescription(product: Item) {
    const { items } = useCart();

    const [item, setItem] = useState<CartState>({
        itemInCart: undefined,
        isItemInCart: false,
    });
    const [extraOptions, setExtraOptions] = useState<AddOn[] | undefined>(product.addOns);

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

    const totalPrice = useMemo(() => extraOptions
        ? ((product.price * quantityToAdd) + addOnsPrice) + ((quantityToAdd - 1) * addOnsPrice)
        : product.price * quantityToAdd,
        [addOnsPrice, extraOptions, product.price, quantityToAdd]
    )

    useEffect(() => {
        setItem(() => ({
            itemInCart: items.find((item) => item.id === product.id),
            isItemInCart: !!items.find((item) => item.id === product.id),
        }));
    }, [items, product.id]);

    return {
        extraOptions,
        setExtraOptions,
        item,
        setItem,
        quantityToAdd,
        setQuantityToAdd,
        totalPrice
    }
}
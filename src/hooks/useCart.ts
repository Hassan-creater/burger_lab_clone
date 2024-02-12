import { CartItem, CartState, MenuProduct } from "@/types";
import useLocalStorage from "./useLocalStorage"; // Assuming it's still needed for initial load
import { useEffect, useState } from "react";
import { useCartStore } from "@/store";

interface CartFromLocalStorage {
	storedValue: { state: { items: CartItem[] }; version: number };
	filterItems: (filterFunc: any) => void;
	removeItem: () => void;
	setValue: (newValue: any) => void;
}

export default function useCart() {
	const [isChecked, setIsChecked] = useState(false)
	const { storedValue }: CartFromLocalStorage = useLocalStorage(
		"cartStore",
		[]
	);

	useEffect(() => {
		if (storedValue.state.items) {
			try {
				useCartStore.getState().setItems(storedValue.state.items);
				useCartStore.setState({ loading: false, persisted: true });
			} catch (error) {
				console.error("Failed to load stored cart items:", error);
			}
		} else {
			useCartStore.setState({ loading: false });
		}
	}, [storedValue.state?.items]);

	const handleAddToCart = (e: React.FormEvent<HTMLFormElement>, product: MenuProduct, item: CartState, quantityToAdd: number) => {
		//TODO incomplete and not working correctly
		e.preventDefault();
		product.addOns?.forEach((addOn) => {
			if (addOn.required) {
				const hasCheckedOption = addOn.addOnOptions?.some(
					(option) => option.isChecked === true
				);
				setIsChecked(!!hasCheckedOption);
			}
		});
		console.log(isChecked);
		if (isChecked)
			if (item.isItemInCart)
				// Check if item is already in cart. If yes, update quantity else add new item to cart.
				updateQuantity(product.itemId, quantityToAdd);
			else addItemToCart({ ...product, quantity: quantityToAdd });
		else alert("Please select an option");
	};

	const {
		items,
		addItemToCart,
		updateQuantity,
		removeItemFromCart,
		clearCart,
		loading,
		persisted,
	} = useCartStore((state) => ({ ...state }));

	return {
		items,
		addItemToCart,
		updateQuantity,
		removeItemFromCart,
		clearCart,
		loading,
		persisted,
		handleAddToCart,
	};
}

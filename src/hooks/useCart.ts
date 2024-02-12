/*import { CartItem } from "@/types";
import useLocalStorage from "./useLocalStorage";
import { Dispatch, useReducer } from "react";

enum ReducerCartTypes {
	ADD_TO_CART = "ADD_TO_CART",
	REMOVE_FROM_CART = "REMOVE_FROM_CART",
	CLEAR_CART = "CLEAR_CART",
	UPDATE_QUANTITY = "UPDATE_QUANTITY",
}

export default function useCart() {
	const cartItems = useLocalStorage("cartItems", []);

	const reducer = (
		state: CartItem[] | [],
		action: { type: string; payload?: any }
	) => {
		switch (action.type) {
			case ReducerCartTypes.ADD_TO_CART:
				cartItems.setValue((prevState: CartItem[]) => [
					...prevState,
					action.payload,
				]);

				return [...state, action.payload];

			case ReducerCartTypes.UPDATE_QUANTITY:
				cartItems.setValue((prevState: CartItem[]) =>
					prevState.map((item) =>
						item.itemId === action.payload.itemId
							? { ...item, quantity: action.payload.quantity }
							: item
					)
				);

				return [...state, action.payload];

			case ReducerCartTypes.REMOVE_FROM_CART:
				cartItems.filterItems(
					(item: CartItem) => item.itemId !== action.payload.itemId
				);

				return state.filter(
					(cartItem: CartItem) => cartItem.itemId !== action.payload.itemId
				);

			case ReducerCartTypes.CLEAR_CART:
				cartItems.removeItem();
				return [];

			default:
				return state;
		}
	};

	const initialState = (cartItems.storedValue as CartItem[]) || [];

	const [items, dispatch]: [
		items: CartItem[],
		dispatch: Dispatch<{ type: string; payload?: any }>
	] = useReducer(reducer, initialState);

	const addToCart = (cartItem: CartItem) => {
		dispatch({ type: ReducerCartTypes.ADD_TO_CART, payload: cartItem });
		console.log(cartItems.storedValue);
	};

	const updateQuantity = (itemId: string, quantity: number) => {
		dispatch({
			type: ReducerCartTypes.UPDATE_QUANTITY,
			payload: { itemId, quantity },
		});
		console.log(cartItems.storedValue);
	};

	const removeFromCart = (itemId: string) => {
		dispatch({ type: ReducerCartTypes.REMOVE_FROM_CART, payload: { itemId } });
		console.log(items);
	};

	const clearCart = () => {
		dispatch({ type: ReducerCartTypes.CLEAR_CART });
		console.log(items);
	};

	const cart_items = cartItems.storedValue as CartItem[];

	return {
		cart_items,
		addToCart,
		updateQuantity,
		removeFromCart,
		clearCart,
	};
}
*/

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "@/types";
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

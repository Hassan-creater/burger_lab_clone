import { AddOn, CartItem, CartState, MenuProduct } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useCartStore } from "@/store";
import { cartItemKeys } from "@/lib/constants";
import { toast } from "sonner";
import { removePropFromObject } from "@/lib/utils";
import { Item } from "@/models/Item";
import useLocalStorage from "./useLocalStorage";


export interface CartFromLocalStorage {
	storedValue: { state?: { items: CartItem[] }; version?: number };
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

	const {
		items,
		addItemToCart,
		updateQuantity,
		removeItemFromCart,
		clearCart,
		loading,
		persisted,
	} = useCartStore((state) => ({ ...state }));

	const calculateSubTotal = useCallback(
		(setSubTotal: React.Dispatch<React.SetStateAction<number>>) =>
			setSubTotal(() => {
				return items.reduce(
					(accumulator, currentItem) =>
						accumulator +
						currentItem.totalPerPriceWithAddOns * (currentItem.quantity ?? 1),
					0
				);
			}),
		[items]
	);

	const calculateAndSetItemQuantity = useCallback(
		(setCartItemsQuantity: React.Dispatch<React.SetStateAction<number>>) =>
			setCartItemsQuantity(
				items.reduce(
					(accumulator, current) => accumulator + (current.quantity ?? 0),
					0
				)
			),
		[items]
	);

	const calculateAndSetTotal = useCallback(
		(subTotal: number, deliveryCharges: number, setTotal: React.Dispatch<React.SetStateAction<number>>,
			tax: string, discount: string) =>
			setTotal(() => {
				const totalWithoutDiscount = subTotal +
					deliveryCharges +
					((parseInt(tax) / 100) * subTotal);
				return totalWithoutDiscount - (parseInt(discount) / 100) * totalWithoutDiscount
			}
			),
		[]
	);

	useEffect(() => {
		if (storedValue?.state) {
			try {
				useCartStore.getState().setItems(storedValue.state.items);
				useCartStore.setState({ loading: false, persisted: true, });
			} catch (error) {
				console.error("Failed to load stored cart items:", error);
			}
		} else {
			useCartStore.setState({ loading: false });
		}
	}, [storedValue?.state?.items, storedValue?.state]);


	useEffect(() => { useCartStore.persist.rehydrate() }, [])

	const handleAddToCart = (e: React.FormEvent<HTMLFormElement>, item: CartState, quantityToAdd: number, product: Item, totalPrice: number, addOns?: AddOn[]) => {
		//TODO - fix issue that form of item is not submitted correctly on first time even after all required options are selected
		e.preventDefault();
		addOns?.forEach((addOn) => {
			if (addOn.required) {
				const hasCheckedOption = addOn.addOnOptions?.some(
					(option) => option.isChecked === true
				);
				setIsChecked(!!hasCheckedOption);
			}
		});

		const cartItem = removePropFromObject<CartItem>(cartItemKeys, product);
		console.log(cartItem)
		if (!!addOns) {
			if (isChecked) {
				const allSelectedAddOnOptions = addOns.map(addOn => addOn.addOnOptions!.filter(option => option.isChecked === true)[0]);
				if (item.isItemInCart) {
					// Check if item is already in cart. If yes, update quantity else add new item to cart.
					updateQuantity(product.id, quantityToAdd);
					toast.success('Item Updated in Cart Successfully', { style: { backgroundColor: 'green', color: 'white' }, closeButton: true, dismissible: true });
				}
				else {
					console.log(totalPrice);

					addItemToCart(
						{
							...cartItem,
							quantity: quantityToAdd,
							addOnOptions: allSelectedAddOnOptions,
							// If Item is not already in cart so, we divide the price by totalQuantity so that we get price of each item with addOns which will later be multiplied by quantity in Cart to get total price of each item
							totalPerPriceWithAddOns: totalPrice / (!item.itemInCart ? quantityToAdd : 1)
						}
					);
					toast.success('Item Added to Cart Successfully', { style: { backgroundColor: 'green', color: 'white' }, closeButton: true, dismissible: true });
				}
			}
			else toast.error('Please Select all Required options and Try again.', { style: { backgroundColor: 'red', color: 'white' }, closeButton: true, dismissible: true });
		} else {
			if (item.isItemInCart) {
				// Check if item is already in cart. If yes, update quantity else add new item to cart.
				updateQuantity(product.id, quantityToAdd);
				toast.success('Item Updated in Cart Successfully', { style: { backgroundColor: 'green', color: 'white' }, closeButton: true, dismissible: true });
			}
			else {
				console.log(totalPrice);
				addItemToCart(
					{
						...cartItem,
						quantity: quantityToAdd,
						totalPerPriceWithAddOns: totalPrice / (!item.itemInCart ? quantityToAdd : 1)
					}
				);
				toast.success('Item Added to Cart Successfully', { style: { backgroundColor: 'green', color: 'white' }, closeButton: true, dismissible: true });
			}
		}
	};

	return {
		items,
		addItemToCart,
		updateQuantity,
		removeItemFromCart,
		clearCart,
		loading,
		persisted,
		handleAddToCart,
		calculateAndSetItemQuantity,
		calculateSubTotal,
		calculateAndSetTotal
	};
}

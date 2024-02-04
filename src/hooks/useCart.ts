
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "@/types";
import useLocalStorage from "./useLocalStorage"; // Assuming it's still needed for initial load
import { useEffect } from "react";

interface CartStore {
	items: CartItem[];
	loading: boolean;
	persisted: boolean;
	setItems: (items: CartItem[]) => void;
	addItemToCart: (item: CartItem) => void;
	updateQuantity: (itemId: string, quantity: number) => void;
	removeItemFromCart: (itemId: string) => void;
	clearCart: () => void;
}

interface CartFromLocalStorage {
	storedValue: { state: { items: CartItem[] }; version: number };
	filterItems: (filterFunc: any) => void;
	removeItem: () => void;
	setValue: (newValue: any) => void;
}

const useCartStore = create<CartStore>()(
	persist(
		(set) => ({
			items: [],
			loading: true,
			persisted: false,
			setItems: (items: CartItem[]) => set({ items }),
			addItemToCart: (item: CartItem) => {
				set((state) => ({ items: [...state.items, item] }));
			},
			updateQuantity: async (itemId: string, quantity: number) => {
				set((state) => ({
					items: state.items.map((item) =>
						item.itemId === itemId ? { ...item, quantity } : item
					),
				}));
			},
			removeItemFromCart: (itemId: string) => {
				set((state) => ({
					items: state.items.filter((item) => item.itemId !== itemId),
				}));
			},
			clearCart: () => {
				set({ items: [] });
			},
		}),
		{
			name: "cartStore",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ items: state.items }),
		}
	)
);

export default function useCart() {
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
	}, [storedValue.state.items]);

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
	};
}

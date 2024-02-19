import { CartItem } from "@/types";
import { StateCreator } from "zustand";
import { ObserverSlice } from "./observerSlice";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartSlice {
	items: CartItem[];
	loading: boolean;
	persisted: boolean;
	setItems: (items: CartItem[]) => void;
	addItemToCart: (item: CartItem) => void;
	updateQuantity: (itemId: number, quantity: number) => void;
	removeItemFromCart: (itemId: number) => void;
	clearCart: () => void;
}

export const useCartStore = create<CartSlice>()(
	persist(
		(set) => ({
			items: [],
			loading: true,
			persisted: false,
			setItems: (items: CartItem[]) => set({ items }),
			addItemToCart: (item: CartItem) => {
				set((state) => ({ items: [...state.items, item] }));
			},
			updateQuantity: async (itemId: number, quantity: number) => {
				set((state) => ({
					items: state.items.map((item) =>
						item.id === itemId ? { ...item, quantity } : item
					),
				}));
			},
			removeItemFromCart: (itemId: number) => {
				set((state) => ({
					items: state.items.filter((item) => item.id !== itemId),
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

// export const createCartSlice: StateCreator<
// 	CartSlice & ObserverSlice,
// 	[],
// 	[],
// 	CartSlice
// > = (set) => ({
// 	items: [],
// 	loading: true,
// 	persisted: false,
// 	setItems: (items: CartItem[]) => set({ items }),
// 	addItemToCart: (item: CartItem) => {
// 		set((state) => ({ items: [...state.items, item] }));
// 	},
// 	updateQuantity: async (itemId: string, quantity: number) => {
// 		set((state) => ({
// 			items: state.items.map((item) =>
// 				item.itemId === itemId ? { ...item, quantity } : item
// 			),
// 		}));
// 	},
// 	removeItemFromCart: (itemId: string) => {
// 		set((state) => ({
// 			items: state.items.filter((item) => item.itemId !== itemId),
// 		}));
// 	},
// 	clearCart: () => {
// 		set({ items: [] });
// 	},
// });

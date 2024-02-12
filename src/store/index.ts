import { create } from "zustand";
// import { CartSlice, createCartSlice } from "./slices/cartSlice";
// import { ObserverSlice, createObserverSlice } from "./slices/observerSlice";
import { useCartStore } from "./slices/cartSlice";
import { useObserverStore } from "./slices/observerSlice";

//TODO -> Merge all slices to a single store

// const useBoundStore = create<CartSlice & ObserverSlice>()((...a) => ({
// 	...createCartSlice(...a),
// 	...createObserverSlice(...a),
// }));

// export default useBoundStore;

export { useCartStore, useObserverStore };

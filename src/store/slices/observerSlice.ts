import { StateCreator } from "zustand";
import { CartSlice } from "./cartSlice";
import { create } from "zustand";

export interface ObserverSlice {
	isBannerVisible: boolean;
	activeSectionId?: string;
	loading: boolean;
	persisted: boolean;
	setIsBannerVisible(isBannerVisible: boolean): void;
	setActiveSectionId(sectionId: string | undefined): void;
}

export const useObserverStore = create<ObserverSlice>((set) => ({
	isBannerVisible: true,
	loading: true,
	persisted: false,
	setIsBannerVisible: (isBannerVisible) => set({ isBannerVisible }),
	setActiveSectionId: (sectionId) => set({ activeSectionId: sectionId }),
}));

// export const createObserverSlice: StateCreator<
// 	ObserverSlice & CartSlice,
// 	[],
// 	[],
// 	ObserverSlice
// > = (set) => ({
// 	isBannerVisible: true,
// 	loading: true,
// 	persisted: false,
// 	setIsBannerVisible: (isBannerVisible: boolean) => set({ isBannerVisible }),
// 	setActiveSectionId: (sectionId: string) =>
// 		set({ activeSectionId: sectionId }),
// });

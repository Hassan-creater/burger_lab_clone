export type AddOnOption = {
	label: string;
	price?: number;
	isChecked?: boolean;
}

export type AddOn = {
	heading: string;
	required?: boolean;
	labels?: string[];
	addOnOptions?: AddOnOption[]
}

export type CartItem = {
	itemImage: string;
	itemId: string;
	itemName: string;
	itemDescription?: string;
	quantity?: number;
	price: number;
	discountedPrice?: number;
	addOns?: AddOn[];
};

export type MenuProduct = Omit<CartItem, "quantity"> & {
	category: string;
}

export type CartState = {
	itemInCart?: CartItem;
	isItemInCart: boolean;
};
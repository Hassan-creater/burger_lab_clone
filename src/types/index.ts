export type CartItem = {
	itemImage: string;
	itemId: string;
	itemName: string;
	itemDescription?: string;
	quantity?: number;
	price: number;
    discountedPrice?: number;
};

export type MenuProduct = Omit<CartItem, "quantity">
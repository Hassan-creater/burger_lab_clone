"use client";

import QuantityCounter from "@/components/cart/QuantityCounter";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import useCart from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { CartItem, MenuProduct } from "@/types";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

type CartState = {
	itemInCart?: CartItem;
	isItemInCart: boolean;
};

function ProductCard({ product }: { product: MenuProduct }) {
	const [item, setItem] = React.useState<CartState>({
		itemInCart: undefined,
		isItemInCart: false,
	});
	const { addItemToCart, items } = useCart();

	React.useEffect(() => {
		setItem(() => ({
			itemInCart: items.find((item) => item.itemId === product.itemId),
			isItemInCart: !!items.find((item) => item.itemId === product.itemId),
		}));
	}, [items, product.itemId]);

	return (
		<Card className="w-40 min-[500px]:w-52 h-auto rounded-2xl transition-colors border-2 hover:border-[#fabf2c]">
			<CardHeader title={product.itemName} className="relative p-2">
				<div className="flex items-center w-full justify-center">
					<Image
						src={product.itemImage}
						width={100}
						height={100}
						alt="product-image"
						className="rounded-2xl object-contain w-full h-auto"
					/>
				</div>
				<Button
					variant="default"
					className="p-2 rounded-full flex items-center justify-center absolute top-2 right-2 bg-gray-200 text-black hover:bg-gray-300">
					<HeartIcon className="hover:text-red-500" />
				</Button>
			</CardHeader>
			<CardContent
				title={product.itemDescription ?? ""}
				className="flex flex-col items-center justify-center py-3">
				<h4 className="font-bold text-md text-center">{product.itemName}</h4>
				{product.itemDescription ? (
					<p className="text-sm font-normal text-gray-500 text-center">
						{product.itemDescription}
					</p>
				) : null}
			</CardContent>
			<hr className="bg-categorySeparatorGradient w-[95%] mx-auto h-px my-1 block" />
			<CardFooter
				title="Add to cart"
				className="fle flex-col items-center justify-center gap-1 pt-5 pb-3">
				<p className="text-md- text-center font-bold">{`Rs. ${product.price}`}</p>
				{!item.isItemInCart ? (
					<Button
						variant="outline"
						onClick={() => addItemToCart({ ...product, quantity: 1 })}
						className={
							"p-4 font-bold text-black bg-[#fabf2c] rounded-3xl !hover:border-[#fabf2c]"
						}>
						Add to Cart
					</Button>
				) : (
					<QuantityCounter
						itemId={product.itemId}
						quantity={item.itemInCart!.quantity ?? 0}
						className="bg-accent rounded-2xl p-2"
					/>
				)}
			</CardFooter>
		</Card>
	);
}

export default ProductCard;

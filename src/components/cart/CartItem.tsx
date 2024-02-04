import type { CartItem } from "@/types";
import React from "react";
import QuantityCounter from "./QuantityCounter";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";

interface CartItemProps {
	cartItem: CartItem;
	removeItem: (itemId: string) => void;
}

function CartItem({ cartItem, removeItem }: CartItemProps) {
	return (
		<>
			<hr className="self-center bg-categorySeparatorGradient w-full h-px my-3 block" />
			<article key={cartItem.itemId} className="flex w-full gap-2">
				<div className="flex items-start justify-center w-1/4">
					<Image
						src={cartItem.itemImage}
						alt={cartItem.itemName}
						width={100}
						height={100}
						className="object-contain rounded-lg"
					/>
				</div>
				<div className="w-3/4 flex flex-col gap-2">
					<div className="flex flex-col">
						<h5 className="text-lg font-bold self-start">
							{cartItem.itemName}
						</h5>
						{cartItem.itemDescription ? (
							<p className="text-gray-500 w-[70%] text-sm font-normal self-start">
								{cartItem.itemDescription}
							</p>
						) : null}
						<p className="text-lg font-normal self-end">{`Rs. ${cartItem.price}`}</p>
					</div>
					<div className="flex justify-between items-center w-full h-full">
						{cartItem.quantity ? (
							<QuantityCounter
								quantity={cartItem.quantity}
								itemId={cartItem.itemId}
							/>
						) : null}
						<Button
							variant="outline"
							onClick={() => removeItem(cartItem.itemId)}
							className="flex items-center justify-center p-2 rounded-full">
							<Trash2Icon className="w-5 h-auto" />
						</Button>
					</div>
				</div>
			</article>
		</>
	);
}

export default CartItem;

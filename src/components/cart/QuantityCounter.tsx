"use client";

import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useCart from "@/hooks/useCart";
import { cn } from "@/lib/utils";

function QuantityCounter({
	quantity,
	itemId,
	className,
}: {
	quantity: number;
	itemId: string;
	className?: string;
}) {
	const { updateQuantity, removeItemFromCart } = useCart();

	return (
		<div className={cn("flex flex-1 gap-2 items-center h-full", className)}>
			<Button
				variant="ghost"
				onClick={() => {
					if (quantity === 1) {
						removeItemFromCart(itemId);
					} else {
						updateQuantity(itemId, quantity - 1);
					}
				}}
				title="remove"
				className="p-2 w-7 h-7 bg-[#fabf2c] transition-colors rounded-full text-xl text-black hover:ring-2 hover:ring-[#fabf2c]">
				-
			</Button>
			<Input
				type="number"
				value={quantity}
				onChange={() => {}}
				className="w-12 h-auto text-center p-1 focus-visible:ring-0  focus-visible:ring-offset-0"
			/>
			<Button
				variant="ghost"
				onClick={() => updateQuantity(itemId, quantity + 1)}
				title="add"
				className="p-2 w-7 h-7 bg-[#fabf2c] transition-colors rounded-full text-xl text-black hover:ring-2 hover:ring-[#fabf2c]">
				+
			</Button>
		</div>
	);
}

export default QuantityCounter;

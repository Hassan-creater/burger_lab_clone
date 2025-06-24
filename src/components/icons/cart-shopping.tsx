import { cn } from "@/lib/utils";
import Image from "next/image";

interface IconProps {
	width: number;
	height: number;
    className?: string;
}

const ShoppingBagIcon = ({ width, height, className }: IconProps) => {
	return (
		<Image
			src="/icons/shopping-bag.svg"
			alt="shopping-bag-icon"
			className={cn(
				"cursor-pointer  transition-colors hover:opacity-75",
				className
			)}
			width={width}
			height={height}
		/>
	);
};

export default ShoppingBagIcon;

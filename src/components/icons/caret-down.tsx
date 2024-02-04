import { cn } from "@/lib/utils";
import Image from "next/image";

interface IconProps {
	width: number;
	height: number;
    className?: string;
}

const CaretDown = ({ width, height, className }: IconProps) => {
	return (
		<Image
			src="/icons/caret-down.svg"
			alt="caret-down-icon"
			className={cn(
				"cursor-pointer transition-colors hover:opacity-75",
				className
			)}
			width={width}
			height={height}
		/>
	);
};

export default CaretDown;

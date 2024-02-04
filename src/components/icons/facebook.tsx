import { cn } from "@/lib/utils";
import Image from "next/image";

interface IconProps {
	width: number;
	height: number;
	className?: string;
}

const FacebookIcon = ({ width, height, className }: IconProps) => {
	return (
		<Image
			src="/icons/facebook.svg"
			alt="facebook-icon"
			className={cn(
				"cursor-pointer transition-colors hover:opacity-75",
				className
			)}
			width={width}
			height={height}
		/>
	);
};

export default FacebookIcon;

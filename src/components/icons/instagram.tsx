import { cn } from "@/lib/utils";
import Image from "next/image";

interface IconProps {
	width: number;
	height: number;
	className?: string;
}

const InstagramIcon = ({ width, height, className }: IconProps) => {
	return (
		<Image
			src="/icons/instagram.svg"
			alt="instagram-icon"
			className={cn(
				"cursor-pointer transition-colors hover:opacity-75",
				className
			)}
			width={width}
			height={height}
		/>
	);
};

export default InstagramIcon;

import { cn } from "@/lib/utils";
import Image from "next/image";

interface IconProps {
	width: number;
	height: number;
    className?: string;
}

const LocationDropIcon = ({ width, height, className }: IconProps) => {
	return (
		<Image
			src="/icons/location.svg"
			alt="location-drop-icon"
			className={cn(
				"cursor-pointer transition-colors hover:opacity-75",
				className
			)}
			width={width}
			height={height}
		/>
	);
};

export default LocationDropIcon;

import { cn } from "@/lib/utils";
import Image from "next/image";

interface IconProps {
	width: number;
	height: number;
	className?: string;
}

const SearchIcon = ({ width, height, className }: IconProps) => {
	return (
		<Image
			src="/icons/magnifying-glass.svg"
			alt="search-icon"
			className={cn(
				"cursor-pointer transition-colors hover:opacity-75",
				className
			)}
			width={width}
			height={height}
		/>
	);
};

export default SearchIcon;

import React from "react";
import { Button } from "./ui/button";
import { HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
	className?: string;
}

function LikeButton({ className }: LikeButtonProps) {
	return (
		<Button
			variant="default"
			className={cn(
				"p-2 rounded-full flex items-center justify-center absolute top-2 right-2 bg-gray-200 text-black hover:bg-gray-300",
				className
			)}>
			<HeartIcon className="hover:text-red-500" />
		</Button>
	);
}

export default LikeButton;

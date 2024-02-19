import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function textShortner(text: string, charactersLimit: number) {
	return text.length > charactersLimit
		? `${text.substring(0, charactersLimit)}...`
		: text;
}

export function formatPrice(price: number) {
	return `Rs. ${price.toFixed(2)}`;
}

export function removePropFromObject<T>(keysToInclude: string[], objectToRemovePropsFrom: Record<string, any>): T {
	return keysToInclude.reduce(
		(obj, key) =>
			({ ...obj, [key]: objectToRemovePropsFrom[key] }),
		{}) as T;
}

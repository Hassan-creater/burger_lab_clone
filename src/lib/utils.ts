
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function textShortener(text: string, charactersLimit: number) {
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

export function formatDate(timeStr: string) {
	// Check if the input string is in the correct format
	if (timeStr) {
		// Extract hours, minutes, and seconds
		const [hours, minutes, _seconds] = timeStr?.split(":")?.map(Number);

		// Convert to 12-hour format
		let hour = hours % 12;
		if (hour === 0) {
			hour = 12;
		}

		// Add AM/PM indicator
		const period = hours < 12 ? "AM" : "PM";

		// Format the output string
		return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
	} else {
		return timeStr;
	}
}

export function formatIntlDate(date?: string, options?: Intl.DateTimeFormatOptions) {
	if (!date) return "";
	return new Intl.DateTimeFormat("en-US", {
		hour12: true,
		hour: "2-digit",
		minute: "2-digit",
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "Asia/Karachi",
		...options
	}).format(new Date(date));
}

export function isArray(param: any) {
	// Check if the parameter is null or undefined
	if (param === null || param === undefined) {
		return false;
	}

	// Use Array.isArray() for built-in array detection
	if (Array.isArray(param)) {
		return true;
	}

	// Check if the parameter has a typeof of "object"
	if (typeof param === "object") {
		return false;
	}

	return false;
}

export function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

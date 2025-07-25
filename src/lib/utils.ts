import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function textShortener(text: string, charactersLimit: number) {
	return text?.length > charactersLimit
		? `${text.substring(0, charactersLimit)}...`
		: text;
}

export function formatPrice(price?: number) {
	return `Rs. ${price?.toFixed(2)}`;
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

// Helper function to format error messages from API responses
export const formatErrorMessage = (error: any): string => {
	if (typeof error === 'string') {
		return error;
	}
	
	if (error.response?.data?.error) {
		const errorData = error.response.data.error;
		
		// Handle JSON string format like "{\"password\":\"String must contain at least 8 character(s)\"}"
		if (typeof errorData === 'string' && errorData.startsWith('{') && errorData.endsWith('}')) {
			try {
				const parsedError = JSON.parse(errorData);
				const messages: string[] = [];
				
				Object.entries(parsedError).forEach(([field, message]) => {
					if (Array.isArray(message)) {
						messages.push(`${field}: ${message[0] || message}`);
					} else if (typeof message === 'string') {
						messages.push(`${field}: ${message}`);
					}
				});
				
				return messages.join(', ');
			} catch (e) {
				// If JSON parsing fails, return the original string
				return errorData;
			}
		}
		
		// If it's an object with validation errors
		if (typeof errorData === 'object' && errorData !== null) {
			const messages: string[] = [];
			
			Object.entries(errorData).forEach(([field, message]) => {
				if (Array.isArray(message)) {
					// Handle array format like ['password']: "string etc"
					messages.push(`${field}: ${message[0] || message}`);
				} else if (typeof message === 'string') {
					messages.push(`${field}: ${message}`);
				}
			});
			
			return messages.join(', ');
		}
		
		// If it's a string
		if (typeof errorData === 'string') {
			return errorData;
		}
	}
	
	return "An error occurred. Please try again.";
};



export function extractUnavailableAddonsOrExtrasError(error: any): string {
	if (!error || typeof error !== 'object') return String(error);
	let message = '';
	// Helper to format a section
	const formatSection = (title: string, arr: any[]) => {
	  if (!Array.isArray(arr) || arr.length === 0) return '';
	  return `${title}:
  ${arr.map((entry: any) => `  • ${entry.name || 'Unknown'}`).join('\n')}`;
	};
	const sections = [];
	if (Array.isArray(error.unavailableAddons) && error.unavailableAddons.length > 0) {
	  sections.push(formatSection('Unavailable Addons', error.unavailableAddons));
	}
	if (Array.isArray(error.unavailableExtras) && error.unavailableExtras.length > 0) {
	  sections.push(formatSection('Unavailable Extras', error.unavailableExtras));
	}
	if (Array.isArray(error.unavailableItems) && error.unavailableItems.length > 0) {
	  sections.push(formatSection('Unavailable Items', error.unavailableItems));
	}
	if (Array.isArray(error.unavailableVariants) && error.unavailableVariants.length > 0) {
	  sections.push(formatSection('Unavailable Variants', error.unavailableVariants));
	}
	if (sections.length > 0) {
	  message = sections.join('\n\n');
	  return message;
	}
	// fallback: show stringified error
	return typeof error === 'string' ? error : JSON.stringify(error);
  }



  export function formatDisplayId(displayIdMetadata: string, orderId: number): string {
	let paddedId = orderId.toString();  
	return displayIdMetadata.replace('($)', paddedId);
  }


  export function formatDateByPattern(dateInput: string | Date, formatPattern: string): string {
	const date = dayjs(dateInput);
  
	// Validate if it's a valid date
	if (!date.isValid()) {
	  return "Invalid date";
	}
  
	return date.format(formatPattern);
  }
  
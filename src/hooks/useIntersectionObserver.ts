import { useEffect, useState } from "react";

interface IntersectionObserverOptions {
	root?: HTMLElement | null;
	rootMargin?: string;
	threshold?: number | number[];
}

export function useIntersectionObserver(
	ref: React.RefObject<HTMLElement>,
	options?: IntersectionObserverOptions
): boolean {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			setIsVisible(entry.isIntersecting);
		}, options);

		const element = ref.current;
		if (element) {
			observer.observe(element);
		}

		return () => {
			if (element) {
				observer.unobserve(element);
				observer.disconnect();
			}
		};
	}, [ref, options]);

	return isVisible;
}

import { useEffect, useState } from "react";

export default function useSectionId() {
	const [sectionId, setSectionId] = useState<string | null>(null);

	useEffect(() => {
		const handleHashChange = () => {
			setSectionId(window.location.hash.slice(1));
		};

		window.addEventListener("hashchange", handleHashChange);

		return () => {
			window.removeEventListener("hashchange", handleHashChange);
		};

	}, []);

	return sectionId;
}

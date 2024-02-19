import { useCallback, useEffect, useState } from "react";

export default function useLocalStorage(key: string, initialValue: any) {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window && localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error("Error reading localStorage item:", error);
			return initialValue;
		}
	});

	useEffect(() => {
		const handleChangeInStorage = () => {
			try {
				const valueFromStorage = localStorage.getItem(key);
				if (valueFromStorage) {
					setStoredValue(JSON.parse(valueFromStorage));
				} else {
					localStorage.setItem(key, JSON.stringify(initialValue));
					setStoredValue(initialValue);
				}
			} catch (error) {
				console.error("Error reading localStorage item:", error);
			}
		};

		window.addEventListener("storage", handleChangeInStorage);

		return () => window.removeEventListener("storage", handleChangeInStorage);
	}, [key, initialValue]);

	const setValue = useCallback(
		(newValue: any) => {
			try {
				const valueToStore =
					newValue instanceof Function ? newValue(storedValue) : newValue;
				setStoredValue(valueToStore);
				localStorage.setItem(key, JSON.stringify(valueToStore));
			} catch (error) {
				console.error("Error storing localStorage item:", error);
			}
		},
		[key, storedValue]
	);

	const filterItems = useCallback(
		(filterFunc: any) => {
			const filteredItems = storedValue.filter((value: any) =>
				filterFunc(value)
			);
			setStoredValue(filteredItems);
			localStorage.setItem(key, JSON.stringify(filteredItems));
		},
		[key, storedValue]
	);

	const removeItem = useCallback(() => {
		setStoredValue(initialValue);
		setValue(initialValue);
	}, [initialValue, setValue]);

	const clearStorage = useCallback(() => {
		localStorage.clear();
		setStoredValue(initialValue);
	}, [initialValue]);

	return { storedValue, setValue, removeItem, filterItems, clearStorage };
}

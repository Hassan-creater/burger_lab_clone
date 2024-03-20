import "client-only"

import {useCallback, useEffect, useState} from "react";

export default function useLocalStorage(key: string, initialValue: any) {

    const [storedValue, setStoredValue] = useState<any>(initialValue);

    useEffect(() => {
        try {
            if (typeof window !== undefined && window.localStorage) {
                const item = window.localStorage.getItem(key);
                // return item ? JSON.parse(item) : initialValue;
                setStoredValue(item ? JSON.parse(item) : initialValue);
            }
        } catch (error) {
            console.error("Error reading localStorage item:", error);
            // return initialValue;
            setStoredValue(initialValue);
        }

    }, []);

    useEffect(() => {
        const handleChangeInStorage = () => {
            try {
                console.log('Hello');
                if (key === "branch") {
                    const valueFromStorage = window.localStorage.getItem(key);
                    console.log(valueFromStorage);
                    if (valueFromStorage) {
                        setStoredValue(JSON.parse(valueFromStorage));
                    } else {
                        window.localStorage.setItem(key, JSON.stringify(initialValue));
                        setStoredValue(initialValue);
                    }
                }
            } catch (error) {
                console.error("Error reading localStorage item:", error);
            }
        };

        window.addEventListener("branchUpdate", handleChangeInStorage);

        return () => window.removeEventListener("branchUpdate", handleChangeInStorage);
    }, [key, initialValue]);


    const setValue =
        (newValue: any) => {
            if (typeof window !== undefined) {
                try {
                    const valueToStore =
                        newValue instanceof Function ? newValue(storedValue) : newValue;
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                    key === "branch" && window.dispatchEvent(new Event('branchUpdate'))
                    setStoredValue(valueToStore);
                } catch (error) {
                    console.error("Error storing localStorage item:", error);
                }
            }
        };

    const filterItems = useCallback(
        (filterFunc: any) => {
            if (typeof window !== undefined) {
                const filteredItems = storedValue.filter((value: any) =>
                    filterFunc(value)
                );
                window.localStorage.setItem(key, JSON.stringify(filteredItems));
                key === "branch" && window.dispatchEvent(new Event('branchUpdate'));
                setStoredValue(filteredItems);
            }
        },
        [key, storedValue]
    );

    const removeItem = () => {
        if (typeof window !== undefined) {
            setStoredValue(initialValue);
            setValue(initialValue);
        }
    }

    const clearStorage = useCallback(() => {
        if (typeof window !== undefined) {
            window.localStorage.clear();
            setStoredValue(initialValue);
        }
    }, [initialValue]);

    return {storedValue, setValue, removeItem, filterItems, clearStorage};
}

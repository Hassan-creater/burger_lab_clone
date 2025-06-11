import { useState, SetStateAction, Dispatch, useCallback, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Custom hook for managing a single search param
export const useSearchParam = (key: string, defaultValue?: string): [string, Dispatch<SetStateAction<string>>] => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(() => searchParams.get(key) || defaultValue || '');

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
            if (value === '' || !value) {
                params.delete(key)
            }

            return params.toString()
        },
        [searchParams, key]
    )

    useEffect(() => {
        router.push(`${pathname}?${createQueryString(key, query)}`, {
            scroll: false
        });
    }, [createQueryString, key, pathname, query, router])

    return [query, setQuery];
};

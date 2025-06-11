import { useEffect, useState } from "react";

export const useWindowSize = () => {
    const [windowWidth, setWindowWidth] = useState<number>(0);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleWidowResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleWidowResize);

        return () => {
            window.removeEventListener("resize", handleWidowResize);
        };
    }, []);

    return windowWidth;
}
import { useEffect, useState } from "react";

export enum Theme {
    LIGHT = "light",
    DARK = "dark",
}

function useTheme() {
    const [isClient, setIsClient] = useState<boolean>(false);
    const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) setTheme(window.localStorage.theme);
    }, [isClient]);

    useEffect(() => {
        if (isClient) {
            const root = window.document.documentElement;
            root.classList.remove(Theme.DARK);
            if (theme == Theme.DARK) root.classList.add(theme);
            window.localStorage.setItem("theme", theme);
        }
    }, [isClient, theme]);

    return [theme, setTheme] as const; // why as const hier idk
}

export default useTheme;

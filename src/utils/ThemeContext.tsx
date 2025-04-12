/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, ReactNode } from "react";
import { LOCAL_STORAGE_PREFIX } from "@/utils/constants";

type ThemeMode = "light" | "dark";
interface ThemeContextType {
    mode: ThemeMode;
    toggleMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined
);

const LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-mode`;

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<ThemeMode>(() => {
        // 1. Check local storage
        const storedMode = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedMode === "light" || storedMode === "dark") {
            return storedMode;
        }
        // 2. Check system preference
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

    useEffect(() => {
        // Update local storage and root element attribute when mode changes
        localStorage.setItem(LOCAL_STORAGE_KEY, mode);
        document.documentElement.setAttribute("data-theme", mode);
    }, [mode]);

    const toggleMode = () => {
        setMode(prevMode => (prevMode === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ mode, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

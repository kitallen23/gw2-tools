import { useContext } from "react";
import { ThemeContext } from "@/utils/ThemeContext";

// Type definition can be imported or redefined if preferred, importing is cleaner
// import type { ThemeContextType } from '@/contexts/ThemeContext';

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

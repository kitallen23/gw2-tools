import ky from "ky";
import { createContext, useContext } from "react";

type PasswordContextType = {
    password: string;
    setPassword: (key: string) => void;
    hasError: boolean;
    setHasError: (value: boolean) => void;
    api: typeof ky;
};

export const PasswordContext = createContext<PasswordContextType | undefined>(
    undefined
);

export function usePassword() {
    const context = useContext(PasswordContext);
    if (context === undefined) {
        throw new Error("usePassword must be used within a PasswordProvider");
    }
    return context;
}

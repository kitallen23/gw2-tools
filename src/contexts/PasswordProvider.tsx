import { PropsWithChildren, useMemo, useState } from "react";
import { PasswordContext } from "./PasswordContext";
import ky from "ky";

const apiUrl = import.meta.env.VITE_API_URL;

export function PasswordProvider({ children }: PropsWithChildren) {
    const [password, setPassword] = useState("");
    const [hasError, setHasError] = useState(false);

    const api = useMemo(() => {
        return ky.create({
            prefixUrl: `${apiUrl}/api`,
            timeout: 60000,
            headers: {
                "Api-Password": password,
            },
        });
    }, [password]);

    return (
        <PasswordContext.Provider
            value={{ password, setPassword, hasError, setHasError, api }}
        >
            {children}
        </PasswordContext.Provider>
    );
}

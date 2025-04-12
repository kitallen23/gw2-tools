import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    redirect,
} from "react-router-dom";

import "@radix-ui/themes/styles.css";
import "@/styles/global.css";
import { ThemeProvider } from "@/utils/ThemeContext";

import App from "@/App.tsx";
import Logs from "@/pages/Logs/Logs";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        loader: async ({ request }) => {
            // Redirect if the path is exactly "/"
            if (new URL(request.url).pathname === "/") {
                return redirect("/logs");
            }
            return null;
        },
        children: [
            {
                path: "logs",
                element: <Logs />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    </StrictMode>
);

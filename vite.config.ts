import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { fileURLToPath } from "url";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), vanillaExtractPlugin()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    optimizeDeps: {
        include: ["react-pdf"],
    },
});

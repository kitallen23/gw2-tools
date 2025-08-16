import { useState, useEffect } from "react";
import ky from "ky";

interface UploadState<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function useGetLog<T = any>(url: string | undefined): UploadState<T> {
    const [uploadState, setUploadState] = useState<UploadState<T>>({
        data: null,
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        if (!url) {
            setUploadState({ data: null, isLoading: false, error: null });
            return;
        }

        let upload;
        if ((url || "").includes("/getJson?id=")) {
            upload = async () => {
                setUploadState({ data: null, isLoading: true, error: null });

                try {
                    const rawJson = await ky.get(url || "").json<T>();

                    setUploadState({
                        data: rawJson,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    console.error("Upload failed:", error);
                    setUploadState({
                        data: null,
                        isLoading: false,
                        error:
                            error instanceof Error
                                ? error
                                : new Error("Upload failed"),
                    });
                }
            };
        } else {
            upload = async () => {
                setUploadState({ data: null, isLoading: true, error: null });
                const jsonUrl = "https://dps.report/getJson";

                try {
                    const rawJson = await ky
                        .get(`${jsonUrl}?permalink=${url}`)
                        .json<T>();

                    setUploadState({
                        data: rawJson,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    console.error("Upload failed:", error);
                    setUploadState({
                        data: null,
                        isLoading: false,
                        error:
                            error instanceof Error
                                ? error
                                : new Error("Upload failed"),
                    });
                }
            };
        }

        upload();
    }, [url]);

    return uploadState;
}

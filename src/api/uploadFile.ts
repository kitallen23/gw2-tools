import { useState, useEffect } from "react";
import ky from "ky";

interface UploadState<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
}

interface UploadResponse {
    permalink: string;
}

/**
 * Custom hook to upload a file when the file input changes.
 * @param file - The file object to upload, or null/undefined.
 * @returns An object containing the upload state: data, isLoading, error.
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function useGetLog<T = any>(
    file: File | null | undefined,
    url: string | undefined
): UploadState<T> {
    const [uploadState, setUploadState] = useState<UploadState<T>>({
        data: null,
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        if (!file && !url) {
            setUploadState({ data: null, isLoading: false, error: null });
            return;
        }

        let upload;
        if (file) {
            upload = async () => {
                setUploadState({ data: null, isLoading: true, error: null });
                const formData = new FormData();
                formData.append("file", file);
                const uploadUrl =
                    "https://dps.report/uploadContent?json=1&generator=ei";
                const jsonUrl = "https://dps.report/getJson";

                try {
                    const response = await ky
                        .post(uploadUrl, {
                            body: formData,
                        })
                        .json<UploadResponse>();

                    const rawJson = await ky
                        .get(`${jsonUrl}?permalink=${response.permalink}`)
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
        } else if ((url || "").includes("/getJson?id=")) {
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
    }, [file, url]);

    return uploadState;
}

import { useState, useEffect } from "react";
import { AnimeRelease } from "../types";

// src/hooks/useReleaseData.ts
export const useReleaseData = () => {
    const [releases, setReleases] = useState<AnimeRelease[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const abortController = new AbortController();

        const loadReleases = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/data/animeRelease.json", {
                    signal: abortController.signal,
                    headers: {
                        Accept: "application/json"
                    }
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();

                // Pre-process data once
                const transformedData = data.map((release: any) => ({
                    ...release,
                    malId: release.malId
                    // Add any other transformations needed
                }));

                setReleases(transformedData);
            } catch (err: unknown) {
                if (err instanceof Error && err.name === "AbortError") return;
                const error = err instanceof Error ? err : new Error("An unknown error occurred");
                setError(error);
                console.error("Error loading release data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadReleases();

        return () => abortController.abort();
    }, []);

    return { releases, isLoading, error };
};

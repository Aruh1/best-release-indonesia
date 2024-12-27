import { useState, useEffect, useRef } from "react";
import { AnimeRelease, CachedAnimeData } from "../types";
import { fetchAnimeData } from "../utils/api";

export const useAnimeData = (filteredReleases: AnimeRelease[]) => {
    const [animeDataCache, setAnimeDataCache] = useState<CachedAnimeData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState<string>("");
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        // Create new abort controller for this effect
        abortControllerRef.current = new AbortController();

        const loadAnimeData = async () => {
            const missingIds = filteredReleases.filter(r => !animeDataCache[r.malId]);

            // Return early if no data needs to be loaded
            if (missingIds.length === 0) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            let completed = 0;

            try {
                // Configure batch size based on environment
                const batchSize = process.env.NODE_ENV === "production" ? 50 : 25;
                const releases = [...missingIds];

                while (releases.length > 0 && !abortControllerRef.current?.signal.aborted) {
                    const batch = releases.splice(0, batchSize);

                    // Process batch with retries and error handling
                    await Promise.all(
                        batch.map(async release => {
                            try {
                                const animeData = await fetchAnimeData(release.malId);

                                if (animeData) {
                                    setAnimeDataCache(prev => ({
                                        ...prev,
                                        [release.malId]: animeData
                                    }));
                                }
                            } catch (error) {
                                // Log error but continue processing other items
                                console.error(`Error loading anime ${release.malId}:`, error);
                            } finally {
                                completed++;
                                setLoadingStatus(`Loading anime data... ${completed}/${missingIds.length}`);
                            }
                        })
                    );

                    // Add controlled delay between batches to avoid rate limits
                    if (releases.length > 0) {
                        const delay = Math.min(1000 * Math.pow(1.5, completed / batchSize), 3000);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            } catch (error) {
                console.error("Error loading anime data:", error);
            } finally {
                // Only clear loading state if not aborted
                if (!abortControllerRef.current?.signal.aborted) {
                    setIsLoading(false);
                    setLoadingStatus("");
                }
            }
        };

        loadAnimeData();

        // Cleanup function to abort ongoing requests
        return () => {
            abortControllerRef.current?.abort();
        };
    }, [filteredReleases]); // Remove animeDataCache dependency

    return { animeDataCache, isLoading, loadingStatus };
};

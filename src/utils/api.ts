import { AnimeData } from "@/types";

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const memoryCache = new Map<string, { data: any; timestamp: number }>();
const pendingRequests = new Map<string, Promise<any>>();

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchAnimeData = async (malId: number): Promise<AnimeData | null> => {
    const cacheKey = `anime-${malId}`;

    // Check memory cache
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    // Check pending requests
    if (pendingRequests.has(cacheKey)) {
        return pendingRequests.get(cacheKey);
    }

    try {
        const headers = {
            "Cache-Control": process.env.NODE_ENV === "production" ? "public, max-age=86400" : "no-cache",
            Accept: "application/json"
        };

        const request =
            process.env.NODE_ENV === "production"
                ? fetch(`/data/cache/${malId}.json`, { headers }).then(res =>
                      res.ok ? res.json() : Promise.reject(res)
                  )
                : fetchWithRetry(`https://api.jikan.moe/v4/anime/${malId}`, {
                      headers,
                      maxRetries: 3,
                      baseDelay: 1000
                  }).then(data => data.data);

        pendingRequests.set(cacheKey, request);

        const data = await request;
        memoryCache.set(cacheKey, { data, timestamp: Date.now() });
        pendingRequests.delete(cacheKey);

        return data;
    } catch (error) {
        pendingRequests.delete(cacheKey);
        console.error(`Error fetching anime ${malId}:`, error);
        return null;
    }
};

interface RetryOptions {
    maxRetries?: number;
    baseDelay?: number;
    headers?: HeadersInit;
}

export const fetchWithRetry = async (url: string, options: RetryOptions = {}): Promise<any> => {
    const { maxRetries = 5, baseDelay = 1000, headers = {} } = options;

    let retries = 0;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
        while (retries < maxRetries) {
            try {
                const response = await fetch(url, {
                    headers,
                    signal: controller.signal
                });

                if (response.ok) {
                    return await response.json();
                }

                // Handle rate limiting
                if (response.status === 429) {
                    const retryAfter = response.headers.get("Retry-After");
                    const delay = retryAfter
                        ? parseInt(retryAfter) * 1000
                        : Math.min(baseDelay * Math.pow(2, retries), 10000);

                    console.log(`Rate limited. Retrying after ${delay}ms...`);
                    await sleep(delay);
                    retries++;
                    continue;
                }

                throw new Error(`HTTP error! status: ${response.status}`);
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") {
                    throw new Error("Request timed out");
                }

                if (retries === maxRetries - 1) throw error;
                retries++;
                await sleep(baseDelay * Math.pow(2, retries));
            }
        }

        throw new Error("Max retries exceeded");
    } finally {
        clearTimeout(timeoutId);
    }
};

export const fetchAnimeDataBatch = async (
    malIds: number[],
    onProgress?: (completed: number, total: number) => void
): Promise<Record<number, AnimeData>> => {
    const results: Record<number, AnimeData> = {};
    const batchSize = process.env.NODE_ENV === "production" ? 50 : 10;
    const uniqueIds = [...new Set(malIds)];
    const chunks = uniqueIds.reduce(
        (acc, _, i) => (i % batchSize ? acc : [...acc, uniqueIds.slice(i, i + batchSize)]),
        [] as number[][]
    );

    let completed = 0;

    for (const chunk of chunks) {
        const promises = chunk.map(async malId => {
            const data = await fetchAnimeData(malId);
            if (data) results[malId] = data;
            completed++;
            onProgress?.(completed, uniqueIds.length);
        });

        await Promise.all(promises);
        if (chunks.indexOf(chunk) < chunks.length - 1) {
            await sleep(process.env.NODE_ENV === "production" ? 100 : 1000);
        }
    }

    return results;
};

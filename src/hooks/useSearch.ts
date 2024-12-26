import { useState, useEffect } from "react";
import { AnimeRelease, CachedAnimeData, Release } from "../types";

export const useSearch = (releases: AnimeRelease[], animeDataCache: CachedAnimeData) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredReleases, setFilteredReleases] = useState<AnimeRelease[]>(releases);
    const [isGroupSearch, setIsGroupSearch] = useState(false);

    useEffect(() => {
        const filtered = releases.filter(release => {
            const animeData = animeDataCache[release.malId];
            if (!animeData) return false;

            const searchTerms = searchQuery.toLowerCase();

            if (isGroupSearch) {
                return (
                    (Array.isArray(release.bestReleases) &&
                        release.bestReleases?.some(
                            (r: Release) => r.name?.toLowerCase().includes(searchTerms) ?? false
                        )) ||
                    (Array.isArray(release.bestAlternatives) &&
                        release.bestAlternatives?.some(
                            (r: Release) => r.name?.toLowerCase().includes(searchTerms) ?? false
                        ))
                );
            }

            return (
                animeData.title.toLowerCase().includes(searchTerms) ||
                (animeData.title_english?.toLowerCase().includes(searchTerms) ?? false)
            );
        });

        setFilteredReleases(filtered);
    }, [searchQuery, releases, animeDataCache, isGroupSearch]);

    return { searchQuery, setSearchQuery, filteredReleases, isGroupSearch, setIsGroupSearch };
};

"use client";

import React, { useState, useMemo } from "react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Link } from "@nextui-org/react";
import { SearchBar } from "./components/SearchBar";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { AnimeDetailModal } from "./components/AnimeDetailModal";
import { AnimeRelease } from "./types";
import { useAnimeData } from "./hooks/useAnimeData";
import { useReleaseData } from "./hooks/useReleaseData";
import { useSearch } from "./hooks/useSearch";

const AnimeReleaseTable: React.FC = () => {
    // First, get the releases data
    const { releases, isLoading: isReleasesLoading } = useReleaseData();

    // Then, handle the anime data loading
    const { animeDataCache, isLoading: isAnimeDataLoading, loadingStatus } = useAnimeData(releases);

    // Now we can use animeDataCache for search
    const { searchQuery, setSearchQuery, filteredReleases } = useSearch(releases, animeDataCache);

    // Modal state
    const [selectedRelease, setSelectedRelease] = useState<AnimeRelease | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isLoading = isReleasesLoading || isAnimeDataLoading;

    // Memoize the sorted releases to avoid sorting on every render
    const sortedReleases = useMemo(() => {
        return [...filteredReleases].sort((a, b) => {
            const titleA = animeDataCache[a.malId]?.title || a.title;
            const titleB = animeDataCache[b.malId]?.title || b.title;
            return titleA.localeCompare(titleB);
        });
    }, [filteredReleases, animeDataCache]);

    if (isLoading && sortedReleases.length === 0) {
        return <LoadingSpinner status={loadingStatus} />;
    }

    const handleRowClick = (release: AnimeRelease) => {
        setSelectedRelease(release);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full space-y-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onClear={() => setSearchQuery("")} />

            <div className="overflow-x-auto">
                <Table
                    selectionMode="single"
                    aria-label="Best Releases Table"
                    className="min-w-full"
                    classNames={{
                        wrapper: "min-w-full",
                        table: "min-w-full"
                    }}
                >
                    <TableHeader>
                        <TableColumn className="min-w-[200px]">Title</TableColumn>
                        <TableColumn className="min-w-[200px]">English Title</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No releases found">
                        {sortedReleases.map(release => {
                            const animeData = animeDataCache[release.malId];

                            return (
                                <TableRow
                                    key={release.malId}
                                    className="cursor-pointer hover:bg-default-100"
                                    onClick={() => handleRowClick(release)}
                                >
                                    <TableCell>
                                        <Link color="foreground" onPress={() => handleRowClick(release)}>
                                            {animeData?.title || release.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link color="foreground" onPress={() => handleRowClick(release)}>
                                            {animeData?.title_english || "N/A"}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <AnimeDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedRelease={selectedRelease}
                animeData={selectedRelease ? animeDataCache[selectedRelease.malId] : undefined}
            />
        </div>
    );
};

export default AnimeReleaseTable;

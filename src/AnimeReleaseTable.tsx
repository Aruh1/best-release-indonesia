"use client";

import React, { useMemo } from "react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";
import { SearchBar } from "./components/SearchBar";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useAnimeData } from "./hooks/useAnimeData";
import { useReleaseData } from "./hooks/useReleaseData";
import { useSearch } from "./hooks/useSearch";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AnimeReleaseTable: React.FC = () => {
    const router = useRouter();
    const { releases, isLoading: isReleasesLoading } = useReleaseData();
    const { animeDataCache, isLoading: isAnimeDataLoading, loadingStatus } = useAnimeData(releases);
    const { searchQuery, setSearchQuery, filteredReleases, isGroupSearch, setIsGroupSearch } = useSearch(
        releases,
        animeDataCache
    );

    const isLoading = isReleasesLoading || isAnimeDataLoading;

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

    return (
        <div className="w-full space-y-4">
            <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery("")}
                isGroupSearch={isGroupSearch}
                onGroupSearchChange={setIsGroupSearch}
            />

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
                                    onClick={() => router.push(`/anime/${release.malId}`)}
                                >
                                    <TableCell>
                                        <Link
                                            href={`/anime/${release.malId}`}
                                            className="text-foreground hover:opacity-80"
                                            color="foreground"
                                            onClick={() => router.push(`/anime/${release.malId}`)}
                                        >
                                            {animeData?.title || release.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/anime/${release.malId}`}
                                            className="text-foreground hover:opacity-80"
                                            color="foreground"
                                            onClick={() => router.push(`/anime/${release.malId}`)}
                                        >
                                            {animeData?.title_english || "N/A"}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AnimeReleaseTable;

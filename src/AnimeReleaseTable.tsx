"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Link, Pagination } from "@heroui/react";
import { SearchBar } from "./components/SearchBar";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useAnimeData } from "./hooks/useAnimeData";
import { useReleaseData } from "./hooks/useReleaseData";
import { useSearch } from "./hooks/useSearch";
import { useRouter } from "next/navigation";

// Performance: Move interfaces outside component to prevent recreating
interface Release {
    malId: string;
    title: string;
}

interface AnimeData {
    title?: string;
    title_english?: string;
}

const ITEMS_PER_PAGE = 25;
const ROWS_PER_PAGE_OPTIONS = [25, 30, 50, 100];

const AnimeReleaseTable: React.FC = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);

    const { releases, isLoading: isReleasesLoading } = useReleaseData();
    const { animeDataCache, isLoading: isAnimeDataLoading, loadingStatus } = useAnimeData(releases);
    const { searchQuery, setSearchQuery, filteredReleases, isGroupSearch, setIsGroupSearch } = useSearch(
        releases,
        animeDataCache
    );

    const isLoading = isReleasesLoading || isAnimeDataLoading;

    // Add this with the other state declarations
    const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);

    // Performance: Memoize sorted releases to prevent unnecessary sorting
    const sortedReleases = useMemo(() => {
        return [...filteredReleases].sort((a, b) => {
            const titleA = animeDataCache[a.malId]?.title || a.title;
            const titleB = animeDataCache[b.malId]?.title || b.title;
            return titleA.localeCompare(titleB);
        });
    }, [filteredReleases, animeDataCache]);

    // Update the paginationData useMemo to use rowsPerPage instead of ITEMS_PER_PAGE
    const paginationData = useMemo(() => {
        const totalItems = sortedReleases.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
        const paginatedReleases = sortedReleases.slice(startIndex, endIndex);

        return {
            totalItems,
            totalPages,
            paginatedReleases,
            startIndex,
            endIndex
        };
    }, [sortedReleases, currentPage, rowsPerPage]);

    // Performance: Reset to page 1 when search changes
    const handleSearchChange = useCallback(
        (newQuery: string) => {
            setSearchQuery(newQuery);
            setCurrentPage(1);
        },
        [setSearchQuery]
    );

    const handleSearchClear = useCallback(() => {
        setSearchQuery("");
        setCurrentPage(1);
    }, [setSearchQuery]);

    const handleGroupSearchChange = useCallback(
        (isGroup: boolean) => {
            setIsGroupSearch(isGroup);
            setCurrentPage(1);
        },
        [setIsGroupSearch]
    );

    // Performance: Memoize table rows to prevent unnecessary re-renders
    const tableRows = useMemo(() => {
        return paginationData.paginatedReleases.map(release => {
            const animeData = animeDataCache[release.malId];
            const title = animeData?.title || release.title;
            const englishTitle = animeData?.title_english || "";

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
                            onPress={() => router.push(`/anime/${release.malId}`)}
                        >
                            {title}
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Link
                            href={`/anime/${release.malId}`}
                            className="text-foreground hover:opacity-80"
                            color="foreground"
                            onPress={() => router.push(`/anime/${release.malId}`)}
                        >
                            {englishTitle}
                        </Link>
                    </TableCell>
                </TableRow>
            );
        });
    }, [paginationData.paginatedReleases, animeDataCache]);

    if (isLoading && sortedReleases.length === 0) {
        return <LoadingSpinner status={loadingStatus} />;
    }

    return (
        <div className="w-full space-y-4">
            <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                onClear={handleSearchClear}
                isGroupSearch={isGroupSearch}
                onGroupSearchChange={handleGroupSearchChange}
            />

            {/* Results summary */}
            <div className="text-sm text-default-600">
                Showing {paginationData.startIndex + 1}-{paginationData.endIndex} of {paginationData.totalItems} results
            </div>

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
                    <TableBody emptyContent="No releases found">{tableRows}</TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {paginationData.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 py-4">
                    <Pagination
                        total={paginationData.totalPages}
                        page={currentPage}
                        onChange={setCurrentPage}
                        showControls
                        showShadow
                        color="primary"
                    />
                    <div className="flex items-center gap-2">
                        <select
                            className="bg-default-100 rounded-md px-2 py-1 text-sm"
                            value={rowsPerPage}
                            onChange={e => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            {ROWS_PER_PAGE_OPTIONS.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnimeReleaseTable;

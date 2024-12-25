"use client";

import React, { useEffect, useState } from "react";
import { AnimeRelease, Release } from "@/types";
import { useAnimeData } from "@/hooks/useAnimeData";
import {
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Table,
    Link,
    Spinner,
    Card
} from "@nextui-org/react";

const ReleaseStatic = () => {
    const [releases, setReleases] = useState<AnimeRelease[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { animeDataCache, isLoading: isAnimeDataLoading } = useAnimeData(releases);

    useEffect(() => {
        setIsLoading(true);
        fetch("/data/animeRelease.json")
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch data");
                return res.json();
            })
            .then(data => {
                const sortedData = [...data].sort((a, b) => {
                    return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                });
                setReleases(sortedData);
            })
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    const extractLink = (text: string): string | null => {
        const match = text.match(/https?:\/\/[^\s]+/);
        return match ? match[0] : null;
    };

    const renderReleases = (releases: Release[] | string | undefined) => {
        if (!releases) return null;
        if (typeof releases === "string") return <span className="text-blue-400">{releases}</span>;

        return releases.map((release, index) => (
            <div key={release.name || index} className="flex items-center gap-2">
                {release.downloadLinks ? (
                    Array.isArray(release.downloadLinks) ? (
                        release.downloadLinks.map((link, linkIndex) => (
                            <Link key={linkIndex} href={link} isExternal color="primary">
                                {release.name
                                    ? Array.isArray(release.downloadLinks) && release.downloadLinks.length > 1
                                        ? `${release.name} #${linkIndex + 1}`
                                        : release.name
                                    : Array.isArray(release.downloadLinks) && release.downloadLinks.length > 1
                                      ? `Download #${linkIndex + 1}`
                                      : "Download"}
                            </Link>
                        ))
                    ) : (
                        <Link href={release.downloadLinks} isExternal color="primary">
                            {release.name || "Download"}
                        </Link>
                    )
                ) : (
                    <span className="text-blue-400">{release.name || "N/A"}</span>
                )}
                {release.description && <span className="text-default-400">({release.description})</span>}
            </div>
        ));
    };

    if (isLoading || isAnimeDataLoading)
        return (
            <div className="flex items-center justify-center h-48">
                <Spinner label="Loading..." />
            </div>
        );

    if (error)
        return (
            <Card className="p-4">
                <p className="text-danger">Error: {error}</p>
            </Card>
        );

    return (
        <Table aria-label="Best Release Table" className="w-full">
            <TableHeader>
                <TableColumn>Title</TableColumn>
                <TableColumn>Best</TableColumn>
                <TableColumn>Alternative</TableColumn>
                <TableColumn>Notes</TableColumn>
                <TableColumn>Comps</TableColumn>
            </TableHeader>
            <TableBody>
                {releases.map((release: AnimeRelease) => {
                    const animeData = animeDataCache[release.malId];

                    return (
                        <TableRow key={release.malId}>
                            <TableCell>
                                {animeData?.url ? (
                                    <Link href={animeData.url} isExternal color="foreground">
                                        {animeData.title || release.title}
                                    </Link>
                                ) : (
                                    animeData?.title || release.title
                                )}
                            </TableCell>
                            <TableCell>{renderReleases(release.bestReleases)}</TableCell>
                            <TableCell>{renderReleases(release.bestAlternatives)}</TableCell>
                            <TableCell className="whitespace-pre-line">{release.notes}</TableCell>
                            <TableCell>
                                {release.qualityComparisons &&
                                    (extractLink(release.qualityComparisons) ? (
                                        <Link
                                            href={extractLink(release.qualityComparisons)!}
                                            isExternal
                                            color="primary"
                                        >
                                            View
                                        </Link>
                                    ) : (
                                        <span>{release.qualityComparisons}</span>
                                    ))}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default ReleaseStatic;

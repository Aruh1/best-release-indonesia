"use client";

import React, { useMemo, use } from "react";
import Head from "next/head";
import { Card, CardBody, Link, Divider, Spinner, CardHeader, Image } from "@nextui-org/react";
import type { AnimeRelease } from "@/types";
import { ReleaseSection } from "@/components/ReleaseSection";
import { ReleaseLinks } from "@/components/ReleaseLinks";
import { TextFormatter } from "@/components/TextFormatter";
import Header from "@/components/Header";
import { useAnimeData } from "@/hooks/useAnimeData";
import { Calendar, Tv, Star } from "lucide-react";

interface PageProps {
    params: Promise<{
        malId: string;
    }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function Page(props: PageProps) {
    const params = use(props.params);
    const malId = Number(params.malId);
    const isValidMalId = !isNaN(malId) && malId > 0;
    const { animeDataCache } = useAnimeData(isValidMalId ? [{ malId, title: "" }] : []);
    const animeData = isValidMalId ? animeDataCache[malId] : null;
    const [release, setRelease] = React.useState<AnimeRelease | null>(null);

    React.useEffect(() => {
        if (!isValidMalId) return;

        const fetchReleaseData = async () => {
            try {
                const res = await fetch("/data/animeRelease.json");
                const data = await res.json();
                const found = data.find((r: AnimeRelease) => r.malId === malId);
                setRelease(found || null);
            } catch (error) {
                console.error("Error fetching release data:", error);
                setRelease(null);
            }
        };

        fetchReleaseData();
    }, [malId, isValidMalId]);

    const content = useMemo(() => {
        if (!release || !animeData) return null;

        return (
            <Card className="bg-content1">
                <CardBody className="gap-4">
                    {release.bestReleases && (
                        <>
                            <h3 className="text-lg font-semibold">Best Releases</h3>
                            <ReleaseSection title="Best Releases" releases={release.bestReleases} />
                            <Divider />
                        </>
                    )}
                    {release.bestAlternatives && (
                        <>
                            <h3 className="text-lg font-semibold">Alternatives</h3>
                            <ReleaseSection title="Best Alternatives" releases={release.bestAlternatives} />
                            <Divider />
                        </>
                    )}
                    {release.notes && (
                        <>
                            <h3 className="text-lg font-semibold">Notes</h3>
                            <div className="p-2">
                                <TextFormatter text={release.notes} />
                            </div>
                            <Divider />
                        </>
                    )}
                    {release.qualityComparisons && (
                        <>
                            <h3 className="text-lg font-semibold">Comparisons</h3>
                            <div className="p-2">
                                <TextFormatter text={release.qualityComparisons} />
                            </div>
                            <Divider />
                        </>
                    )}
                    {release.downloadLinks && (
                        <>
                            <h3 className="text-lg font-semibold">Downloads</h3>
                            <div className="p-2">
                                <ReleaseLinks links={release.downloadLinks} />
                            </div>
                        </>
                    )}
                </CardBody>
            </Card>
        );
    }, [release, animeData]);

    if (!isValidMalId) {
        return <div>Error: Invalid malId</div>;
    }

    if (!animeData || !release) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner size="lg" label="Loading..." />
            </div>
        );
    }

    const bestReleases = Array.isArray(release.bestReleases)
        ? release.bestReleases.map(r => r.name).join(", ")
        : release.bestReleases;
    const bestAlternatives = Array.isArray(release.bestAlternatives)
        ? release.bestAlternatives.map(r => r.name).join(", ")
        : release.bestAlternatives;

    return (
        <>
            <Head>
                <title>{animeData.title}</title>
                <meta name="author" content="Best Release Indonesia" />
                <meta property="og:title" content={animeData.title} />
                <meta property="og:description" content={`Best: ${bestReleases}, Alt: ${bestAlternatives}`} />
                <meta property="og:image" content={animeData.images?.jpg.large_image_url} />
                <meta name="theme-color" content="#23272A" />
            </Head>
            <Header />
            <main className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mobile-image-bottom">
                    <Card className="col-span-1" style={{ height: "fit-content" }}>
                        <div className="absolute z-10 top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent h-32 rounded-t-lg">
                            <CardHeader className="flex-col !items-start p-4">
                                <p className="text-tiny text-white uppercase font-bold flex items-center gap-1">
                                    <Star size={14} className="fill-white" />
                                    {animeData.score}
                                </p>
                                <h4 className="text-white font-medium text-large drop-shadow-lg">{animeData.title}</h4>
                            </CardHeader>
                        </div>
                        <Image
                            removeWrapper
                            alt={animeData.title}
                            className="z-0 w-full h-full object-cover"
                            src={animeData.images?.jpg.large_image_url}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent h-24 rounded-b-lg">
                            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between text-white p-4">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span className="text-xs capitalize">
                                        {animeData.season && animeData.year
                                            ? `${animeData.season} ${animeData.year}`
                                            : animeData.aired?.string || "Unknown"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs">{animeData.type || "Unknown"}</span>
                                    <Tv size={14} />
                                </div>
                            </div>
                        </div>
                    </Card>
                    <div className="col-span-2 space-y-4">
                        <Card>
                            <CardBody>
                                <Link
                                    href={animeData.url}
                                    isExternal
                                    target="_blank"
                                    color="foreground"
                                    size="lg"
                                    className="font-semibold"
                                >
                                    {animeData.title}
                                </Link>
                            </CardBody>
                        </Card>

                        {content}
                    </div>
                </div>
            </main>
        </>
    );
}

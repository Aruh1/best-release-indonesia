// src/app/anime/[malId]/page.server.tsx
import type { Metadata } from "next";
import type { AnimeRelease, Release } from "@/types";

export async function generateMetadata({ params }: { params: { malId: string } }): Promise<Metadata> {
    const malId = Number(params.malId);

    try {
        // Fetch anime data
        const animeDataRes = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);
        const animeData = await animeDataRes.json();

        // Fetch release data
        const releaseDataRes = await fetch("/data/animeRelease.json");
        const releaseData = await releaseDataRes.json();
        const release = releaseData.find((r: AnimeRelease) => r.malId === malId);

        const bestReleases = Array.isArray(release?.bestReleases)
            ? release.bestReleases.map((r: Release) => r.name).join(", ")
            : release?.bestReleases;

        const bestAlternatives = Array.isArray(release?.bestAlternatives)
            ? release.bestAlternatives.map((r: Release) => r.name).join(", ")
            : release?.bestAlternatives;

        return {
            title: animeData.data.title,
            description: `Best: ${bestReleases}, Alt: ${bestAlternatives}`,
            openGraph: {
                title: animeData.data.title,
                description: `Best: ${bestReleases}, Alt: ${bestAlternatives}`,
                images: [animeData.data.images?.jpg.large_image_url]
            },
            authors: [{ name: "Best Release Indonesia" }],
            themeColor: "#23272A"
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {
            title: "Anime Details - Best Release Indonesia",
            description: "View anime release information"
        };
    }
}

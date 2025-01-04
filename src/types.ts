export interface Release {
    name?: string;
    description?: string;
    downloadLinks?: string | string[];
}

export interface AnimeRelease {
    title: string;
    malId: number;
    bestReleases?: Release[] | string;
    bestAlternatives?: Release[] | string;
    notes?: string;
    qualityComparisons?: string;
    missingReleases?: string;
    downloadLinks?: string | string[];
}

export interface AnimeData {
    mal_id: number;
    url: string;
    title: string;
    title_english: string | null;
    title_japanese: string;
    type: string;
    episodes: number | null;
    status: string;
    airing: boolean;
    aired: {
        from: string;
        to: string;
        prop: {
            from: {
                day: number;
                month: number;
                year: number;
            };
            to: {
                day: number;
                month: number;
                year: number;
            };
        };
        string: string;
    };
    duration: string;
    rating: string;
    score: number;
    scored_by: number;
    rank: number;
    popularity: number;
    members: number;
    favorites: number;
    background: string;
    premiered: string;
    broadcast: string;
    related: Record<string, AnimeData[]>;
    producers: AnimeData[];
    licensors: AnimeData[];
    studios: AnimeData[];
    genres?: {
        mal_id: number;
        name: string;
    }[];
    opening_themes: string[];
    ending_themes: string[];
    trailer_url: string | null;
    season: string | null;
    year: number | null;
    synopsis: string;
    images: {
        jpg: {
            large_image_url: string;
        };
    };
}

export type CachedAnimeData = Record<number, AnimeData>;

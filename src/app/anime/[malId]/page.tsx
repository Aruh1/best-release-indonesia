import React, { Suspense, lazy } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const AnimeCard = lazy(() => import("@/components/AnimeCard"));

export default function Card() {
    return (
        <main>
            <Suspense fallback={<LoadingSpinner status="Loading anime releases..." />}>
                <AnimeCard />
            </Suspense>
        </main>
    );
}

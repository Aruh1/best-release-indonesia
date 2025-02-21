import React, { Suspense, lazy } from "react";
import Header from "@/components/Header";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const AnimeReleaseTable = lazy(() => import("@/AnimeReleaseTable"));

export default function Home() {
    return (
        <>
            <Header />
            <main className="container mx-auto p-4">
                <Suspense fallback={<LoadingSpinner status="Loading anime releases..." />}>
                    <AnimeReleaseTable />
                </Suspense>
            </main>
        </>
    );
}

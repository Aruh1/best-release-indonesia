import React, { Suspense, lazy } from "react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const AnimeReleaseTable = lazy(() => import("@/components/ReleaseStatic"));

export default function StaticPage() {
    return (
        <main>
            <h1 className="text-2xl font-bold mb-4">
                <Link href="/">Best Release Indonesia</Link>
            </h1>
            <Suspense fallback={<LoadingSpinner status="Loading anime releases..." />}>
                <AnimeReleaseTable />
            </Suspense>
        </main>
    );
}

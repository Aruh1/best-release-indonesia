import ReleaseStatic from "@/components/ReleaseStatic";
import Link from "next/link";

export default function StaticPage() {
    return (
        <main>
            <h1 className="text-2xl font-bold mb-4">
                <Link href="/">Best Release Indonesia</Link>
            </h1>
            <ReleaseStatic />
        </main>
    );
}

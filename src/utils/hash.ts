import { execSync } from "child_process";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const commitHash = execSync("git rev-parse --short HEAD").toString().trim();
        const repoUrl = "https://github.com/Aruh1/best-release-indonesia";
        const commitUrl = `${repoUrl}/commit/${commitHash}`;

        return NextResponse.json({ commitHash, commitUrl });
    } catch (error) {
        return NextResponse.json({
            commitHash: "dev",
            commitUrl: "https://github.com/Aruh1/best-release-indonesia"
        });
    }
}

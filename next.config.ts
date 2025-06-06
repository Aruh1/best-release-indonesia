import { execSync as execSyncChild } from "child_process";
import type { NextConfig } from "next";

const getGitCommitHash = () => {
    try {
        return execSyncChild("git rev-parse --short HEAD").toString().trim();
    } catch (e) {
        return "unknown";
    }
};

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.myanimelist.net"
            },
            // Adding other potential AniList CDN domains for completeness
            {
                protocol: "https",
                hostname: "*.myanimelist.net"
            }
        ]
    },
    env: {
        NEXT_PUBLIC_COMMIT_HASH: getGitCommitHash()
    }
    // Keep any other existing Next.js config options you might have
};

export default nextConfig;

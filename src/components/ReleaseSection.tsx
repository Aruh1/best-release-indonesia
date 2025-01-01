"use client";
import React from "react";
import { ReleaseLinks } from "./ReleaseLinks";
import type { Release } from "@/types";

const unmuxedRegex = /\+/;

export const ReleaseSection: React.FC<{
    title: string;
    releases: Release[] | string;
}> = ({ releases }) => {
    const releaseArray = Array.isArray(releases) ? releases : [{ name: releases }];

    return (
        <div className="space-y-2">
            {releaseArray.map((release, index) => (
                <div key={index}>
                    <p className={`${unmuxedRegex.test(release.name || "") ? "text-warning" : ""}`}>{release.name}</p>
                    {release.downloadLinks && <ReleaseLinks links={release.downloadLinks} />}
                </div>
            ))}
        </div>
    );
};

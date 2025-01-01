"use client";
import React from "react";
import { ReleaseLinks } from "./ReleaseLinks";
import { TextFormatter } from "./TextFormatter";
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
                <div key={index} className="p-2 rounded-md bg-content2">
                    {release.name && (
                        <p className={`font-semibold ${unmuxedRegex.test(release.name) ? "text-warning" : ""}`}>
                            <TextFormatter text={release.name} />
                        </p>
                    )}
                    {release.description && (
                        <p>
                            <TextFormatter text={release.description} />
                        </p>
                    )}
                    {release.downloadLinks && (
                        <div className="mt-2">
                            <ReleaseLinks links={release.downloadLinks} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

"use client";
import React from "react";
import { Link } from "@heroui/react";
import { ExternalLink } from "lucide-react";

// URL regex pattern
const urlPattern = /(https?:\/\/[^\s]+)/g;

export const TextFormatter: React.FC<{ text: string }> = ({ text }) => {
    return (<>
        {text.split(/\n/).map((line, index, array) => (
            <React.Fragment key={index}>
                {line.split(urlPattern).map((part, partIndex) => {
                    if (part.match(urlPattern)) {
                        return (
                            <Link
                                key={partIndex}
                                href={part}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:underline inline-flex"
                            >
                                <ExternalLink size={16} />
                                {part}
                            </Link>
                        );
                    }
                    return part;
                })}
                {index < array.length - 1 && <br />}
            </React.Fragment>
        ))}
    </>);
};

"use client";
import React from "react";
import { SiGithub } from "react-icons/si";
import { Button } from "@heroui/react";
import { FaDiscord, FaHome, FaDatabase, FaQuestionCircle, FaChartBar } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import { COMMIT_HASH } from "@/lib/version";

const commitUrl = "https://github.com/Aruh1/best-release-indonesia/commit/" + COMMIT_HASH;

const Header = () => {
    return (
        <header className="w-full border-b border-divider">
            <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">Best Release Indonesia</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button as={Link} href="/" variant="light" className="text-default-600">
                            <FaHome />
                            Home
                        </Button>
                        <Button as={Link} href="/static" variant="light" className="text-default-600">
                            <FaChartBar />
                            Static
                        </Button>
                        <Button
                            as={Link}
                            href="https://db.koisuru.web.id/"
                            variant="light"
                            target="_blank"
                            className="text-default-600"
                        >
                            <FaDatabase />
                            Database Softsub
                        </Button>
                        <Button as={Link} href="/faq" variant="light" className="text-default-600">
                            <FaQuestionCircle />
                            FAQ
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button
                        as="a"
                        href="https://discord.gg/za7XeBK8tS"
                        target="_blank"
                        rel="noopener noreferrer"
                        isIconOnly
                        variant="light"
                        className="text-default-500"
                    >
                        <FaDiscord size={20} />
                    </Button>
                    <Button
                        as="a"
                        href="https://github.com/Aruh1/best-release-indonesia"
                        target="_blank"
                        rel="noopener noreferrer"
                        isIconOnly
                        variant="light"
                        className="text-default-500"
                    >
                        <SiGithub size={20} />
                    </Button>
                    <Link href={commitUrl} target="_blank" rel="noopener noreferrer" className="text-xs opacity-50">
                        [{COMMIT_HASH}]
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;

"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Card, CardBody, Link } from "@nextui-org/react";
import Image from "next/image";
import { AnimeRelease, AnimeData } from "../types";
import { ReleaseSection } from "./ReleaseSection";
import { ReleaseLinks } from "./ReleaseLinks";
import { TextFormatter } from "./TextFormatter";

interface AnimeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRelease: AnimeRelease | null;
    animeData: AnimeData | undefined;
}

export const AnimeDetailModal: React.FC<AnimeDetailModalProps> = ({ isOpen, onClose, selectedRelease, animeData }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const modalContent = useMemo(() => {
        if (!selectedRelease || !animeData) return null;

        const content = (
            <div className="space-y-4">
                {selectedRelease.bestReleases && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Best Releases</h3>
                        <ReleaseSection title="Best Releases" releases={selectedRelease.bestReleases} />
                    </div>
                )}
                {selectedRelease.bestAlternatives && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Alternatives</h3>
                        <ReleaseSection title="Best Alternatives" releases={selectedRelease.bestAlternatives} />
                    </div>
                )}
                {selectedRelease.notes && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Notes</h3>
                        <div className="p-2">
                            <TextFormatter text={selectedRelease.notes} />
                        </div>
                    </div>
                )}
                {selectedRelease.qualityComparisons && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Comparisons</h3>
                        <div className="p-2 space-y-2">
                            <TextFormatter text={selectedRelease.qualityComparisons} />
                        </div>
                    </div>
                )}
                {selectedRelease.missingReleases && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Missing</h3>
                        <div className="p-2">
                            <TextFormatter text={selectedRelease.missingReleases} />
                        </div>
                    </div>
                )}
                {selectedRelease.downloadLinks && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Downloads</h3>
                        <div className="p-2">
                            <ReleaseLinks links={selectedRelease.downloadLinks} />
                        </div>
                    </div>
                )}
            </div>
        );

        return (
            <>
                <ModalHeader className="text-lg sm:text-xl break-words">
                    <Link href={animeData.url} isExternal color="foreground" target="_blank">
                        {animeData.title}
                    </Link>
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                        {!isMobile && (
                            <Card className="w-full max-w-sm mx-auto hidden md:block order-1 md:order-none">
                                <CardBody>
                                    <div className="relative w-full aspect-[2/3] max-h-[50vh] md:max-h-none">
                                        <Image
                                            src={animeData.images.jpg.large_image_url}
                                            alt={animeData.title}
                                            fill
                                            className="object-cover rounded-lg"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        )}
                        <div className="overflow-y-auto max-h-[60vh] order-2 md:order-none">{content}</div>
                    </div>
                </ModalBody>
            </>
        );
    }, [selectedRelease, animeData, isMobile]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" className="sm:mx-4">
            <ModalContent>{modalContent}</ModalContent>
        </Modal>
    );
};

export default AnimeDetailModal;

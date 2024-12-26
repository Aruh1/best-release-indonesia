"use client";

import React, { useMemo } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Card, CardBody, Tabs, Tab, Link } from "@nextui-org/react";
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
    const modalContent = useMemo(() => {
        if (!selectedRelease || !animeData) return null;

        return (
            <>
                <ModalHeader className="text-lg sm:text-xl break-words">
                    <Link href={animeData.url} isExternal color="foreground" target="_blank">
                        {animeData.title}
                    </Link>
                </ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="w-full max-w-sm mx-auto">
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
                        <div className="space-y-4">
                            <Tabs
                                aria-label="Release information"
                                color="primary"
                                variant="bordered"
                                className="w-full"
                                classNames={{
                                    tabList: "gap-2 w-full flex-wrap justify-start overflow-x-auto",
                                    tab: "max-w-fit px-2 h-8",
                                    panel: "pt-2"
                                }}
                            >
                                {selectedRelease.bestReleases && (
                                    <Tab key="releases" title="Best Releases">
                                        <ReleaseSection title="Best Releases" releases={selectedRelease.bestReleases} />
                                    </Tab>
                                )}
                                {selectedRelease.bestAlternatives && (
                                    <Tab key="alternatives" title="Alternatives">
                                        <ReleaseSection
                                            title="Best Alternatives"
                                            releases={selectedRelease.bestAlternatives}
                                        />
                                    </Tab>
                                )}
                                {selectedRelease.notes && (
                                    <Tab key="notes" title="Notes">
                                        <div className="p-2">
                                            <TextFormatter text={selectedRelease.notes} />
                                        </div>
                                    </Tab>
                                )}
                                {selectedRelease.qualityComparisons && (
                                    <Tab key="comp" title="Comparisons">
                                        <div className="p-2 space-y-2">
                                            <TextFormatter text={selectedRelease.qualityComparisons} />
                                        </div>
                                    </Tab>
                                )}
                                {selectedRelease.missingReleases && (
                                    <Tab key="missing" title="Missing">
                                        <div className="p-2">
                                            <TextFormatter text={selectedRelease.missingReleases} />
                                        </div>
                                    </Tab>
                                )}
                                {selectedRelease.downloadLinks && (
                                    <Tab key="downloads" title="Downloads">
                                        <div className="p-2">
                                            <ReleaseLinks links={selectedRelease.downloadLinks} />
                                        </div>
                                    </Tab>
                                )}
                            </Tabs>
                        </div>
                    </div>
                </ModalBody>
            </>
        );
    }, [selectedRelease, animeData]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside" className="sm:mx-4">
            <ModalContent className="h-[90vh] sm:h-auto">{modalContent}</ModalContent>
        </Modal>
    );
};

export default AnimeDetailModal;

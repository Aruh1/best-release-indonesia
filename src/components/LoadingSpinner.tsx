"use client";
import React from "react";
import { Spinner } from "@heroui/react";

interface LoadingSpinnerProps {
    status?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ status }) => {
    return (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
            <Spinner size="lg" />
            {status && <p className="text-default-500">{status}</p>}
        </div>
    );
};

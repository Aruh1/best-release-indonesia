"use client";
import React from "react";
import { Input, Checkbox } from "@nextui-org/react";
import { Search } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
    isGroupSearch: boolean;
    onGroupSearchChange: (isGroupSearch: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    onClear,
    isGroupSearch,
    onGroupSearchChange
}) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <Input
                    isClearable
                    startContent={<Search className="text-default-400" size={16} />}
                    placeholder={isGroupSearch ? "Search by group..." : "Search by title..."}
                    value={value}
                    onClear={onClear}
                    onChange={handleSearchChange}
                    className="w-full sm:max-w-[44%]"
                />
                <Checkbox isSelected={isGroupSearch} onChange={() => onGroupSearchChange(!isGroupSearch)}>
                    Groups Search
                </Checkbox>
            </div>
        </div>
    );
};

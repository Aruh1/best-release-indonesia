"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@heroui/react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            isIconOnly
            variant="light"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-default-500"
        >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
    );
};

export default ThemeToggle;

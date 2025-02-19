"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { RefreshCcw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="h-screen w-full flex items-center justify-center">
            <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-9xl font-bold text-destructive"
                >
                    500
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold tracking-tighter sm:text-4xl"
                >
                    Internal Server Error
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-[600px] text-gray-500 md:text-xl/relaxed dark:text-gray-400"
                >
                    The server encountered an internal error and was unable to complete your request. Please try again
                    later.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Button
                        onPress={() => reset()}
                        color="primary"
                        variant="bordered"
                        className="flex items-center gap-2"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Try again
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}

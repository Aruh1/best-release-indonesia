"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";

export default function NotFound() {
    return (
        <div className="h-screen w-full flex items-center justify-center">
            <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-9xl font-bold"
                >
                    404
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold tracking-tighter sm:text-4xl"
                >
                    The page you are looking for cannot be found.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-[600px] text-muted-foreground md:text-xl/relaxed"
                >
                    If you typed in the web address, please check it is correct.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Button color="primary" variant="bordered">
                        <Link href="/" className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Go back to homepage
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}

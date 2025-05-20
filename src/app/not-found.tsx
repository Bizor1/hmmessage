'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-2xl"
            >
                <h1 className="text-8xl font-light mb-4">404</h1>
                <div className="h-[1px] w-16 bg-black mx-auto mb-8" />

                <h2 className="text-2xl font-light mb-4">
                    &ldquo;Seek and you will find&rdquo;
                </h2>
                <p className="text-gray-600 mb-8">
                    The page you&apos;re looking for seems to have wandered off the path.
                    But remember, sometimes getting lost leads to better discoveries.
                </p>

                <Link
                    href="/"
                    className="inline-block border border-black px-8 py-3 text-sm uppercase tracking-wider
                     hover:bg-black hover:text-white transition-colors duration-300"
                >
                    Return Home
                </Link>
            </motion.div>

            {/* Decorative Cross */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
                <div className="h-64 w-[1px] bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="w-64 h-[1px] bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </motion.div>
        </div>
    );
} 
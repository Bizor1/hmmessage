'use client';

import { useDropCountdown } from '@/hooks/useCountdown';
import { useState, useEffect } from 'react';

export default function HypeBanner() {
    const { days, hours, minutes, seconds, isExpired } = useDropCountdown();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (isExpired || !mounted) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-black text-white py-2 px-4 border-b border-gray-800">
            <div className="container-represent flex items-center justify-center text-xs">
                <div className="flex items-center gap-3 sm:gap-6 overflow-hidden">
                    <span className="font-light uppercase tracking-[0.1em] sm:tracking-[0.2em] whitespace-nowrap">
                        New Collection Drop
                    </span>
                    <span className="font-mono text-xs opacity-70 whitespace-nowrap">
                        {days.toString().padStart(2, '0')}d {hours.toString().padStart(2, '0')}h {minutes.toString().padStart(2, '0')}m {seconds.toString().padStart(2, '0')}s
                    </span>
                    <span className="hidden md:inline text-xs opacity-50 font-light whitespace-nowrap">
                        June 15, 2025 • 1:00 PM BST
                    </span>
                </div>
            </div>
        </div>
    );
} 
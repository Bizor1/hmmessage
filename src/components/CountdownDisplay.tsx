'use client';

import { useDropCountdown } from '@/hooks/useCountdown';
import { useEffect, useState } from 'react';

interface CountdownDisplayProps {
    variant?: 'homepage' | 'overlay' | 'compact';
    showTitle?: boolean;
    className?: string;
}

export default function CountdownDisplay({
    variant = 'homepage',
    showTitle = true,
    className = ''
}: CountdownDisplayProps) {
    const { days, hours, minutes, seconds, isExpired } = useDropCountdown();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render countdown if expired
    if (isExpired) {
        return null;
    }

    // Don't render until mounted to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className={`countdown-skeleton ${className}`}>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded mb-4"></div>
                    <div className="flex gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-16 w-16 bg-gray-300 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const timeUnits = [
        { label: 'DAYS', value: days },
        { label: 'HOURS', value: hours },
        { label: 'MINUTES', value: minutes },
        { label: 'SECONDS', value: seconds },
    ];

    if (variant === 'compact') {
        return (
            <div className={`inline-flex items-center gap-2 text-sm font-medium ${className}`}>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs animate-pulse">
                    DROPPING IN
                </span>
                <span>{days}D {hours}H {minutes}M {seconds}S</span>
            </div>
        );
    }

    if (variant === 'overlay') {
        return (
            <div className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center ${className}`}>
                <div className="text-center text-white px-4 max-w-4xl">
                    {showTitle && (
                        <div className="mb-12 space-y-4">
                            <div className="text-xs uppercase tracking-[0.3em] text-gray-300 animate-fade-in">
                                EXCLUSIVE DROP
                            </div>
                            <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-wide bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent animate-slide-up">
                                COMING SOON
                            </h1>
                            <div className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-delay">
                                Under His Shelter Collection & Modular Message Carpenter Shorts
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-4 gap-4 md:gap-8 mb-12">
                        {timeUnits.map((unit, index) => (
                            <div
                                key={unit.label}
                                className="text-center animate-scale-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                    <div className="relative bg-black/50 border border-white/20 rounded-lg p-4 md:p-6 backdrop-blur-sm group-hover:border-white/40 transition-colors duration-300">
                                        <div className="text-3xl md:text-5xl font-bold mb-2 countdown-number">
                                            {unit.value.toString().padStart(2, '0')}
                                        </div>
                                        <div className="text-xs md:text-sm uppercase tracking-wider text-gray-400">
                                            {unit.label}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center space-y-6">
                        <div className="text-sm md:text-base text-gray-300 animate-fade-in-delay-2">
                            June 15, 2025 • 1:00 PM BST
                        </div>
                        <div className="text-xs uppercase tracking-widest text-gray-500 animate-pulse">
                            BE READY FOR THE DROP
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Homepage variant
    return (
        <div className={`text-center text-white ${className}`}>
            {showTitle && (
                <div className="mb-8 md:mb-12">
                    <div className="text-xs uppercase tracking-[0.3em] text-gray-300 mb-4 animate-fade-in">
                        EXCLUSIVE DROP
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wide mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent animate-slide-up">
                        COMING SOON
                    </h2>
                    <div className="text-base md:text-lg text-gray-300 max-w-xl mx-auto animate-fade-in-delay">
                        Under His Shelter Collection & Modular Message Carpenter Shorts
                    </div>
                </div>
            )}

            <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-md mx-auto mb-8">
                {timeUnits.map((unit, index) => (
                    <div
                        key={unit.label}
                        className="text-center animate-scale-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <div className="relative bg-black/30 border border-white/20 rounded-lg p-3 md:p-4 backdrop-blur-sm group-hover:border-white/40 transition-colors duration-300">
                                <div className="text-xl md:text-3xl font-bold mb-1 countdown-number">
                                    {unit.value.toString().padStart(2, '0')}
                                </div>
                                <div className="text-xs uppercase tracking-wider text-gray-400">
                                    {unit.label}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-xs md:text-sm text-gray-400 animate-fade-in-delay-2">
                June 15, 2025 • 1:00 PM BST
            </div>
        </div>
    );
} 
'use client';

import { useDropCountdown } from '@/hooks/useCountdown';
import { useEffect, useState } from 'react';

interface PremiumCollectionOverlayProps {
    collectionHandle: string;
    collectionTitle: string;
}

// Collections that should show countdown overlay
const RESTRICTED_COLLECTIONS = [
    'long-sleeve-tee',
    'long-sleeve-tees',
    'longsleeve',
    'longsleeve-tee',
    'shorts',
    'carpenter-shorts',
    'modular-message-shorts'
];

export default function PremiumCollectionOverlay({
    collectionHandle,
    collectionTitle
}: PremiumCollectionOverlayProps) {
    const { days, hours, minutes, seconds, isExpired } = useDropCountdown();
    const [mounted, setMounted] = useState(false);
    const [liveCount, setLiveCount] = useState(8247);
    const [hypeLevel, setHypeLevel] = useState('MAXIMUM');

    useEffect(() => {
        setMounted(true);

        // Simulate live user count
        const interval = setInterval(() => {
            setLiveCount(prev => prev + Math.floor(Math.random() * 5) + 1);
        }, 3000 + Math.random() * 2000);

        // Hype level updates
        const hypeInterval = setInterval(() => {
            const levels = ['MAXIMUM', 'INSANE', 'LEGENDARY', 'GODTIER'];
            setHypeLevel(levels[Math.floor(Math.random() * levels.length)]);
        }, 5000);

        return () => {
            clearInterval(interval);
            clearInterval(hypeInterval);
        };
    }, []);

    // Don't show overlay if countdown is expired
    if (isExpired || !mounted) {
        return null;
    }

    // Check if current collection should be restricted
    const isRestrictedCollection = RESTRICTED_COLLECTIONS.some(restricted =>
        collectionHandle.toLowerCase().includes(restricted) ||
        restricted.includes(collectionHandle.toLowerCase())
    );

    if (!isRestrictedCollection) {
        return null;
    }

    const timeUnits = [
        { label: 'DAYS', value: days, icon: '🔥' },
        { label: 'HOURS', value: hours, icon: '⚡' },
        { label: 'MINUTES', value: minutes, icon: '💎' },
        { label: 'SECONDS', value: seconds, icon: '🚀' },
    ];

    return (
        <div className="fixed inset-0 z-50 bg-black overflow-y-auto">
            {/* Premium Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-black to-orange-500/30"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,0,0,0.15),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,165,0,0.15),transparent_50%)]"></div>

                {/* Animated grid */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30l10-10-10-10-10 10 10 10zm0 20l10-10-10-10-10 10 10 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '30px 30px',
                        animation: 'backgroundMove 15s linear infinite'
                    }}
                ></div>
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
                {/* Collection Access Denied Header */}
                <div className="mb-12 animate-fade-in">
                    <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-black uppercase tracking-wider animate-pulse border border-red-300">
                            🚨 RESTRICTED ACCESS
                        </span>
                        <span className="text-red-400 text-base font-mono font-bold">
                            {liveCount.toLocaleString()} PEOPLE WAITING
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tight text-white mb-6 leading-none">
                        <span className="bg-gradient-to-r from-white via-red-400 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl">
                            {collectionTitle}
                        </span>
                    </h1>

                    <div className="text-2xl md:text-3xl font-bold text-red-400 uppercase tracking-widest mb-4 animate-pulse">
                        HYPE LEVEL: <span className="text-white">{hypeLevel}</span>
                    </div>

                    <div className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-medium mb-8">
                        This collection is part of our exclusive drop and will be available on:
                    </div>

                    <div className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-wide gradient-text-glow">
                        June 15, 2025 • 1:00 PM BST
                    </div>
                </div>

                {/* MEGA COUNTDOWN */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16 max-w-5xl animate-scale-in">
                    {timeUnits.map((unit, index) => (
                        <div key={unit.label} className="relative group">
                            {/* Multiple glowing borders for that premium effect */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-2xl blur opacity-20 group-hover:opacity-50 transition-all duration-700 animate-pulse"></div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition-all duration-500"></div>

                            <div className="relative bg-black/90 border-2 border-red-500/60 rounded-2xl p-6 md:p-10 backdrop-blur-xl group-hover:border-red-400 transition-all duration-300 group-hover:scale-105">
                                <div className="text-3xl md:text-4xl mb-3">{unit.icon}</div>
                                <div className="text-5xl md:text-7xl font-black mb-3 text-white countdown-number-mega">
                                    {unit.value.toString().padStart(2, '0')}
                                </div>
                                <div className="text-sm md:text-base uppercase tracking-widest text-gray-300 font-bold">
                                    {unit.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to action */}
                <div className="text-center space-y-8 animate-fade-in-delay-2 max-w-2xl">
                    <div className="text-gray-300 text-base md:text-lg font-medium">
                        Get ready for the most anticipated drop of the season. This collection will be available exactly when the countdown reaches zero.
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                        >
                            <span className="relative z-10">EXPLORE OTHER COLLECTIONS</span>
                        </button>

                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'Exclusive Fashion Drop Coming Soon!',
                                        text: `${collectionTitle} dropping June 15, 2025`,
                                        url: window.location.href
                                    });
                                } else {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Link copied to clipboard!');
                                }
                            }}
                            className="group relative overflow-hidden border-2 border-white/40 text-white px-8 py-4 rounded-xl font-black uppercase tracking-wide transition-all duration-300 hover:border-white/70 hover:bg-white/10"
                        >
                            <span className="relative z-10">SHARE THE HYPE</span>
                        </button>
                    </div>

                    <div className="text-sm text-gray-400 uppercase tracking-widest">
                        BE READY • BE FIRST • BE EXCLUSIVE
                    </div>
                </div>
            </div>

            {/* Floating particles for that premium feel */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-red-400/40 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
} 
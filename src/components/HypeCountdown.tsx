'use client';

import { useDropCountdown } from '@/hooks/useCountdown';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface HypeCountdownProps {
    variant?: 'homepage' | 'overlay' | 'mega';
    className?: string;
}

export default function HypeCountdown({ variant = 'homepage', className = '' }: HypeCountdownProps) {
    const { days, hours, minutes, seconds, isExpired } = useDropCountdown();
    const [mounted, setMounted] = useState(false);
    const [liveCount, setLiveCount] = useState(8247);
    const [email, setEmail] = useState('');
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [showNotify, setShowNotify] = useState(false);
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

    const handleEmailSignup = () => {
        if (email) {
            setIsSignedUp(true);
            setShowNotify(true);
            setTimeout(() => setShowNotify(false), 3000);
        }
    };

    if (isExpired || !mounted) return null;

    const timeUnits = [
        { label: 'DAYS', value: days, icon: '📅' },
        { label: 'HOURS', value: hours, icon: '⏰' },
        { label: 'MINUTES', value: minutes, icon: '⚡' },
        { label: 'SECONDS', value: seconds, icon: '🔥' },
    ];

    if (variant === 'mega') {
        return (
            <div className={`relative w-full min-h-screen bg-black overflow-hidden ${className}`}>
                {/* SICK Background Video Effect */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-black to-orange-500/20"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,0,0,0.1),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,165,0,0.1),transparent_50%)]"></div>

                    {/* Matrix-style falling code effect */}
                    <div className="absolute inset-0 opacity-10">
                        {[...Array(50)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute text-green-400 text-xs font-mono animate-pulse opacity-30"
                                style={{
                                    left: `${i * 2}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${3 + Math.random() * 4}s`
                                }}
                            >
                                {Math.random().toString(36).substring(7)}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
                    {/* HYPE HEADER */}
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <motion.span
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                            >
                                🔥 LIVE NOW
                            </motion.span>
                            <span className="text-red-400 text-sm font-mono">
                                {liveCount.toLocaleString()} PEOPLE WAITING
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white mb-4 bg-gradient-to-r from-white via-red-400 to-orange-400 bg-clip-text text-transparent">
                            EXCLUSIVE DROP
                        </h1>

                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-xl md:text-2xl font-bold text-red-400 uppercase tracking-widest"
                        >
                            HYPE LEVEL: {hypeLevel}
                        </motion.div>
                    </motion.div>

                    {/* MEGA COUNTDOWN */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="grid grid-cols-4 gap-4 md:gap-8 mb-12 max-w-4xl"
                    >
                        {timeUnits.map((unit, index) => (
                            <motion.div
                                key={unit.label}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative group"
                            >
                                {/* Glowing border effect */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition-all duration-500 animate-pulse"></div>

                                <div className="relative bg-black/80 border border-red-500/50 rounded-xl p-4 md:p-8 backdrop-blur-xl">
                                    <div className="text-2xl mb-2">{unit.icon}</div>
                                    <motion.div
                                        key={unit.value}
                                        initial={{ scale: 1.2, color: '#ff0000' }}
                                        animate={{ scale: 1, color: '#ffffff' }}
                                        transition={{ duration: 0.3 }}
                                        className="text-4xl md:text-6xl font-black mb-2 countdown-number-mega"
                                    >
                                        {unit.value.toString().padStart(2, '0')}
                                    </motion.div>
                                    <div className="text-xs md:text-sm uppercase tracking-widest text-gray-400 font-bold">
                                        {unit.label}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* PRODUCT PREVIEW */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 uppercase tracking-wide">
                            What&apos;s Dropping 🚀
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl">
                            {[
                                { name: 'Under His Shelter Tee', price: '£45', img: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749622259/White_front_vvqvr8.jpg' },
                                { name: 'Black Shelter Tee', price: '£45', img: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749622131/Blackfront_qnzpya.jpg' },
                                { name: 'Carpenter Shorts Blue', price: '£55', img: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749621658/CE172B24-BBD8-4CB2-B1D9-99598376708B_ke9ack.jpg' },
                                { name: 'Carpenter Shorts Black', price: '£55', img: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325445/mymessage/images/PHOTO-2025-04-29-10-42-32.jpg' }
                            ].map((product, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05, rotateY: 5 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative group overflow-hidden rounded-lg bg-black/50 border border-red-500/30"
                                >
                                    <Image
                                        src={product.img}
                                        alt={product.name}
                                        width={300}
                                        height={300}
                                        className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="font-bold text-sm mb-1">{product.name}</div>
                                        <div className="text-red-400 font-bold">{product.price}</div>
                                    </div>

                                    {/* SOLD OUT overlay effect */}
                                    <div className="absolute inset-0 bg-red-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white font-black text-lg uppercase tracking-widest rotate-12">
                                            COMING SOON
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* WAITLIST SIGNUP */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="max-w-md w-full mb-8"
                    >
                        {!isSignedUp ? (
                            <div className="bg-black/80 backdrop-blur-xl border border-red-500/50 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">
                                    🚨 GET EARLY ACCESS
                                </h3>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="flex-1 bg-black/50 border border-red-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                                    />
                                    <button
                                        onClick={handleEmailSignup}
                                        className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:scale-105 transition-transform duration-200"
                                    >
                                        JOIN
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    Be first in line when the drop goes live
                                </p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center"
                            >
                                <div className="text-2xl mb-2">✅</div>
                                <h3 className="text-lg font-bold text-green-400 uppercase">
                                    YOU&apos;RE IN!
                                </h3>
                                <p className="text-sm text-gray-300">
                                    We&apos;ll notify you when the drop goes live
                                </p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* SOCIAL PROOF */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className="text-center"
                    >
                        <div className="text-sm text-gray-400 mb-4">
                            Join {liveCount.toLocaleString()} others waiting for this drop
                        </div>
                        <div className="flex justify-center gap-6 text-xs text-gray-500 uppercase tracking-wider">
                            <span>• LIMITED QUANTITIES</span>
                            <span>• PREMIUM QUALITY</span>
                            <span>• EXCLUSIVE DESIGN</span>
                        </div>
                    </motion.div>
                </div>

                {/* Notification Toast */}
                <AnimatePresence>
                    {showNotify && (
                        <motion.div
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg font-bold z-50"
                        >
                            🔥 You&apos;re on the list!
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Other variants remain the same but with enhanced styling...
    return (
        <div className={`text-center text-white ${className}`}>
            {/* Simplified version for other variants */}
            <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-md mx-auto mb-8">
                {timeUnits.map((unit, index) => (
                    <div key={unit.label} className="text-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <div className="relative bg-black/30 border border-white/20 rounded-lg p-3 md:p-4 backdrop-blur-sm">
                                <div className="text-xl md:text-3xl font-bold mb-1">
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
        </div>
    );
} 
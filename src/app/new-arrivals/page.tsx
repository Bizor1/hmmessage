'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import Image from 'next/image';

// Floating shapes component
const FloatingShape = ({ delay = 0, children }: { delay: number; children: React.ReactNode }) => (
    <motion.div
        initial={{ y: 0 }}
        animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, -5, 0]
        }}
        transition={{
            duration: 6,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    >
        {children}
    </motion.div>
);

// Decorative vector shapes
const shapes = [
    <svg key="1" width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-purple-500">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
    </svg>,
    <svg key="2" width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-pink-500">
        <rect x="10" y="10" width="20" height="20" stroke="currentColor" strokeWidth="2" />
    </svg>,
    <svg key="3" width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-yellow-500">
        <path d="M20 5L35 30H5L20 5Z" stroke="currentColor" strokeWidth="2" />
    </svg>
];

const quotes = [
    "Rocks!",
    "Effortless Style",
    "Bold Expression"
];

const images = [
    "https://res.cloudinary.com/duhfv8nqy/image/upload/v1747347372/WhatsApp_Image_2025-05-15_at_7.03.41_PM_w3wdak.jpg"
];

// New products with front and back images
const products = [
    {
        front: "https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325443/mymessage/images/PHOTO-2025-04-29-10-42-32%20%282%29.jpg",
        back: "https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325445/mymessage/images/PHOTO-2025-04-29-10-42-32.jpg",
        name: "Statement Tee"
    },
    {
        front: "https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325441/mymessage/images/PHOTO-2025-04-29-10-42-31%20%281%29.jpg",
        back: "https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325442/mymessage/images/PHOTO-2025-04-29-10-42-31.jpg",
        name: "Urban Essential"
    }
];

// Animated text component with hover effect
const AnimatedText = ({ text, isVisible }: { text: string; isVisible: boolean }) => {
    const [isHovered, setIsHovered] = useState(-1);

    return (
        <div className="flex flex-wrap justify-center">
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{
                        duration: 0.5,
                        delay: index * 0.03,
                        ease: "easeOut"
                    }}
                    onHoverStart={() => setIsHovered(index)}
                    onHoverEnd={() => setIsHovered(-1)}
                    className={`text-transparent bg-clip-text ${isHovered === index
                        ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500'
                        : 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'
                        } cursor-pointer transition-all duration-300`}
                    style={{
                        display: char === ' ' ? 'inline-block' : 'inline-block',
                        width: char === ' ' ? '0.5em' : 'auto',
                        transform: isHovered === index ? 'scale(1.2)' : 'scale(1)'
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </div>
    );
};

// Product card component with front/back animation
const ProductCard = ({ product, isVisible, index }: { product: any; isVisible: boolean; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                x: isVisible ? 0 : 100
            }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-24"
        >
            <motion.div
                className="relative aspect-[16/9] overflow-hidden rounded-lg shadow-2xl cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isHovered ? 'back' : 'front'}
                        initial={{ opacity: 0, rotateY: -90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: 90 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={isHovered ? product.back : product.front}
                            alt={`${product.name} ${isHovered ? 'back' : 'front'}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </motion.div>
                </AnimatePresence>

                <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                />

                {/* Hover indicator */}
                <motion.div
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <span className="text-white text-sm font-medium">↻</span>
                </motion.div>
            </motion.div>

            <div className="mt-6 text-center italic text-lg">
                <AnimatedText
                    text={quotes[index + 1]}
                    isVisible={isVisible}
                />
            </div>
        </motion.div>
    );
};

export default function NewArrivals() {
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [showPopup, setShowPopup] = useState(false);

    // Trigger confetti on initial load
    useEffect(() => {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentIndex(0);
            setShowPopup(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (currentIndex >= 0 && currentIndex < images.length + products.length - 1) {
            const timer = setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setShowPopup(true);
            }, 6000);

            return () => clearTimeout(timer);
        }
    }, [currentIndex]);

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
            {/* Floating shapes in the background */}
            <div className="fixed inset-0 pointer-events-none">
                {shapes.map((shape, index) => (
                    <div key={index} className="absolute" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                    }}>
                        <FloatingShape delay={index * 2}>
                            {shape}
                        </FloatingShape>
                    </div>
                ))}
            </div>

            {/* Main content */}
            <motion.h1
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 1,
                    type: "spring",
                    stiffness: 100
                }}
                className="text-6xl font-bold text-center mt-32 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            >
                New Arrivals
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, rotateX: -90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                exit={{ opacity: 0, rotateX: 90 }}
                transition={{ duration: 1, delay: 1 }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
                    Welcome to the Summer &apos;25 Drop
                </h2>
            </motion.div>

            {/* Popup notification */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className="fixed bottom-10 right-10 bg-white text-black p-4 rounded-lg shadow-lg"
                        onClick={() => setShowPopup(false)}
                    >
                        <p className="text-sm font-medium">🎉 New items just dropped!</p>
                        <p className="text-xs text-gray-600 mt-1">Click to explore</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Images and Quotes */}
            <div className="max-w-4xl mx-auto px-4">
                {images.map((image, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{
                            opacity: currentIndex >= index ? 1 : 0,
                            x: currentIndex >= index ? 0 : 100
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mb-24"
                    >
                        <motion.div
                            className="relative aspect-[16/9] overflow-hidden rounded-lg shadow-2xl"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image
                                src={image}
                                alt={`Summer Collection ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={index === 0}
                            />
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                            />
                        </motion.div>

                        <div className="mt-6 text-center italic text-lg">
                            <AnimatedText
                                text={quotes[index]}
                                isVisible={currentIndex >= index}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Product cards */}
            <div className="max-w-4xl mx-auto px-4">
                {products.map((product, index) => (
                    <ProductCard
                        key={index}
                        product={product}
                        isVisible={currentIndex >= images.length + index}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
} 
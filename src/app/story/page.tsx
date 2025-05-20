'use client';

import React from 'react';
import { CldImage } from 'next-cloudinary';
import { motion } from 'framer-motion';

// Dove SVG component
const Dove = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 100 100"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
    >
        <path d="M86.1,35.6c-0.1-0.3-0.3-0.6-0.6-0.8c-0.3-0.2-0.6-0.2-0.9-0.2c-0.3,0.1-0.6,0.3-0.8,0.6 c-0.2,0.3-0.2,0.6-0.2,0.9c0.1,0.3,0.3,0.6,0.6,0.8c0.3,0.2,0.6,0.2,0.9,0.2c0.3-0.1,0.6-0.3,0.8-0.6 C86.1,36.2,86.2,35.9,86.1,35.6z M75.5,28.1c-0.1-0.3-0.3-0.6-0.6-0.8c-0.3-0.2-0.6-0.2-0.9-0.2c-0.3,0.1-0.6,0.3-0.8,0.6 c-0.2,0.3-0.2,0.6-0.2,0.9c0.1,0.3,0.3,0.6,0.6,0.8c0.3,0.2,0.6,0.2,0.9,0.2c0.3-0.1,0.6-0.3,0.8-0.6 C75.5,28.7,75.6,28.4,75.5,28.1z M63.9,23.1c-0.1-0.3-0.3-0.6-0.6-0.8c-0.3-0.2-0.6-0.2-0.9-0.2c-0.3,0.1-0.6,0.3-0.8,0.6 c-0.2,0.3-0.2,0.6-0.2,0.9c0.1,0.3,0.3,0.6,0.6,0.8c0.3,0.2,0.6,0.2,0.9,0.2c0.3-0.1,0.6-0.3,0.8-0.6 C63.9,23.7,64,23.4,63.9,23.1z M51.3,20.6c-0.1-0.3-0.3-0.6-0.6-0.8c-0.3-0.2-0.6-0.2-0.9-0.2c-0.3,0.1-0.6,0.3-0.8,0.6 c-0.2,0.3-0.2,0.6-0.2,0.9c0.1,0.3,0.3,0.6,0.6,0.8c0.3,0.2,0.6,0.2,0.9,0.2c0.3-0.1,0.6-0.3,0.8-0.6 C51.3,21.2,51.4,20.9,51.3,20.6z M38.7,20.6c-0.1-0.3-0.3-0.6-0.6-0.8c-0.3-0.2-0.6-0.2-0.9-0.2c-0.3,0.1-0.6,0.3-0.8,0.6 c-0.2,0.3-0.2,0.6-0.2,0.9c0.1,0.3,0.3,0.6,0.6,0.8c0.3,0.2,0.6,0.2,0.9,0.2c0.3-0.1,0.6-0.3,0.8-0.6 C38.7,21.2,38.8,20.9,38.7,20.6z M26.1,23.1c-0.1-0.3-0.3-0.6-0.6-0.8c-0.3-0.2-0.6-0.2-0.9-0.2c-0.3,0.1-0.6,0.3-0.8,0.6 c-0.2,0.3-0.2,0.6-0.2,0.9c0.1,0.3,0.3,0.6,0.6,0.8c0.3,0.2,0.6,0.2,0.9,0.2c0.3-0.1,0.6-0.3,0.8-0.6 C26.1,23.7,26.2,23.4,26.1,23.1z M14.5,28.1c-0.1-0.3-0.3-0.6-0.6-0.8c-0.3-0.2-0.6-0.2-0.9-0.2c-0.3,0.1-0.6,0.3-0.8,0.6 c-0.2,0.3-0.2,0.6-0.2,0.9c0.1,0.3,0.3,0.6,0.6,0.8c0.3,0.2,0.6,0.2,0.9,0.2c0.3-0.1,0.6-0.3,0.8-0.6 C14.5,28.7,14.6,28.4,14.5,28.1z M3.9,35.6c-0.1-0.3-0.3-0.6-0.6-0.8c-0.3-0.2-0.6-0.2-0.9-0.2c-0.3,0.1-0.6,0.3-0.8,0.6 c-0.2,0.3-0.2,0.6-0.2,0.9c0.1,0.3,0.3,0.6,0.6,0.8c0.3,0.2,0.6,0.2,0.9,0.2c0.3-0.1,0.6-0.3,0.8-0.6 C3.9,36.2,4,35.9,3.9,35.6z" />
    </svg>
);

// Animated Dove component
const AnimatedDove = ({ delay = 0, reverse = false }) => {
    return (
        <motion.div
            initial={{
                x: reverse ? '100vw' : '-100vw',
                y: Math.random() * 500 // Random vertical position
            }}
            animate={{
                x: reverse ? '-100vw' : '100vw',
                y: Math.random() * 500
            }}
            transition={{
                duration: 15,
                delay,
                repeat: Infinity,
                ease: "linear"
            }}
            className="absolute"
        >
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotate: reverse ? [-10, 0, -10] : [10, 0, 10]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <Dove className="text-white/40" />
            </motion.div>
        </motion.div>
    );
};

// Doves Container component
const DovesContainer = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
                <AnimatedDove key={i} delay={i * 2} reverse={i % 2 === 0} />
            ))}
        </div>
    );
};

// Curtain Reveal Component
const CurtainReveal = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative w-full h-full">
            {children}
            <motion.div
                className="absolute inset-0 bg-black"
                initial={{ scaleX: 1 }}
                whileInView={{ scaleX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{ transformOrigin: 'left' }}
            />
            <motion.div
                className="absolute inset-0 bg-black"
                initial={{ scaleX: 1 }}
                whileInView={{ scaleX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                style={{ transformOrigin: 'right' }}
            />
        </div>
    );
};

export default function StoryPage() {
    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <DovesContainer />
            {/* Hero Section */}
            <section className="h-screen relative flex items-center justify-center">
                <div className="absolute inset-0">
                    <CurtainReveal>
                        <CldImage
                            src="https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325319/mymessage/favicons/favicon.jpg"
                            alt="Brand Story Hero"
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                    </CurtainReveal>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative text-center px-4 max-w-4xl mx-auto"
                >
                    <div className="mb-4 text-xs uppercase tracking-widest">The Story</div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-wide">THE SECRET PLACE</h1>
                    <p className="text-xs md:text-sm uppercase tracking-widest">THE STORY BEHIND THE PSALM 91 LONG SLEEVE</p>
                </motion.div>
            </section>

            {/* Story Timeline Section */}
            <section className="relative py-20">
                {/* Content Sections with Timeline */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
                    {/* Animated Central Line - Now contained within content width */}
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 1.5 }}
                        className="absolute left-1/2 transform -translate-x-1/2 w-[2px] bg-white/20"
                        style={{ top: 0, bottom: 0 }}
                    />

                    {/* Section 1 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-32 relative"
                    >
                        <div className="flex items-center">
                            <div className="space-y-6 bg-black/80 p-8 rounded-lg backdrop-blur-sm relative z-10">
                                <p className="text-xs md:text-sm leading-relaxed tracking-wide">
                                    At MY-MESSAGE, every piece we create carries more than just design, It carries a declaration.
                                    The Psalm 91 long sleeve was born out of a season where covering, protection, and peace were
                                    not just hoped for, they were essential.
                                </p>
                                <p className="text-xs md:text-sm leading-relaxed tracking-wide">
                                    Inspired by the scripture &ldquo;Whoever dwells in the shelter of the Most High will rest in the
                                    shadow of the Almighty&rdquo;. This piece is a visual reminder of the safety and comfort found in
                                    God&apos;s presence. This isn&apos;t just a fashion. It&apos;s a message. A movement. A reminder that faith
                                    is style too.
                                </p>
                            </div>
                        </div>
                        <div className="relative h-[600px] md:h-[800px]">
                            <CurtainReveal>
                                <CldImage
                                    src="https://res.cloudinary.com/duhfv8nqy/image/upload/v1747347372/WhatsApp_Image_2025-05-15_at_7.03.41_PM_w3wdak.jpg"
                                    alt="Psalm 91 Long Sleeve"
                                    fill
                                    className="object-cover rounded-lg"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </CurtainReveal>
                        </div>
                    </motion.div>

                    {/* Scripture Emphasis */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-32 relative z-10 bg-black/80 py-12 rounded-lg backdrop-blur-sm"
                    >
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 uppercase tracking-wide">Under His Shelter</h2>
                        <p className="text-xs md:text-sm uppercase tracking-widest">Psalm 91:1</p>
                    </motion.div>

                    {/* Section 2 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-32 relative"
                    >
                        <div className="relative h-[600px] md:h-[800px] md:order-2">
                            <CurtainReveal>
                                <CldImage
                                    src="https://res.cloudinary.com/duhfv8nqy/image/upload/v1747347405/WhatsApp_Image_2025-05-15_at_7.03.41_PM_1_g4te0u.jpg"
                                    alt="Faith Fueled Fashion"
                                    fill
                                    className="object-cover rounded-lg"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </CurtainReveal>
                        </div>
                        <div className="flex items-center md:order-1">
                            <div className="space-y-6 bg-black/80 p-8 rounded-lg backdrop-blur-sm relative z-10">
                                <h2 className="text-2xl md:text-4xl font-bold mb-6 uppercase tracking-wide">THE FAITH FUELED STAPLE YOUR WARDROBE NEEDS</h2>
                                <p className="text-xs md:text-sm leading-relaxed tracking-wide">
                                    Bold, wearable and rooted in scripture, this long sleeve isn&apos;t just another drop, it&apos;s a declaration.
                                    Elevate your everyday style with a piece that covers you inside and out.
                                </p>
                                <p className="text-xs md:text-sm leading-relaxed tracking-wide">
                                    Whether walking into the unknown or standing boldly in the open, Psalm 91 is more than a scripture,
                                    it&apos;s a promise. This was made to remain you that every step you take is shielding by divine protection.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Styling Guide */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32 relative z-10 bg-black/80 p-12 rounded-lg backdrop-blur-sm"
                    >
                        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 uppercase tracking-wide">HOW TO STYLE IT: THE PSALM 91 LONG SLEEVE</h2>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold uppercase tracking-wide">Coffee Run Cool:</h3>
                                <p className="text-xs md:text-sm leading-relaxed tracking-wide">
                                    Pair it with wide leg denim, a crossbody bag, and fresh sneakers. Add a beanie or cap
                                    to finish off the laid back, covered but confident look. Perfect for grabbing a chai at
                                    Psalms coffee.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold uppercase tracking-wide">Faith Meets Function:</h3>
                                <p className="text-xs md:text-sm leading-relaxed tracking-wide">
                                    Layer under a boxy bomber or oversized blazer for modern streetwear feel. Add a cargo
                                    pants or tailored jogger to strike that balance between purpose and edge.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Final Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center relative z-10 bg-black/80 p-12 rounded-lg backdrop-blur-sm"
                    >
                        <p className="text-xs md:text-sm leading-relaxed tracking-wide">
                            Forget trend that fade. This Long Sleeves, blends Clean street wear with eternal message
                            Of Psalm 91.
                            <br />
                            <span className="font-bold mt-8 block text-xl md:text-2xl uppercase tracking-wide">
                                Because the best protection never goes out of style.
                            </span>
                        </p>
                        <p className="text-xs mt-12 font-light tracking-[0.2em] uppercase">JUNE 2025</p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
} 
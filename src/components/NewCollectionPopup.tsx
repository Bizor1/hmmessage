'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function NewCollectionPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

    useEffect(() => {
        // Check if popup has already been shown in this session
        const hasBeenShown = sessionStorage.getItem('newCollectionPopupShown');

        if (!hasBeenShown) {
            // Show popup after 5 seconds only if not shown before in this session
            const timer = setTimeout(() => {
                setIsOpen(true);
                // Mark as shown in session storage
                sessionStorage.setItem('newCollectionPopupShown', 'true');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to subscribe');
            }

            setSubmitStatus('success');
            setEmail('');
            // Close modal after successful submission after 2 seconds
            setTimeout(() => {
                setIsOpen(false);
                setSubmitStatus(null);
            }, 2000);
        } catch (error) {
            setSubmitStatus('error');
            console.error('Error subscribing:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
                {/* Close button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
                    aria-label="Close popup"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Image section */}
                    <div className="w-full md:w-1/2 relative h-48 md:h-auto">
                        <Image
                            src="https://res.cloudinary.com/duhfv8nqy/image/upload/v1749465449/WhatsApp_Image_2025-06-09_at_9.18.52_AM_bsi7yt.jpg"
                            alt="New Collection Preview"
                            fill
                            className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                        />
                    </div>

                    {/* Content section */}
                    <div className="w-full md:w-1/2 p-6">
                        <h2 className="text-2xl font-bold mb-4 px-2">NEW COLLECTION</h2>
                        <h3 className="text-xl mb-4 px-2">DROPPING!!!</h3>
                        <p className="text-gray-600 mb-6 px-2">Explore in arrivals</p>

                        <form onSubmit={handleSubmit} className="space-y-4 px-2">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                            >
                                {isSubmitting ? 'Subscribing...' : 'SUBSCRIBE'}
                            </button>
                            {submitStatus === 'success' && (
                                <p className="text-green-600 text-sm">Successfully subscribed!</p>
                            )}
                            {submitStatus === 'error' && (
                                <p className="text-red-600 text-sm">Failed to subscribe. Please try again.</p>
                            )}
                        </form>

                        <p className="text-xs text-gray-500 mt-4 px-2">I Agree To Terms And Conditions</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 
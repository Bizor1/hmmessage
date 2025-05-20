'use client';

import { useState } from 'react';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setSubmitStatus('error');
            console.error('Error sending message:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gray-50 py-20">
                <div className="container-represent max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Get in Touch</h1>
                    <p className="text-gray-600 text-center max-w-2xl mx-auto">
                        Have a question about our collections? Want to collaborate?
                        We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                    </p>
                </div>
            </div>

            <div className="container-represent max-w-6xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-medium mb-2">Customer Support</h3>
                                <p className="text-gray-600">+44 7307 638132</p>
                                <a
                                    href="https://wa.me/447307638132"
                                    className="inline-flex items-center text-gray-600 hover:text-green-600 mt-2"
                                >
                                    <FaWhatsapp className="w-5 h-5 mr-2" />
                                    Chat on WhatsApp
                                </a>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-2">Social Media</h3>
                                <div className="space-y-3">
                                    <a
                                        href="https://www.instagram.com/mymessage55"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-gray-600 hover:text-pink-600"
                                    >
                                        <FaInstagram className="w-5 h-5 mr-2" />
                                        @mymessage55
                                    </a>
                                    <a
                                        href="https://www.tiktok.com/@mymessage55"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-gray-600 hover:text-black"
                                    >
                                        <FaTiktok className="w-5 h-5 mr-2" />
                                        @mymessage55
                                    </a>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-2">Business Hours</h3>
                                <p className="text-gray-600">
                                    Monday - Friday: 9:00 AM - 6:00 PM (GMT)<br />
                                    Saturday: 10:00 AM - 4:00 PM (GMT)<br />
                                    Sunday: Closed
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                                >
                                    <option value="">Select a subject</option>
                                    <option value="customer-support">Customer Support</option>
                                    <option value="business">Business Inquiry</option>
                                    <option value="press">Press Inquiry</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                            {submitStatus === 'success' && (
                                <p className="text-green-600 text-center mt-2">Message sent successfully!</p>
                            )}
                            {submitStatus === 'error' && (
                                <p className="text-red-600 text-center mt-2">Failed to send message. Please try again.</p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 
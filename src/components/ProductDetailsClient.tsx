'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

interface ProductMedia {
    url: string;
    altText: string;
    type: 'image' | 'video';
    previewUrl?: string;
}

interface ProductVariant {
    id: string;
    title: string;
    availableForSale: boolean;
    selectedOptions: Array<{
        name: string;
        value: string;
    }>;
}

interface ProductOption {
    name: string;
    values: string[];
}

interface ProductDetailsProps {
    product: {
        id: string;
        title: string;
        description: string;
        descriptionHtml: string;
        price: number;
        currencyCode: string;
        mainImages: ProductMedia[];
        detailImages: ProductMedia[];
        options: ProductOption[];
        variants: ProductVariant[];
    };
}

export default function ProductDetailsClient({ product }: ProductDetailsProps) {
    const [selectedSize, setSelectedSize] = useState('');
    const { addToCart, openCart } = useCart();
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [availableSizes, setAvailableSizes] = useState<string[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const header = document.querySelector('header');
        if (header) {
            header.classList.add('product-details-header');
        }

        // Get available sizes from variants
        const sizes = product.variants
            .filter(variant => variant.availableForSale)
            .map(variant =>
                variant.selectedOptions.find(opt => opt.name.toLowerCase() === 'size')?.value
            )
            .filter((size): size is string => size !== undefined);

        setAvailableSizes(sizes);

        // Auto-select size if only one is available
        if (sizes.length === 1) {
            setSelectedSize(sizes[0]);
        }

        return () => {
            window.removeEventListener('resize', checkMobile);
            if (header) {
                header.classList.remove('product-details-header');
            }
        };
    }, [product.mainImages, product.variants]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }

        const variant = product.variants.find(v =>
            v.selectedOptions.some(opt => opt.value === selectedSize)
        );

        if (!variant) {
            alert('Selected size is not available');
            return;
        }

        addToCart({
            id: variant.id,
            name: product.title,
            price: product.price,
            imageUrl: product.mainImages[0]?.url || '',
            href: window.location.pathname,
        });
        openCart();
    };

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const swiperConfig: SwiperOptions = {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: 1,
        spaceBetween: 0,
        pagination: {
            clickable: true,
            type: 'bullets'
        },
        navigation: false,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                autoplay: false,
                navigation: {
                    enabled: true,
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
            }
        }
    };

    // Get the first three images for the carousel
    const carouselImages = product.mainImages
        .filter(media => media.type === 'image')
        .slice(0, 3);

    // Get the fourth image if it exists (will be undefined if not enough images)
    const fourthImage = product.mainImages
        .filter(media => media.type === 'image')[3];

    // Get remaining images after the fourth (for the "Additional Product Images" section)
    const remainingImages = product.mainImages
        .filter(media => media.type === 'image')
        .slice(4);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Product Carousel */}
            <div className="h-[50vh] md:h-[calc(100vh-4rem)] w-full relative bg-gray-50 mt-16">
                <Swiper
                    key={isMobile ? 'mobile-swiper' : 'desktop-swiper'}
                    {...swiperConfig}
                    className="h-full w-full product-swiper"
                >
                    {carouselImages.map((image, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative h-full w-full">
                                <Image
                                    src={image.url}
                                    alt={image.altText || `Product image ${index + 1}`}
                                    fill
                                    className="object-contain"
                                    priority={index === 0}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                </Swiper>
            </div>

            {/* Scrollable content */}
            <div className="min-h-screen bg-white">
                <div className="container-represent py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left side - Videos and Detail Images */}
                        <div className="space-y-8">
                            {/* Single Video or 4th Image Section - This section renders AT MOST ONE item */}
                            {(() => {
                                const videos = product.mainImages.filter(media => media.type === 'video');

                                if (videos.length > 0) {
                                    const video = videos[0]; // Display only the first video
                                    return (
                                        <div className="relative aspect-video rounded-lg overflow-hidden">
                                            <video
                                                src={video.url}
                                                poster={video.previewUrl}
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    );
                                }
                                // If no video, display the single fourthImage if it exists
                                else if (fourthImage) {
                                    return (
                                        <div className="relative aspect-square rounded-lg overflow-hidden">
                                            <Image
                                                src={fourthImage.url}
                                                alt={fourthImage.altText || 'Product image 4'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    );
                                }
                                return null; // No video and no fourth image
                            })()}

                            {/* Additional Product Images - Renders images from the 5th one onwards */}
                            {remainingImages.length > 0 && (
                                <div className="space-y-4">
                                    {remainingImages.map((image, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                            <Image
                                                src={image.url}
                                                alt={image.altText || `Additional image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Detail Images */}
                            {product.detailImages.length > 0 && (
                                <div className="space-y-4 mt-8">
                                    {product.detailImages
                                        .filter(media => media.type === 'image')
                                        .map((image, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                                <Image
                                                    src={image.url}
                                                    alt={image.altText || `Detail image ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Right side - Product Info */}
                        <div className="sticky top-16 self-start space-y-6 pt-8">
                            <h1 className="text-2xl font-medium">{product.title}</h1>

                            <div className="text-lg">
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: product.currencyCode,
                                }).format(product.price)}
                            </div>

                            <div className="prose prose-sm">
                                {(() => {
                                    const parts = product.description.split('PRODUCT DESCRIPTION');
                                    if (parts.length > 1) {
                                        const descriptionParts = parts[1].split('PRODUCT DETAILS');
                                        return <p>{descriptionParts[0].trim()}</p>;
                                    }
                                    return <p>{product.description}</p>;
                                })()}
                            </div>

                            {/* Size Selection */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium">Size</label>
                                    {availableSizes.length === 1 && (
                                        <span className="text-sm text-gray-500">Only size available</span>
                                    )}
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {product.options.find(opt => opt.name.toLowerCase() === 'size')?.values.map((size) => {
                                        const isAvailable = availableSizes.includes(size);

                                        return (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`
                                    border py-2 px-4 text-sm
                                    ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200'}
                                    ${isAvailable ? 'hover:border-black' : 'opacity-50 cursor-not-allowed'}
                                `}
                                                disabled={!isAvailable}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                                {availableSizes.length === 0 && (
                                    <p className="text-sm text-red-500">No sizes currently available</p>
                                )}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-900 transition-colors"
                            >
                                Add to Cart
                            </button>

                            {/* Accordion sections */}
                            <div className="space-y-4">
                                {/* Product Details */}
                                <div className="border-t border-gray-200 pt-4">
                                    <button
                                        onClick={() => toggleSection('details')}
                                        className="flex justify-between items-center w-full"
                                    >
                                        <span className="text-sm font-medium">Product Details</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            {activeSection === 'details' ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            )}
                                        </svg>
                                    </button>
                                    {activeSection === 'details' && (
                                        <div className="mt-4 prose prose-sm">
                                            {(() => {
                                                const parts = product.descriptionHtml.split('PRODUCT DETAILS');
                                                if (parts.length > 1) {
                                                    const detailsParts = parts[1].split('SIZE CHART');
                                                    return <div dangerouslySetInnerHTML={{ __html: detailsParts[0].trim() }} />;
                                                }
                                                return <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />;
                                            })()}
                                        </div>
                                    )}
                                </div>

                                {/* Size Guide */}
                                <div className="border-t border-gray-200 pt-4">
                                    <button
                                        onClick={() => toggleSection('size')}
                                        className="flex justify-between items-center w-full"
                                    >
                                        <span className="text-sm font-medium">Size Guide</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            {activeSection === 'size' ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            )}
                                        </svg>
                                    </button>
                                    {activeSection === 'size' && (
                                        <div className="mt-4 prose prose-sm">
                                            {(() => {
                                                console.log('DEBUG: Full descriptionHtml:', product.descriptionHtml);
                                                console.log('DEBUG: Looking for SIZE CHART marker...');
                                                const parts = product.descriptionHtml.split('SIZE CHART');
                                                console.log('DEBUG: Split result length:', parts.length);
                                                console.log('DEBUG: Split parts:', parts);
                                                if (parts.length > 1) {
                                                    console.log('DEBUG: Size chart content:', parts[1].trim());
                                                    return <div dangerouslySetInnerHTML={{ __html: parts[1].trim() }} />;
                                                }
                                                return <p>Size guide information will be available soon.</p>;
                                            })()}
                                        </div>
                                    )}
                                </div>

                                {/* Shipping & Returns */}
                                <div className="border-t border-gray-200 pt-4">
                                    <button
                                        onClick={() => toggleSection('shipping')}
                                        className="flex justify-between items-center w-full"
                                    >
                                        <span className="text-sm font-medium">Shipping & Returns</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            {activeSection === 'shipping' ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            )}
                                        </svg>
                                    </button>
                                    {activeSection === 'shipping' && (
                                        <div className="mt-4 prose prose-sm">
                                            <div className="space-y-6">
                                                {/* Returns & Refunds Policy */}
                                                <div>
                                                    <h4 className="font-medium text-black mb-3">Returns & Refunds Policy</h4>
                                                    <div className="space-y-2 text-sm text-gray-700">
                                                        <p>We offer returns, refunds, size swaps (if stock is available).</p>
                                                        <p>Please ensure you review your order before making a purchase to limit any errors.</p>

                                                        <p className="font-medium mt-4 mb-2">Return Conditions:</p>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            <li>The return must be sent back within 14 days of the delivery date</li>
                                                            <li>The item must be in its original, unused, unaltered and unwashed condition</li>
                                                            <li>The item must be returned with tags and packaging</li>
                                                            <li>We do not cover the shipping cost of a returned item</li>
                                                            <li>Please ensure to track your returned parcels through your selected courier to ensure parcel does not get lost, as we are not liable for lost returns</li>
                                                        </ul>

                                                        <p className="mt-3">Please contact us for returns forms.</p>
                                                        <p>During the process of your return, if you have any enquiry about the product you are returning, please get in touch with the courier. For any other enquiries, please contact us.</p>
                                                    </div>
                                                </div>

                                                {/* Shipping Information */}
                                                <div className="border-t border-gray-100 pt-4">
                                                    <h4 className="font-medium text-black mb-3">Shipping Information</h4>
                                                    <p className="text-sm text-gray-700 mb-4">Orders placed before 4pm will be packed and dispatched on the same day. If you order after 4pm, don&apos;t worry! Your order will be fulfilled and sent out on the following day.</p>

                                                    <div className="space-y-4">
                                                        {/* UK Shipping */}
                                                        <div>
                                                            <h5 className="font-medium text-black mb-2">UNITED KINGDOM</h5>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>Evri Standard (3 to 4 days)</span>
                                                                    <span className="font-medium text-green-600">Free</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Royal Mail Express/Evri (next day)</span>
                                                                    <span>£3.99</span>
                                                                </div>
                                                                <p className="text-xs text-gray-600 italic">Free on orders over £100</p>
                                                            </div>
                                                        </div>

                                                        {/* USA Shipping */}
                                                        <div>
                                                            <h5 className="font-medium text-black mb-2">USA</h5>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>Royal Mail Standard/Evri (4-5 Business Days)</span>
                                                                    <span>£10.00</span>
                                                                </div>
                                                                <p className="text-xs text-gray-600 italic">Free on orders over £214 GBP</p>
                                                                <div className="flex justify-between">
                                                                    <span>Royal Mail Express/Evri (1-3 Business Days)</span>
                                                                    <span>£12</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
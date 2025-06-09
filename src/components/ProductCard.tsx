import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useSidebar } from "@/context/SidebarContext";

interface ProductVariant {
    id: string;
    title: string;
    availableForSale: boolean;
    price?: {
        amount: string;
        currencyCode: string;
    };
    image?: {
        url: string;
        altText: string | null;
    };
    selectedOptions: Array<{
        name: string;
        value: string;
    }>;
}

interface ProductOption {
    id: string;
    name: string;
    values: string[];
}

interface DummyProduct {
    id: string;
    imageUrlFront: string;
    imageUrlBack: string;
    name: string;
    price: number;
    currencyCode?: string;
    color?: string;
    variantCount?: number;
    href: string;
    variants?: ProductVariant[];
    options?: ProductOption[];
    availableForSale?: boolean;
    description?: string;
    metafields?: Array<{
        key: string;
        value: string;
        namespace: string;
    }>;
}

interface ProductCardProps {
    product: DummyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart, openCart } = useCart();
    const { isSidebarOpen } = useSidebar();
    const [showVariantSelector, setShowVariantSelector] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    // Pre-select default options if available
    useEffect(() => {
        if (product.options && product.variants) {
            const defaultOptions: Record<string, string> = {};
            product.options.forEach(option => {
                // Find the first available value for this option
                const availableValue = option.values.find(value =>
                    product.variants?.some(variant =>
                        variant.availableForSale &&
                        variant.selectedOptions.some(opt =>
                            opt.name === option.name && opt.value === value
                        )
                    )
                );
                if (availableValue) {
                    defaultOptions[option.name] = availableValue;
                }
            });
            setSelectedOptions(defaultOptions);
        }
    }, [product.options, product.variants]);

    // Update selected variant when options change
    useEffect(() => {
        if (product.variants && Object.keys(selectedOptions).length > 0) {
            const variant = product.variants.find(v =>
                v.selectedOptions.every(opt => selectedOptions[opt.name] === opt.value)
            );
            setSelectedVariant(variant || null);
        }
    }, [selectedOptions, product.variants]);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // If product has variants and selector isn't shown, show it
        if (product.variants && product.variants.length > 0 && !showVariantSelector) {
            setShowVariantSelector(true);
            return;
        }

        // If we have a selected variant or no variants required
        if (selectedVariant || (!product.variants || product.variants.length === 0)) {
            const itemToAdd = {
                id: product.id,
                name: product.name,
                price: selectedVariant?.price ? parseFloat(selectedVariant.price.amount) : product.price,
                imageUrl: selectedVariant?.image?.url || product.imageUrlFront,
                href: product.href,
                ...(selectedVariant && {
                    variantId: selectedVariant.id,
                    selectedOptions: selectedVariant.selectedOptions
                })
            };

            addToCart(itemToAdd);
            setShowVariantSelector(false);
            openCart();
        }
    };

    const handleOptionSelect = (optionName: string, value: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionName]: value
        }));
    };

    const displayPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: product.currencyCode || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(selectedVariant?.price ? parseFloat(selectedVariant.price.amount) : product.price);

    return (
        <div className="group relative">
            {/* Product Image Container */}
            <div className="relative overflow-hidden" style={{ pointerEvents: 'none' }}>
                <Link href={product.href} className="block aspect-[3/4] bg-gray-100" style={{ pointerEvents: 'auto' }}>
                    <Image
                        src={product.imageUrlFront}
                        alt={product.name}
                        width={600}
                        height={800}
                        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                    />
                    <Image
                        src={product.imageUrlBack}
                        alt=""
                        aria-hidden="true"
                        width={600}
                        height={800}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
                    />
                </Link>

                {/* Add to Cart Button */}
                {!isSidebarOpen && !showVariantSelector && (
                    <button
                        onClick={handleAddToCart}
                        className="absolute right-2 top-2 z-50 flex items-center justify-center rounded-full bg-white p-2 text-black shadow-md transition-colors duration-200 hover:bg-gray-100"
                        aria-label="Add to bag"
                        style={{ pointerEvents: 'auto' }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-4 w-4"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                )}

                {/* Variant Selector Overlay */}
                {showVariantSelector && product.options && (
                    <div className="absolute inset-0 bg-white bg-opacity-95 p-4 flex flex-col justify-center z-40" style={{ pointerEvents: 'auto' }}>
                        <div className="space-y-4">
                            {product.options.map((option) => (
                                <div key={option.id} className="space-y-2">
                                    <label className="text-sm font-medium">{option.name}</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {option.values.map((value) => {
                                            const isAvailable = product.variants?.some(variant =>
                                                variant.availableForSale &&
                                                variant.selectedOptions.some(opt =>
                                                    opt.name === option.name && opt.value === value
                                                )
                                            );

                                            return (
                                                <button
                                                    key={value}
                                                    onClick={() => handleOptionSelect(option.name, value)}
                                                    className={`
                                                        border py-1 px-2 text-xs
                                                        ${selectedOptions[option.name] === value ? 'border-black bg-black text-white' : 'border-gray-200'}
                                                        ${isAvailable ? 'hover:border-black' : 'opacity-50 cursor-not-allowed'}
                                                    `}
                                                    disabled={!isAvailable}
                                                >
                                                    {value}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => setShowVariantSelector(false)}
                                className="text-xs text-gray-500 hover:text-black"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className={`
                                    text-xs px-4 py-2
                                    ${selectedVariant ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                                `}
                                disabled={!selectedVariant}
                            >
                                {selectedVariant ? 'Add to Cart' : 'Select Options'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="mt-3 mb-6 flex items-start justify-between text-sm">
                <div>
                    <h3 className="font-medium text-represent-text">
                        <Link href={product.href}>{product.name}</Link>
                    </h3>
                    <p className="mt-1 text-represent-muted">
                        {product.color}
                        {product.variantCount && product.color ? ` · ` : ''}
                        {product.variantCount ? `${product.variantCount} Colours` : ''}
                    </p>
                </div>
                <p className="font-bold text-represent-text text-right">{displayPrice}</p>
            </div>
        </div>
    );
} 
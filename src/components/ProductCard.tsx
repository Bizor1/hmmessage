import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useSidebar } from "@/context/SidebarContext";

// Define a simple type for dummy data
interface DummyProduct {
    id: string; // This should be the Shopify variant ID
    imageUrlFront: string;
    imageUrlBack: string;
    name: string;
    price: number;
    currencyCode?: string;
    color?: string;
    variantCount?: number;
    href: string;
    variantId?: string; // Optional variant ID if different from main ID
}

interface ProductCardProps {
    product: DummyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart, openCart } = useCart();
    const { isSidebarOpen } = useSidebar();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Adding product to cart:', product);
        addToCart({
            id: product.variantId || product.id, // Use variant ID if available
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrlFront,
            href: product.href,
        });
        console.log('Opening cart');
        openCart();
    };

    const displayPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: product.currencyCode || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(product.price);

    return (
        <div className="group relative">
            {/* Product Image Container */}
            <div className="relative overflow-hidden" style={{ pointerEvents: 'none' }}>
                <Link href={product.href} className="block aspect-square bg-represent-gray" style={{ pointerEvents: 'auto' }}>
                    {/* Front Image */}
                    <Image
                        src={product.imageUrlFront}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                    />
                    {/* Back Image */}
                    <Image
                        src={product.imageUrlBack}
                        alt=""
                        aria-hidden="true"
                        width={500}
                        height={500}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
                    />
                </Link>

                {/* Add to Cart Button - Only show when sidebar is not open */}
                {!isSidebarOpen && (
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
            </div>

            {/* Product Info */}
            <div className="mt-2 flex items-start justify-between text-xs">
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
                <p className="font-medium text-represent-text text-right">{displayPrice}</p>
            </div>
        </div>
    );
} 
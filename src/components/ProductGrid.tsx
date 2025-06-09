import ProductCard from './ProductCard';

interface Product {
    id: string;
    name: string;
    href: string;
    price: number;
    currencyCode: string;
    imageUrlFront: string;
    imageUrlBack: string;
}

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-1 gap-y-1">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
} 
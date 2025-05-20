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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
} 
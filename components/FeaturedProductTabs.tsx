import React, { useState, useMemo } from 'react';
import { Product, Order, CartItem } from '../types';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductSlider from './ProductSlider';

interface FeaturedProductTabsProps {
    title: string;
    products: Product[];
    orders: Order[];
}

type TabType = 'ON SALE' | 'NEW PRODUCTS' | 'BEST SELLING';

const FeaturedProductTabs: React.FC<FeaturedProductTabsProps> = ({ title, products, orders }) => {
    const [activeTab, setActiveTab] = useState<TabType>('ON SALE');

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (activeTab === 'ON SALE') {
            // Filter for products where originalPrice > price
            result = result.filter(p => p.originalPrice && p.originalPrice > p.price);
        } else if (activeTab === 'NEW PRODUCTS') {
            // Sort by date descending
            result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        } else if (activeTab === 'BEST SELLING') {
            // Calculate sales frequency from orders
            const salesCount: { [key: string]: number } = {};
            orders.forEach(order => {
                order.items.forEach((item: CartItem) => {
                    // Handle variant IDs or base IDs
                    // Usually we track by product ID for general popularity
                    salesCount[item.id] = (salesCount[item.id] || 0) + item.quantity;
                });
            });

            result = result.filter(p => (salesCount[p.id] || 0) > 0);
            result.sort((a, b) => (salesCount[b.id] || 0) - (salesCount[a.id] || 0));
        }

        return result.slice(0, 8); // Showing 8 max (2 rows of 4 hypothetically, but slider handles overflow)
    }, [products, orders, activeTab]);

    return (
        <section className="w-full py-12 bg-white">
            <div className="w-full px-2 md:px-4">
                <div className="flex flex-col items-center justify-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 mb-6">{title}</h2>

                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                        {(['ON SALE', 'NEW PRODUCTS', 'BEST SELLING'] as TabType[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 text-xs md:text-sm font-bold uppercase tracking-widest border transition-all duration-300 ${activeTab === tab
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reuse ProductSlider inner logic or just render the slider without title */}
                {/* Since ProductSlider has its own title logic, we can pass an empty title or refactor ProductSlider. 
                    Let's use ProductSlider but pass empty title/subtitle to hide header part if possible, 
                    OR better: Just render the scroll container here to have full control.
                    Actually, we can use ProductSlider and just hide the header if title is empty? 
                    ProductSlider always renders header space. 
                    Let's copy the slider logic here for cleaner integration with the Tabs above.
                */}
                <ProductSliderInternal products={filteredProducts} />
            </div>
        </section>
    );
};

// Internal Slider Component (Simplified version of ProductSlider for reuse)
const ProductSliderInternal: React.FC<{ products: Product[] }> = ({ products }) => {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 350;
            const newScrollLeft = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    if (products.length === 0) return <div className="text-center py-10 text-gray-400">No products found.</div>;

    return (
        <div className="relative group">
            {/* Navigation Arrows - Absolute positioned to be centered vertically on the slider */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-100 shadow-md rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black hover:text-white"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-100 shadow-md rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black hover:text-white"
            >
                <ChevronRight size={20} />
            </button>

            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map(product => (
                    <div key={product.id} className="w-[calc(50%-8px)] md:w-[calc(25%-12px)] flex-none snap-start">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FeaturedProductTabs;

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

interface ProductSliderProps {
    title: string;
    subtitle?: string;
    products: Product[];
    viewAllLink?: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, subtitle, products, viewAllLink }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 350; // Approx card width + gap
            const newScrollLeft = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    if (products.length === 0) return null;

    return (
        <section className="w-full py-8 bg-white">
            <div className="w-full px-2 md:px-4">
                <div className="flex flex-col items-center justify-center mb-8 relative">
                    <div className="text-center space-y-2 mb-2">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900">{title}</h2>
                        {subtitle && <p className="text-slate-500 font-medium">{subtitle}</p>}
                    </div>

                    <div className="flex items-center gap-4 absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex">
                        {viewAllLink && (
                            <Link to={viewAllLink} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mr-4">
                                View All <ArrowRight size={14} />
                            </Link>
                        )}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => scroll('left')}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

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

                {viewAllLink && (
                    <div className="mt-4 md:hidden flex justify-center">
                        <Link to={viewAllLink} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-emerald-600 transition-colors">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductSlider;


import React, { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react';
import { ChevronDown, Check, SlidersHorizontal, Clock, ArrowUp, ArrowDown, Type } from 'lucide-react';
import ProductCard from './ProductCard';
import RecentlyViewed from './RecentlyViewed';
import { Product } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CategoryViewProps {
  title: string;
  description: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  recentlyViewed?: Product[];
  wishlistIds?: string[];
  onToggleWishlist?: (product: Product) => void;
  inventory?: Record<string, number>;
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'brand-asc';

const SORT_OPTIONS: { value: SortOption; label: string; icon: any }[] = [
  { value: 'newest', label: 'Newest Arrivals', icon: Clock },
  { value: 'price-asc', label: 'Price: Low to High', icon: ArrowUp },
  { value: 'price-desc', label: 'Price: High to Low', icon: ArrowDown },
  { value: 'brand-asc', label: 'Brand: A - Z', icon: Type },
];

const CategoryView: React.FC<CategoryViewProps> = ({ title, description, products, onAddToCart, onProductClick, recentlyViewed, wishlistIds, onToggleWishlist, inventory }) => {
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const CheckIcon = Check as any;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    switch (sortOption) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'brand-asc':
        return sorted.sort((a, b) => a.brand.localeCompare(b.brand));
      case 'newest':
      default:
        return sorted;
    }
  }, [products, sortOption]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".cat-header",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      if (sortedProducts.length > 0) {
          gsap.fromTo(".category-product-card",
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".product-grid",
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [sortedProducts]);

  const currentOption = SORT_OPTIONS.find(opt => opt.value === sortOption) || SORT_OPTIONS[0];

  return (
    <div ref={containerRef} className="pt-32 pb-20 container mx-auto px-6 md:px-12 min-h-screen">
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 cat-header opacity-0">
        <div>
            <h1 className="text-6xl md:text-8xl font-display font-bold text-gray-900 uppercase mb-4 leading-none">
            {title}
            </h1>
            <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
            {description}
            </p>
            <div className="w-24 h-1 bg-accent mt-8"></div>
        </div>

        <div className="relative z-30" ref={sortRef}>
            <div className="flex items-center gap-2 mb-2">
                <SlidersHorizontal size={14} className="text-gray-400" />
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort Collection</label>
            </div>
            
            <div className="relative">
                <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className={`
                        w-full md:min-w-[260px] flex items-center justify-between 
                        bg-white border px-6 py-4 rounded-2xl shadow-sm transition-all duration-300
                        ${isSortOpen ? 'border-black ring-1 ring-black shadow-lg' : 'border-gray-200 hover:border-gray-300'}
                    `}
                >
                    <div className="flex items-center gap-3">
                        <currentOption.icon size={18} className="text-gray-500" />
                        <span className="font-bold text-sm text-gray-900">{currentOption.label}</span>
                    </div>
                    <ChevronDown 
                        size={16} 
                        className={`text-gray-500 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} 
                    />
                </button>

                <div className={`
                    absolute top-full right-0 mt-2 w-full md:w-[280px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden origin-top-right transition-all duration-200 ease-out z-50
                    ${isSortOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'}
                `}>
                    <div className="p-2 space-y-1">
                        {SORT_OPTIONS.map((option) => {
                            const Icon = option.icon;
                            const isSelected = sortOption === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSortOption(option.value);
                                        setIsSortOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors group
                                        ${isSelected ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={16} className={`${isSelected ? 'text-accent' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                        <span>{option.label}</span>
                                    </div>
                                    {isSelected && <CheckIcon size={16} className="text-accent" />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 product-grid">
            {sortedProducts.map((product) => (
                <div key={product.id} className="category-product-card opacity-0">
                    <ProductCard 
                        product={product} 
                        onAddToCart={onAddToCart}
                        onClick={() => onProductClick(product)}
                        isWishlisted={wishlistIds?.includes(product.id)}
                        onToggleWishlist={onToggleWishlist}
                        stock={inventory ? inventory[product.id] : undefined}
                    />
                </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-2xl font-display uppercase">No products found</p>
            <p>Check back soon for new drops.</p>
        </div>
      )}
      
      {recentlyViewed && recentlyViewed.length > 0 && (
        <RecentlyViewed 
            products={recentlyViewed} 
            onProductClick={onProductClick} 
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
        />
      )}
    </div>
  );
};

export default CategoryView;

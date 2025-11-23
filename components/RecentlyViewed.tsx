
import React, { useRef, useLayoutEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RecentlyViewedProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (product: Product) => void;
  inventory?: Record<string, number>;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ products, onProductClick, wishlistIds, onToggleWishlist, inventory }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (products.length === 0) return;
    
    const ctx = gsap.context(() => {
        gsap.fromTo(".recent-title", 
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.5, scrollTrigger: { trigger: containerRef.current, start: "top 85%" } }
        );

        gsap.fromTo(".recent-card",
            { opacity: 0, y: 20 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.5, 
                stagger: 0.1, 
                scrollTrigger: { trigger: containerRef.current, start: "top 85%" } 
            }
        );
    }, containerRef);
    return () => ctx.revert();
  }, [products]);

  if (products.length === 0) return null;

  return (
    <section ref={containerRef} className="py-16 border-t border-gray-200 mt-12">
      <h3 className="text-2xl md:text-3xl font-display font-bold uppercase mb-8 text-gray-900 recent-title">
        Recently Viewed
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="recent-card opacity-0">
            <ProductCard
                product={product}
                onAddToCart={() => onProductClick(product)}
                onClick={() => onProductClick(product)}
                isWishlisted={wishlistIds?.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                stock={inventory ? inventory[product.id] : undefined}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;

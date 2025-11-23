
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import gsap from 'gsap';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductClick: (product: Product) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (product: Product) => void;
  inventory?: Record<string, number>;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, products, onProductClick, inventory }) => {
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      p.color.toLowerCase().includes(lowerQuery)
    );
  }, [query, products]);

  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        
        const ctx = gsap.context(() => {
            gsap.set(containerRef.current, { display: 'flex' });
            
            gsap.to(containerRef.current, { 
                y: '0%', 
                duration: 0.5, 
                ease: 'power3.out'
            });
            
            gsap.fromTo(".search-content",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, delay: 0.2, stagger: 0.1 }
            );
        }, containerRef);
        
        const timer = setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
        
        return () => {
            ctx.revert();
            clearTimeout(timer);
        };
    } else {
        document.body.style.overflow = '';

        const ctx = gsap.context(() => {
             gsap.to(containerRef.current, { 
                y: '-100%', 
                duration: 0.4, 
                ease: 'power3.in',
                onComplete: () => {
                     gsap.set(containerRef.current, { display: 'none' });
                     setQuery(''); 
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleCardClick = (product: Product) => {
    onClose();
    onProductClick(product);
  };

  return (
    <div 
        ref={containerRef}
        className="fixed inset-0 z-[80] bg-[#EBEBE9] flex flex-col overflow-hidden"
        style={{ transform: 'translateY(-100%)', display: 'none' }}
    >
      <div className="w-full max-w-7xl mx-auto px-6 py-6 md:py-8 flex justify-between items-center search-content border-b border-gray-200 md:border-none">
         <div className="flex items-center gap-2">
            <svg width="30" height="18" viewBox="0 0 50 30" fill="currentColor" className="text-black">
              <path d="M10,25 Q25,5 40,25" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
            <span className="font-display font-bold text-lg md:text-xl text-black">SEARCH</span>
         </div>
         <button 
            onClick={onClose}
            className="p-3 bg-white rounded-full hover:bg-black hover:text-white transition-colors shadow-sm text-black"
         >
            <X size={24} />
         </button>
      </div>

      <div className="w-full max-w-4xl mx-auto px-6 mt-8 md:mt-16 search-content">
         <div className="relative border-b-2 border-black/10 focus-within:border-black transition-colors pb-4">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-3xl md:text-6xl font-display font-bold text-gray-900 placeholder-gray-300 focus:outline-none pl-10 md:pl-16"
                autoComplete="off"
            />
         </div>
      </div>

      <div 
        ref={resultsRef}
        className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-6 mt-8 md:mt-12 pb-20 search-content no-scrollbar"
      >
         {!query && (
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Popular Searches</div>
         )}
         
         {!query && (
             <div className="flex flex-wrap gap-3 mb-12">
                {['Nike Air Max', 'Yeezy', 'Jordan 4', 'New Balance'].map(term => (
                    <button 
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-5 py-3 bg-white rounded-full text-sm font-bold text-gray-600 hover:bg-black hover:text-white transition-all shadow-sm border border-transparent hover:border-gray-800"
                    >
                        {term}
                    </button>
                ))}
             </div>
         )}

         {query && (
             <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
                 {filteredProducts.length} Result{filteredProducts.length !== 1 ? 's' : ''}
             </div>
         )}

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => {
                const stock = inventory ? (inventory[product.id] !== undefined ? inventory[product.id] : 99) : 99;
                const isOut = stock === 0;

                return (
                    <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div 
                            className="group bg-white p-4 rounded-2xl cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 border border-transparent hover:border-gray-100 relative"
                            onClick={() => handleCardClick(product)}
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-xl flex items-center justify-center p-2 relative">
                                <img src={product.image} alt={product.name} className={`w-full h-full object-contain mix-blend-multiply ${isOut ? 'grayscale opacity-60' : ''}`} />
                                {isOut && (
                                    <span className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-xl">
                                        <span className="bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Sold</span>
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">{product.brand}</p>
                                <h4 className="font-bold text-sm text-gray-900 leading-tight">{product.name}</h4>
                                <p className="text-xs font-bold text-gray-900 mt-1">KD {product.price}</p>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-accent bg-black rounded-full p-1 hidden sm:block">
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </div>
                );
            })}
         </div>
         
         {query && filteredProducts.length === 0 && (
             <div className="text-center py-10 md:py-20">
                 <p className="text-gray-400 text-xl font-display uppercase">Nothing found</p>
                 <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms.</p>
             </div>
         )}
      </div>
    </div>
  );
};

export default SearchOverlay;

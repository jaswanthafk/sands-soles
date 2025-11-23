
import React, { useEffect, useRef, useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import gsap from 'gsap';

interface HeroProps {
  products: Product[];
  onOpenModal: (product: Product) => void;
  onProductClick: (product: Product) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (product: Product) => void;
  inventory?: Record<string, number>;
}

const Hero: React.FC<HeroProps> = ({ products, onOpenModal, onProductClick, wishlistIds, onToggleWishlist, inventory }) => {
  const [activeProduct, setActiveProduct] = useState<Product>(products[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const shoeRef = useRef<HTMLImageElement>(null);
  const bgTextRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Stock Logic
  const stock = inventory ? (inventory[activeProduct.id] !== undefined ? inventory[activeProduct.id] : 99) : 99;
  const isOutOfStock = stock === 0;

  const getBgText = (brand: string) => {
    if (brand.toLowerCase() === 'new balance') return 'NB';
    if (brand.toLowerCase() === 'adidas') return 'ADIDAS';
    return brand;
  };

  const getSlogan = (brand: string) => {
    const b = brand.toLowerCase();
    if (b === 'nike') return ['JUST', 'DO', 'IT.'];
    if (b === 'adidas') return ['IMPOSSIBLE', 'IS', 'NOTHING.'];
    if (b === 'new balance') return ['WE', 'GOT', 'NOW.'];
    if (b === 'jordan') return ['TAKE', 'FLIGHT', 'HIGHER.'];
    return ['WALK', 'WITH', 'SOUL.'];
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(shoeRef.current, {
        y: -20,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleProductChange = (product: Product) => {
    if (product.id === activeProduct.id || isAnimating) return;
    setIsAnimating(true);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setActiveProduct(product);
          setIsAnimating(false);
          gsap.fromTo(shoeRef.current, 
            { x: 100, opacity: 0, rotation: 5 },
            { x: 0, opacity: 1, rotation: -15, duration: 0.8, ease: "power3.out" }
          );
          gsap.fromTo(bgTextRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
          );
          gsap.fromTo([descRef.current, infoRef.current],
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }
          );
        }
      });

      tl.to(shoeRef.current, { x: -100, opacity: 0, rotation: -25, duration: 0.4, ease: "power2.in" })
        .to(bgTextRef.current, { y: -50, opacity: 0, duration: 0.4 }, "<")
        .to([descRef.current, infoRef.current], { opacity: 0, duration: 0.2 }, "<");

    }, containerRef);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollAmount = 280; 
        const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
        container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    }
  };

  const sloganParts = getSlogan(activeProduct.brand);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen md:h-screen flex flex-col overflow-hidden bg-[#EBEBE9] pt-24 md:pt-0 transition-colors duration-300">
      
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0 overflow-hidden">
         <h1 
            ref={bgTextRef}
            className="text-[22vw] md:text-[22vw] font-display font-bold leading-none text-white tracking-tighter whitespace-nowrap mt-[-20vh] md:mt-0"
         >
           {getBgText(activeProduct.brand)}
         </h1>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex-1 flex flex-col justify-between pb-32 md:pb-8">
        
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center w-full h-full">
            
            <div className="w-full md:w-1/4 order-2 md:order-1 mt-2 md:mt-0 text-center md:text-left relative z-20">
                <div ref={descRef}>
                    <h2 className="text-5xl md:text-5xl font-display font-bold text-gray-800 leading-[0.9] mb-4 md:mb-6 uppercase">
                        {sloganParts[0]} <br className="hidden md:block"/> 
                        <span className="text-outline text-white" style={{ WebkitTextStroke: '1px rgba(128,128,128,0.5)' }}>
                            {sloganParts[1]}
                        </span> <br className="hidden md:block"/> 
                        {sloganParts[2]}
                    </h2>
                    <div className="w-12 h-1 bg-accent mb-4 md:mb-6 mx-auto md:mx-0"></div>
                    <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed max-w-[280px] mx-auto md:mx-0">
                        The {activeProduct.name} features premium materials and Kuwait-ready durability. 
                        <span className="block mt-2 text-gray-400 hidden md:block">{activeProduct.description.substring(0, 60)}...</span>
                    </p>
                </div>
            </div>

            <div 
                className={`w-full md:flex-1 flex items-center justify-center relative order-1 md:order-2 min-h-[280px] md:min-h-auto background-transparent -mt-4 md:mt-0 ${!isOutOfStock ? 'cursor-pointer' : ''}`} 
                onClick={() => !isOutOfStock && onProductClick(activeProduct)}
            >
                {/* Glow effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[600px] h-[250px] md:h-[600px] bg-white rounded-full filter blur-[60px] md:blur-[100px] opacity-40 z-0"></div>
                
                {isOutOfStock && (
                    <div className="absolute z-30 flex items-center justify-center">
                         <span className="text-2xl md:text-4xl font-display font-bold text-black uppercase bg-white/90 backdrop-blur px-6 py-2 rounded-xl shadow-2xl transform -rotate-12 border-2 border-black">SOLD OUT</span>
                    </div>
                )}

                <img
                    ref={shoeRef}
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    className={`w-[90%] md:w-[120%] max-w-[350px] md:max-w-[650px] object-contain drop-shadow-2xl z-20 relative md:left-[-20px] blend-image transform -rotate-12 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                    style={{ filter: 'drop-shadow(0px 20px 20px rgba(0,0,0,0.25))', mixBlendMode: 'multiply' }}
                />
            </div>

            <div className="w-full md:w-1/4 flex flex-col items-center md:items-end justify-center text-center md:text-right order-3 mt-2 md:mt-0">
                 <div ref={infoRef}>
                     <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-2">SANDS & SOULS EXCLUSIVE</h3>
                     <h2 
                        className={`text-2xl md:text-4xl font-display font-bold text-gray-800 mb-2 md:mb-4 leading-none transition-colors ${!isOutOfStock ? 'cursor-pointer hover:text-gray-600' : ''}`}
                        onClick={() => !isOutOfStock && onProductClick(activeProduct)}
                    >
                        {activeProduct.name}
                    </h2>
                     <p className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-8">KWD {activeProduct.price.toFixed(3)}</p>
                     
                     <button 
                        onClick={() => !isOutOfStock && onProductClick(activeProduct)}
                        disabled={isOutOfStock}
                        className={`group relative px-8 py-3 md:py-4 font-bold rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all
                            ${isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white'}
                        `}
                     >
                        {!isOutOfStock && <div className="absolute inset-0 w-full h-full bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>}
                        <span className={`relative z-10 transition-colors text-sm md:text-base uppercase tracking-widest ${!isOutOfStock && 'group-hover:text-black'}`}>
                            {isOutOfStock ? 'Sold Out' : 'Buy Now'}
                        </span>
                     </button>
                 </div>
            </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-30 pb-6 md:pb-8 overflow-hidden pointer-events-none">
             <div className="pointer-events-auto relative w-full h-full group/carousel px-0 md:px-16">
                 
                <button 
                    onClick={() => scroll('left')}
                    className="hidden md:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 bg-white/90 p-3 rounded-full shadow-lg hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 items-center justify-center text-gray-800 focus:outline-none"
                >
                    <ChevronLeft size={24} />
                </button>

                <button 
                    onClick={() => scroll('right')}
                    className="hidden md:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 bg-white/90 p-3 rounded-full shadow-lg hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 items-center justify-center text-gray-800 focus:outline-none"
                >
                    <ChevronRight size={24} />
                </button>

                 <div 
                     ref={scrollContainerRef}
                     className="w-full overflow-x-auto no-scrollbar py-2 md:py-6 snap-x snap-mandatory touch-pan-x scroll-smooth pl-4 md:pl-0"
                 >
                     <div className="flex space-x-3 md:space-x-6 w-max px-2">
                        {products.map((product) => {
                            const prodStock = inventory ? (inventory[product.id] !== undefined ? inventory[product.id] : 99) : 99;
                            const isProdOut = prodStock === 0;

                            return (
                                <div 
                                    key={product.id}
                                    onClick={() => handleProductChange(product)}
                                    className={`
                                        group relative w-[160px] md:w-[260px] h-[80px] md:h-[110px] rounded-2xl cursor-pointer transition-all duration-300 ease-out flex items-center px-2 md:px-4 border snap-center
                                        ${activeProduct.id === product.id 
                                            ? 'bg-white border-gray-200 shadow-xl scale-105' 
                                            : 'bg-white/40 border-white/20 active:bg-white/60'}
                                    `}
                                >
                                    <div className="w-14 h-14 md:w-24 md:h-24 flex-shrink-0 -ml-3 md:-ml-6 filter drop-shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12 relative">
                                        {isProdOut && (
                                            <div className="absolute inset-0 z-10 flex items-center justify-center">
                                                <span className="bg-black/80 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Sold</span>
                                            </div>
                                        )}
                                        <img 
                                          src={product.image} 
                                          alt={product.name} 
                                          className={`w-full h-full object-contain blend-image ${isProdOut ? 'grayscale opacity-50' : ''}`} 
                                          style={{ mixBlendMode: 'multiply' }}
                                        />
                                    </div>
                                    <div className="ml-2 md:ml-4 flex-1 truncate pr-1">
                                        <h4 className="font-bold text-[8px] md:text-[10px] text-gray-500 uppercase tracking-wider">{product.brand}</h4>
                                        <h3 className="font-bold text-[10px] md:text-sm text-gray-900 leading-tight truncate">{product.name}</h3>
                                        <p className="text-[9px] md:text-xs font-bold text-gray-500 mt-1">KD {product.price}</p>
                                    </div>
                                    
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isProdOut) onOpenModal(product);
                                        }}
                                        disabled={isProdOut}
                                        className={`
                                        w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0
                                        ${activeProduct.id === product.id ? 'bg-black text-accent' : 'bg-gray-200/50 text-gray-400'}
                                        ${isProdOut ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                                    `}>
                                        <Plus size={10} className="md:w-3 md:h-3" />
                                    </button>
                                </div>
                            );
                        })}
                     </div>
                 </div>
             </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;

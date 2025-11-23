
import React, { useState, useRef, useLayoutEffect } from 'react';
import { Send, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { Product, StylistResponse } from '../types';
import { getStylistRecommendations } from '../services/geminiService';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StylistProps {
  products: Product[];
  onRecommendations: (ids: string[]) => void;
  onProductClick: (product: Product) => void;
}

const Stylist: React.FC<StylistProps> = ({ products, onRecommendations, onProductClick }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { scale: 0.9, opacity: 0, y: 30 },
        {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.2)",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
            }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setMessage(null);
    setResults([]);

    try {
      const response: StylistResponse = await getStylistRecommendations(query, products);
      setMessage(response.message);
      
      if (response.recommendedIds.length > 0) {
        const recommended = products.filter(p => response.recommendedIds.includes(p.id));
        setResults(recommended);
        onRecommendations(response.recommendedIds);
      }
    } catch (error) {
      setMessage("Sorry, I couldn't connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden transition-colors">
      <div className="absolute top-0 right-0 w-40 h-40 bg-accent opacity-10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
            <div className="p-2 bg-black text-accent rounded-lg mr-3">
                <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900 uppercase">Soul Stylist AI</h3>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">
          Describe your vibe, occasion, or outfit, and our Gemini-powered stylist will pick the perfect kicks from our Kuwait collection.
        </p>

        <form onSubmit={handleSubmit} className="relative mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'I need comfy shoes for walking at The Avenues...'"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 h-10 w-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>

        {message && (
          <div className="mb-6 p-4 bg-sand-50 rounded-xl border border-sand-200 animate-in fade-in slide-in-from-top-2">
            <p className="text-sm font-medium text-gray-800 italic">" {message} "</p>
          </div>
        )}

        {results.length > 0 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Recommended for you</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.map(product => (
                        <div 
                            key={product.id} 
                            onClick={() => onProductClick(product)}
                            className="group bg-gray-50 p-3 rounded-2xl border border-gray-100 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all flex items-center gap-4"
                        >
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 p-1">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300" 
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-gray-400 uppercase truncate">{product.brand}</p>
                                <h4 className="font-bold text-sm text-gray-900 leading-tight truncate">{product.name}</h4>
                                <p className="text-xs font-bold text-gray-900 mt-1">KWD {product.price}</p>
                            </div>
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-300 group-hover:bg-black group-hover:text-accent transition-colors">
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Stylist;
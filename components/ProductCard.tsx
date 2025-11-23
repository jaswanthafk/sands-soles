
import React from 'react';
import { Product } from '../types';
import { ShoppingBag, Heart, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isHighlighted?: boolean;
  onAddToCart?: (product: Product) => void;
  onClick?: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
  stock?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isHighlighted, onAddToCart, onClick, isWishlisted, onToggleWishlist, stock }) => {
  const isOutOfStock = stock === 0;
  const isLowStock = stock !== undefined && stock > 0 && stock < 5;

  return (
    <div 
        className={`
            group relative bg-white rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden
            ${isHighlighted ? 'ring-2 ring-accent shadow-2xl shadow-accent/20 scale-105 z-10' : 'hover:shadow-xl shadow-sm border border-gray-100'}
        `}
        onClick={onClick}
    >
      <div className="relative z-10">
          <div className="absolute top-4 left-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{product.brand}</span>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{product.name}</h3>
            {isLowStock && !isOutOfStock && (
                <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1 animate-pulse">
                     <Flame size={10} fill="currentColor" /> Only {stock} left!
                </p>
            )}
          </div>
          
          {/* Action Buttons Top Right */}
          <div className="absolute top-4 right-6 flex items-center gap-2">
              {onToggleWishlist && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                    }}
                    className={`
                        w-8 h-8 rounded-full flex items-center justify-center transition-colors
                        ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400 hover:text-gray-600'}
                    `}
                >
                    <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              )}
              
              <div className="bg-sand-100 px-2 py-1 rounded-md">
                <span className="text-xs font-bold text-gray-600">KWD {product.price}</span>
              </div>
          </div>

          <div className="mt-12 mb-6 flex justify-center items-center h-40 relative">
            {isOutOfStock && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-3xl transition-opacity duration-300">
                    <span className="text-2xl font-display font-bold text-black uppercase bg-white px-6 py-3 rounded-xl shadow-2xl transform -rotate-12 tracking-widest">Sold Out</span>
                </div>
            )}
            <img 
                src={product.image} 
                alt={product.name} 
                className={`
                    w-full h-full object-contain transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg blend-image mix-blend-multiply relative z-10
                    ${isOutOfStock ? 'grayscale opacity-50' : ''}
                `}
            />
          </div>

          <div className="flex justify-between items-end">
            <div>
                 <p className="text-xs text-gray-500 mb-1">{product.tags[0]}</p>
                 <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-200"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300 border border-gray-200"></div>
                 </div>
            </div>
            
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isOutOfStock && onAddToCart) onAddToCart(product);
                }}
                disabled={isOutOfStock}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative z-10
                    ${isOutOfStock 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-black text-white hover:bg-accent hover:text-black'
                    }
                `}
            >
                <ShoppingBag size={18} />
            </button>
          </div>
      </div>
    </div>
  );
};

export default ProductCard;

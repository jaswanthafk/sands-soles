import React, { useState } from 'react';
import { X, Check, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product, size: string) => void;
}

const SIZES = ['US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 11', 'US 12'];

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (selectedSize) {
        onAddToCart(product, selectedSize);
        setSelectedSize(''); // Reset
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/50 rounded-full hover:bg-white transition-colors"
        >
            <X size={20} />
        </button>

        {/* Left: Image */}
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-8 relative">
             <div className="absolute inset-0 bg-sand-200/30"></div>
             <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] font-display font-bold text-gray-200 select-none pointer-events-none whitespace-nowrap opacity-50">
                {product.brand}
             </h2>
             <img 
                src={product.image} 
                alt={product.name} 
                className="relative z-10 w-[90%] object-contain drop-shadow-2xl blend-image mix-blend-multiply transform -rotate-12 hover:rotate-0 transition-transform duration-500"
             />
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col h-full bg-white">
             <div className="mb-auto">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{product.brand}</span>
                    <span className="text-xl font-bold text-gray-900">KWD {product.price.toFixed(3)}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 leading-none mb-6">{product.name}</h2>
                
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    {product.description}
                </p>

                {/* Color Selection (Visual only for now) */}
                <div className="mb-8">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wide block mb-3">Select Color</span>
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-black p-0.5 cursor-pointer">
                             <div className="w-full h-full rounded-full bg-gray-200 relative overflow-hidden">
                                 <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-400"></div>
                             </div>
                        </div>
                        {/* Dummy secondary option */}
                        <div className="w-10 h-10 rounded-full border border-gray-200 p-0.5 cursor-pointer hover:border-gray-400">
                             <div className="w-full h-full rounded-full bg-black"></div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{product.color}</p>
                </div>

                {/* Size Selection */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                         <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Select Size</span>
                         <a href="#" className="text-xs text-gray-400 underline hover:text-black">Size Guide</a>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {SIZES.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`
                                    py-2 rounded-lg text-xs font-bold transition-all border
                                    ${selectedSize === size 
                                        ? 'bg-black text-white border-black' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-black'}
                                `}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
             </div>

             {/* Add to Cart Button */}
             <button
                disabled={!selectedSize}
                onClick={handleAddToCart}
                className="w-full py-4 bg-accent text-black font-bold rounded-xl hover:bg-lime-400 disabled:bg-gray-100 disabled:text-gray-400 transition-colors flex items-center justify-center gap-2"
             >
                <ShoppingBag size={20} />
                {selectedSize ? 'ADD TO CART' : 'SELECT A SIZE'}
             </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
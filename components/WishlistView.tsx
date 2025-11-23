
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { Heart, ShoppingBag } from 'lucide-react';

interface WishlistViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onExplore: () => void;
  inventory?: Record<string, number>;
}

const WishlistView: React.FC<WishlistViewProps> = ({ products, onProductClick, onAddToCart, onToggleWishlist, onExplore, inventory }) => {
  return (
    <div className="pt-32 pb-20 container mx-auto px-6 md:px-12 min-h-screen animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 uppercase mb-4 leading-none">
          My Wishlist
        </h1>
        <p className="text-gray-500 text-lg">
          {products.length} {products.length === 1 ? 'item' : 'items'} saved for later.
        </p>
        <div className="w-24 h-1 bg-accent mt-8"></div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products.map((product) => (
                <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4">
                    <ProductCard
                        product={product}
                        onAddToCart={() => onAddToCart(product)}
                        onClick={() => onProductClick(product)}
                        isWishlisted={true}
                        onToggleWishlist={onToggleWishlist}
                        stock={inventory ? inventory[product.id] : undefined}
                    />
                </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-300 rounded-3xl bg-white/50 mt-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6 animate-pulse">
                <Heart size={48} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-display font-bold uppercase text-gray-400 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Nothing here yet. Save your favorite drops to track availability and get notified about price drops.
            </p>
            <button 
                onClick={onExplore}
                className="px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-accent hover:text-black transition-colors flex items-center gap-2"
            >
                <ShoppingBag size={18} />
                EXPLORE COLLECTION
            </button>
        </div>
      )}
    </div>
  );
};

export default WishlistView;

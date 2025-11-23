
import React, { useState } from 'react';
import { Product, Review, User } from '../types';
import { ShoppingBag, ArrowLeft, Heart, Share2, Star, CheckCircle, Flame, AlertTriangle } from 'lucide-react';
import RecentlyViewed from './RecentlyViewed';

interface ProductViewProps {
  product: Product;
  onAddToCart: (product: Product, size: string) => void;
  onBack: () => void;
  recentlyViewed: Product[];
  onProductClick: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
  reviews: Review[];
  onAddReview: (productId: string, rating: number, comment: string) => void;
  user: User | null;
  inventory?: Record<string, number>;
}

const SIZES = ['US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 11', 'US 12'];
const COLORS = ['#111111', '#C1F055', '#EBEBE9', '#3B82F6']; 

const ProductView: React.FC<ProductViewProps> = ({ 
    product, 
    onAddToCart, 
    onBack, 
    recentlyViewed, 
    onProductClick, 
    isWishlisted, 
    onToggleWishlist, 
    reviews, 
    onAddReview, 
    user,
    inventory
}) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Filter reviews for this product
  const productReviews = reviews.filter(r => r.productId === product.id);
  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length 
    : 0;

  // Check if user purchased this product
  const hasPurchased = user?.orders?.some(order => 
      order.items.some(item => item.id === product.id)
  );
  
  // Check if already reviewed
  const hasReviewed = productReviews.some(r => r.userId === user?.id);

  // Stock Logic
  const stock = inventory ? (inventory[product.id] !== undefined ? inventory[product.id] : 99) : 99;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock < 5;

  const handleAddToCart = () => {
    if (!selectedSize || isOutOfStock) return;
    setIsAnimating(true);
    onAddToCart(product, selectedSize);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const submitReview = (e: React.FormEvent) => {
      e.preventDefault();
      if (comment.trim()) {
          onAddReview(product.id, rating, comment);
          setReviewSubmitted(true);
      }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-20 animate-in fade-in duration-500 transition-colors">
      <div className="container mx-auto px-6 md:px-12 py-6">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-wider"
        >
            <ArrowLeft size={16} /> Back to Collection
        </button>
      </div>

      <div className="container mx-auto px-6 md:px-12 pb-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative">
            
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gray-200 rounded-full filter blur-[100px] opacity-50 -z-10 pointer-events-none"></div>

            <div className="w-full lg:w-1/2 space-y-8 z-10 order-2 lg:order-1">
                <div className="flex items-center gap-4">
                     <img 
                        src="https://cdn.freebiesupply.com/logos/large/2x/nike-4-logo-png-transparent.png" 
                        alt={product.brand}
                        className={`h-8 object-contain opacity-60 ${product.brand === 'Nike' || product.brand === 'Jordan' ? 'block' : 'hidden'}`}
                     />
                     <span className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">{product.brand}</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 leading-[0.9] uppercase">
                    {product.name}
                </h1>

                <p className="text-gray-600 leading-relaxed max-w-md text-lg">
                    {product.description}
                </p>
                
                <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-gray-900">KWD {product.price.toFixed(3)}</span>
                    <div className="flex text-yellow-400 items-center gap-1">
                        <Star size={18} fill={averageRating >= 1 ? "currentColor" : "none"} />
                        <Star size={18} fill={averageRating >= 2 ? "currentColor" : "none"} />
                        <Star size={18} fill={averageRating >= 3 ? "currentColor" : "none"} />
                        <Star size={18} fill={averageRating >= 4 ? "currentColor" : "none"} />
                        <Star size={18} fill={averageRating >= 5 ? "currentColor" : "none"} />
                        <span className="text-gray-400 text-xs font-bold ml-2 tracking-widest">
                            ({productReviews.length} REVIEWS)
                        </span>
                    </div>
                </div>

                {/* Stock Warning */}
                {isLowStock && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg w-max">
                        <Flame size={18} fill="currentColor" />
                        <span className="text-sm font-bold">Selling Fast! Only {stock} pairs left.</span>
                    </div>
                )}
                {isOutOfStock && (
                    <div className="flex items-center gap-2 text-white bg-black px-4 py-2 rounded-lg w-max">
                        <AlertTriangle size={18} />
                        <span className="text-sm font-bold uppercase tracking-wider">Currently Out of Stock</span>
                    </div>
                )}

                <div className="space-y-6 pt-6 border-t border-gray-200">
                    <div>
                        <div className="flex justify-between mb-3">
                            <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Select Size</label>
                            <a href="#" className="text-xs text-gray-400 underline hover:text-black">Size Guide</a>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {SIZES.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    disabled={isOutOfStock}
                                    className={`
                                        h-10 px-4 rounded-lg text-xs font-bold border transition-all
                                        ${selectedSize === size 
                                            ? 'bg-black text-white border-black shadow-lg transform scale-105' 
                                            : isOutOfStock 
                                                ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed opacity-50'
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black'
                                        }
                                    `}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-900 uppercase tracking-widest block mb-3">Available Colors</label>
                        <div className="flex gap-3">
                            {COLORS.map((c, i) => (
                                <button 
                                    key={i}
                                    disabled={isOutOfStock}
                                    className={`w-8 h-8 rounded-full border-2 ${i === 0 ? 'border-black ring-2 ring-gray-200' : 'border-transparent'} hover:scale-110 transition-transform disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button 
                        onClick={handleAddToCart}
                        disabled={!selectedSize || isOutOfStock}
                        className={`
                            flex-1 py-5 font-bold text-sm tracking-widest uppercase rounded-full shadow-xl transition-all flex items-center justify-center gap-3
                            ${isOutOfStock 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                                : 'bg-[#D90429] text-white hover:bg-[#EF233C] hover:shadow-2xl hover:-translate-y-1'
                            }
                            ${isAnimating ? 'scale-95' : ''}
                        `}
                    >
                        {isOutOfStock ? (
                            <>SOLD OUT</>
                        ) : (
                            <>
                                <ShoppingBag size={20} />
                                {selectedSize ? 'Add to Bag' : 'Select Size'}
                            </>
                        )}
                    </button>
                    
                    <button 
                        onClick={() => onToggleWishlist && onToggleWishlist(product)}
                        className={`w-14 h-14 flex items-center justify-center rounded-full border transition-all
                            ${isWishlisted 
                                ? 'bg-red-50 border-red-200 text-red-500' 
                                : 'border-gray-300 text-gray-500 hover:border-black hover:bg-black hover:text-white'}
                        `}
                    >
                        <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                    
                    <button className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all text-gray-500">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            <div className="w-full lg:w-1/2 relative flex justify-center order-1 lg:order-2">
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 rounded-full filter blur-3xl transform translate-y-20 scale-75"></div>

                 {isOutOfStock && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                         <span className="text-4xl md:text-5xl font-display font-bold text-black uppercase bg-white/90 backdrop-blur-md px-8 py-4 rounded-xl shadow-2xl transform -rotate-12 border-2 border-black inline-block whitespace-nowrap">
                            SOLD OUT
                         </span>
                    </div>
                 )}

                 <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`
                        relative z-10 w-full max-w-[600px] object-contain drop-shadow-2xl mix-blend-multiply transform -rotate-12 transition-transform duration-700 ease-in-out
                        ${isOutOfStock ? 'grayscale opacity-60' : 'hover:rotate-0'}
                    `}
                 />
            </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="bg-white py-12 border-t border-gray-200">
          <div className="container mx-auto px-6 md:px-12">
              <h3 className="text-2xl font-display font-bold uppercase mb-8">Customer Reviews</h3>
              
              <div className="flex flex-col md:flex-row gap-12">
                  {/* Reviews List */}
                  <div className="w-full md:w-2/3 space-y-6">
                      {productReviews.length === 0 ? (
                          <div className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-100">
                              <p className="text-gray-400 font-bold">No reviews yet.</p>
                              <p className="text-sm text-gray-500 mt-1">Be the first to share your thoughts!</p>
                          </div>
                      ) : (
                          productReviews.map(review => (
                              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                                  <div className="flex justify-between items-start mb-2">
                                      <div>
                                          <p className="font-bold text-sm text-gray-900">{review.userName}</p>
                                          <div className="flex text-yellow-400 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-yellow-400" : "text-gray-200"} />
                                            ))}
                                          </div>
                                      </div>
                                      <span className="text-xs text-gray-400 font-bold">{new Date(review.date).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                  <div className="flex items-center gap-1 mt-2 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                                      <CheckCircle size={12} /> Verified Buyer
                                  </div>
                              </div>
                          ))
                      )}
                  </div>

                  {/* Add Review Box */}
                  <div className="w-full md:w-1/3">
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                          <h4 className="font-bold text-lg mb-4">Write a Review</h4>
                          
                          {!user ? (
                              <div className="text-center py-4">
                                  <p className="text-sm text-gray-500 mb-3">Please sign in to leave a review.</p>
                                  <div className="w-full h-px bg-gray-200"></div>
                              </div>
                          ) : !hasPurchased ? (
                              <div className="text-center py-4">
                                  <p className="text-sm text-gray-500 mb-3">Only customers who have purchased this product can leave a review.</p>
                              </div>
                          ) : hasReviewed ? (
                              <div className="text-center py-4 text-green-600">
                                  <CheckCircle size={32} className="mx-auto mb-2" />
                                  <p className="font-bold">Thanks for your review!</p>
                                  <p className="text-xs">You've earned 50 points.</p>
                              </div>
                          ) : reviewSubmitted ? (
                               <div className="text-center py-4 text-green-600 animate-in fade-in zoom-in">
                                  <CheckCircle size={32} className="mx-auto mb-2" />
                                  <p className="font-bold">Submitted successfully!</p>
                              </div>
                          ) : (
                              <form onSubmit={submitReview} className="space-y-4">
                                  <div>
                                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Rating</label>
                                      <div className="flex gap-2">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                              <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={`transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                              >
                                                  <Star size={24} fill="currentColor" />
                                              </button>
                                          ))}
                                      </div>
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Comment</label>
                                      <textarea 
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-black min-h-[100px]"
                                        placeholder="How's the fit? Comfort?"
                                        required
                                      />
                                  </div>
                                  <button 
                                    type="submit"
                                    className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                                  >
                                      SUBMIT REVIEW
                                  </button>
                                  <p className="text-[10px] text-gray-400 text-center">
                                      Earn 50 Loyalty Points for your review.
                                  </p>
                              </form>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="bg-white py-12 border-t border-gray-200 transition-colors">
          <div className="container mx-auto px-6 md:px-12">
               <RecentlyViewed 
                    products={recentlyViewed} 
                    onProductClick={onProductClick} 
                    wishlistIds={isWishlisted !== undefined ? (isWishlisted ? [product.id] : []) : undefined} 
                    onToggleWishlist={onToggleWishlist}
               />
          </div>
      </div>
    </div>
  );
};

export default ProductView;

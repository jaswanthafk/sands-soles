
import React, { useEffect, useRef, useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Crown } from 'lucide-react';
import { CartItem, User } from '../types';
import { REDEMPTION_RATE } from '../constants';
import gsap from 'gsap';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (cartId: string) => void;
  onCheckout: (total: number, pointsToRedeem: number) => void;
  user: User | null;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onCheckout, user }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [usePoints, setUsePoints] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  
  // Calculate Discount
  let maxDiscount = 0;
  let pointsToUse = 0;
  
  if (user) {
      // Example: 100 points = 1 KWD
      // Max discount cannot exceed subtotal
      const potentialDiscount = user.loyaltyPoints / REDEMPTION_RATE;
      if (potentialDiscount > subtotal) {
          maxDiscount = subtotal;
          pointsToUse = subtotal * REDEMPTION_RATE;
      } else {
          maxDiscount = potentialDiscount;
          pointsToUse = user.loyaltyPoints;
      }
  }

  const discount = usePoints ? maxDiscount : 0;
  const finalTotal = subtotal - discount;

  useEffect(() => {
    if (isOpen) {
        gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, display: 'block' });
        gsap.to(drawerRef.current, { x: '0%', duration: 0.4, ease: 'power3.out' });
    } else {
        gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, display: 'none' });
        gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
        setUsePoints(false); // Reset on close
    }
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[70] ${!isOpen && 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 hidden"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div 
        ref={drawerRef}
        className="absolute right-0 top-0 h-full w-full md:w-[450px] bg-[#EBEBE9] shadow-2xl translate-x-full flex flex-col border-l border-white/50"
      >
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-gray-300 bg-[#EBEBE9]/80 backdrop-blur-sm z-10">
            <h2 className="text-2xl font-display font-bold uppercase flex items-center gap-2 text-gray-900">
                Your Bag <span className="text-sm font-sans font-normal text-gray-500">({items.length})</span>
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-black">
                <X size={24} />
            </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                    <ShoppingBag size={64} strokeWidth={1} className="mb-4" />
                    <p className="text-lg font-bold uppercase">Your bag is empty</p>
                    <p className="text-sm">Time to start a collection.</p>
                </div>
            ) : (
                items.map((item) => (
                    <div key={item.cartId} className="flex bg-white p-4 rounded-xl shadow-sm border border-white/50 items-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-contain mix-blend-multiply"
                            />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase">{item.brand}</h4>
                                    <h3 className="font-bold text-gray-900 truncate pr-2">{item.name}</h3>
                                </div>
                                <p className="font-bold text-sm text-gray-900">KD {item.price}</p>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <p className="text-xs text-gray-500">Size: <span className="font-bold text-gray-800">{item.selectedSize}</span></p>
                                <button 
                                    onClick={() => onRemove(item.cartId)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
            <div className="p-6 bg-white border-t border-gray-100">
                
                {/* Loyalty Redemption */}
                {user && user.loyaltyPoints > 0 && (
                    <div className="bg-black/5 p-4 rounded-xl mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black text-accent rounded-full flex items-center justify-center">
                                <Crown size={14} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-gray-500">Redeem Points</p>
                                <p className="text-sm font-bold">Available: {user.loyaltyPoints}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-accent bg-black px-2 py-1 rounded">
                                - KD {maxDiscount.toFixed(3)}
                            </span>
                            <button 
                                onClick={() => setUsePoints(!usePoints)}
                                className={`w-10 h-6 rounded-full transition-colors relative ${usePoints ? 'bg-accent' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${usePoints ? 'left-5' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>KD {subtotal.toFixed(3)}</span>
                    </div>
                    
                    {usePoints && (
                        <div className="flex justify-between text-sm text-accent font-bold">
                            <span>Loyalty Discount</span>
                            <span>- KD {discount.toFixed(3)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Shipping</span>
                        <span className="text-accent font-bold">FREE</span>
                    </div>
                    
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-100">
                        <span>Total</span>
                        <span>KD {finalTotal.toFixed(3)}</span>
                    </div>
                </div>

                <button 
                    onClick={() => {
                        onCheckout(finalTotal, usePoints ? pointsToUse : 0);
                        onClose();
                    }}
                    className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 flex items-center justify-center gap-2 group"
                >
                    CHECKOUT
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;

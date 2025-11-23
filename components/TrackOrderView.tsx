
import React, { useLayoutEffect, useRef } from 'react';
import { Order } from '../types';
import { ArrowLeft, MapPin, Package, CheckCircle, Truck, Clock } from 'lucide-react';
import gsap from 'gsap';

interface TrackOrderViewProps {
  order: Order;
  onBack: () => void;
}

const TrackOrderView: React.FC<TrackOrderViewProps> = ({ order, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".animate-up", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
      
      gsap.fromTo(".progress-line",
        { scaleY: 0 },
        { scaleY: 1, duration: 1, delay: 0.5, ease: "power3.inOut" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Determine step index
  const getStepIndex = (status: string) => {
    if (status === 'Delivered') return 3;
    if (status === 'Shipped') return 2;
    return 1; // Processing
  };

  const currentStep = getStepIndex(order.status);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#EBEBE9] pt-24 pb-12">
      <div className="container mx-auto px-6 md:px-12">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-wider mb-8 animate-up"
        >
            <ArrowLeft size={16} /> Back to Orders
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: Order Status */}
            <div className="w-full lg:w-2/3 space-y-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm animate-up">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-gray-900 uppercase mb-1">Track Order</h1>
                            <p className="text-gray-500 text-sm">Order ID: <span className="font-bold text-black">{order.id}</span></p>
                        </div>
                        <div className="text-right">
                             <p className="text-xs font-bold text-gray-400 uppercase">Estimated Delivery</p>
                             <p className="text-lg font-bold text-gray-900">3 - 5 Business Days</p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative pl-4 py-2">
                         <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100"></div>
                         <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-black origin-top progress-line"></div>
                         
                         <div className="space-y-12 relative z-10">
                             {/* Step 1: Processing */}
                             <div className="flex gap-6 items-start group">
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${currentStep >= 1 ? 'bg-black text-accent' : 'bg-gray-200 text-gray-400'}`}>
                                     <Clock size={18} />
                                 </div>
                                 <div className={`${currentStep >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                                     <h4 className="font-bold text-lg">Order Processed</h4>
                                     <p className="text-sm text-gray-500">We have received your order and are getting it ready.</p>
                                     <p className="text-xs font-bold text-gray-400 mt-1">{order.date}</p>
                                 </div>
                             </div>

                             {/* Step 2: Shipped */}
                             <div className="flex gap-6 items-start group">
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${currentStep >= 2 ? 'bg-black text-accent' : 'bg-gray-200 text-gray-400'}`}>
                                     <Truck size={18} />
                                 </div>
                                 <div className={`${currentStep >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                                     <h4 className="font-bold text-lg">Out for Delivery</h4>
                                     <p className="text-sm text-gray-500">Your package is with our courier partner.</p>
                                     {currentStep >= 2 && <p className="text-xs font-bold text-gray-400 mt-1">In Transit</p>}
                                 </div>
                             </div>

                             {/* Step 3: Delivered */}
                             <div className="flex gap-6 items-start group">
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${currentStep >= 3 ? 'bg-black text-accent' : 'bg-gray-200 text-gray-400'}`}>
                                     <CheckCircle size={18} />
                                 </div>
                                 <div className={`${currentStep >= 3 ? 'opacity-100' : 'opacity-50'}`}>
                                     <h4 className="font-bold text-lg">Delivered</h4>
                                     <p className="text-sm text-gray-500">Package has been delivered to your address.</p>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Item Details */}
                <div className="bg-white p-8 rounded-3xl shadow-sm animate-up">
                    <h3 className="font-bold text-xl mb-6">Package Contents</h3>
                    <div className="space-y-6">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center p-2">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase">{item.brand}</p>
                                    <h4 className="font-bold text-sm">{item.name}</h4>
                                    <p className="text-xs text-gray-500">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-sm">KWD {item.price.toFixed(3)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-100 mt-6 pt-6 flex justify-between items-center">
                        <p className="font-bold text-gray-500">Total Paid</p>
                        <p className="text-2xl font-bold text-black">KWD {order.total.toFixed(3)}</p>
                    </div>
                </div>
            </div>

            {/* Right: Shipping Info */}
            <div className="w-full lg:w-1/3 space-y-8 animate-up">
                <div className="bg-white p-8 rounded-3xl shadow-sm">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                        <MapPin size={20} /> Shipping Details
                    </h3>
                    
                    {order.shippingDetails ? (
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Recipient</p>
                                <p className="font-bold">{order.shippingDetails.fullName}</p>
                                <p className="text-sm text-gray-500">{order.shippingDetails.phone}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Delivery Address</p>
                                <p className="font-bold">{order.shippingDetails.area}</p>
                                <p className="text-sm text-gray-500">{order.shippingDetails.address}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">No specific shipping details available for this order.</p>
                    )}

                    <div className="mt-8 h-40 bg-gray-100 rounded-xl overflow-hidden relative">
                        {/* Mock Map */}
                        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Kuwait_City_Map.png')] bg-cover bg-center opacity-50"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-black text-accent rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                <MapPin size={16} fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-black text-white p-8 rounded-3xl shadow-lg text-center">
                    <Package size={32} className="mx-auto mb-4 text-accent" />
                    <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                    <p className="text-sm text-gray-400 mb-6">If you have issues with your delivery, contact our support team.</p>
                    <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-accent transition-colors">
                        CONTACT SUPPORT
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderView;


import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, User, Phone, Mail, ArrowRight } from 'lucide-react';
import { ShippingDetails } from '../types';
import gsap from 'gsap';

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: ShippingDetails) => void;
}

const ShippingModal: React.FC<ShippingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('Kuwait City');
  const [address, setAddress] = useState('');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, display: 'block' });
      gsap.fromTo(modalRef.current, 
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
      );
    } else {
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, display: 'none' });
      gsap.to(modalRef.current, { 
        y: 20, 
        opacity: 0, 
        scale: 0.95, 
        duration: 0.3, 
        ease: 'power3.in' 
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const details: ShippingDetails = {
        fullName,
        email,
        phone,
        area,
        address
    };
    
    onSubmit(details);
  };

  return (
    <div className={`fixed inset-0 z-[90] flex items-center justify-center p-4 ${!isOpen && 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-md hidden"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div 
        ref={modalRef} 
        className="relative w-full max-w-md bg-[#EBEBE9] rounded-3xl shadow-2xl overflow-hidden opacity-0 border border-white/20"
      >
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
            <X size={20} />
        </button>

        <div className="p-8">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-display font-bold uppercase mb-2">Delivery Info</h2>
                <p className="text-gray-500 text-sm">Where should we send your order?</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1">
                    <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="email" 
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                    <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="tel" 
                            placeholder="Phone Number (+965)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Area & Address */}
                <div className="flex gap-3">
                    <div className="w-1/2">
                        <select 
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            className="w-full bg-white rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all appearance-none"
                        >
                            <option value="Kuwait City">Kuwait City</option>
                            <option value="Salmiya">Salmiya</option>
                            <option value="Hawally">Hawally</option>
                            <option value="Farwaniya">Farwaniya</option>
                            <option value="Ahmadi">Ahmadi</option>
                            <option value="Jahra">Jahra</option>
                        </select>
                    </div>
                    <div className="w-1/2 relative">
                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Address Details"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all"
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg mt-6"
                >
                    CONTINUE TO PAYMENT <ArrowRight size={18} />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ShippingModal;

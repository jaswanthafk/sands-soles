
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, Lock, MapPin, User, Phone, Mail } from 'lucide-react';
import { KWD_TO_USD_RATE } from '../constants';
import { ShippingDetails } from '../types';

interface CheckoutFormProps {
  amountKWD: number;
  onSuccess: (details: ShippingDetails) => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amountKWD, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  // Shipping State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('Kuwait City');
  const [address, setAddress] = useState('');

  // Convert KWD to USD (approximate for demo)
  const amountUSD = (amountKWD * KWD_TO_USD_RATE).toFixed(2);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!fullName || !email || !phone || !address) {
        onError("Please fill in all shipping details.");
        return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
        setLoading(false);
        return;
    }

    // 1. Create Payment Method (Frontend)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
          name: fullName,
          email: email,
          phone: phone,
          address: {
              line1: address,
              city: area,
              country: 'KW'
          }
      }
    });

    if (error) {
      onError(error.message || 'Payment failed');
      setLoading(false);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      
      // 2. Simulate Backend Processing
      setTimeout(() => {
          setLoading(false);
          const shippingDetails: ShippingDetails = {
              fullName,
              email,
              phone,
              area,
              address
          };
          onSuccess(shippingDetails);
      }, 1500);
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Manrope, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
        <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-bold text-gray-500 uppercase">Total to Pay</span>
            <span className="text-2xl font-bold text-gray-900">KWD {amountKWD.toFixed(3)}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-400">
            <span>USD Conversion (~{KWD_TO_USD_RATE})</span>
            <span>${amountUSD}</span>
        </div>
      </div>

      {/* Shipping Details */}
      <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase text-gray-500 tracking-widest">Shipping Information</h3>
          
          <div className="space-y-3">
              <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                      type="text" 
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      required
                  />
              </div>

              <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                      type="email" 
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      required
                  />
              </div>
              
              <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                      type="tel" 
                      placeholder="Phone Number (+965)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      required
                  />
              </div>

              <div className="flex gap-3">
                  <div className="w-1/2 relative">
                     <select 
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all appearance-none font-sans"
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
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                          type="text" 
                          placeholder="Block, Street, House"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                          required
                      />
                  </div>
              </div>
          </div>
      </div>

      {/* Card Details */}
      <div className="space-y-2 pt-2">
        <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Card Details</label>
        <div className="p-4 border border-gray-300 rounded-xl bg-white shadow-sm">
            <CardElement options={cardStyle} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : (
            <>
                <Lock size={16} /> PAY NOW
            </>
        )}
      </button>
      
      <div className="flex justify-center gap-2">
         <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">TEST MODE</span>
         <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">SECURE SSL</span>
      </div>
    </form>
  );
};

export default CheckoutForm;
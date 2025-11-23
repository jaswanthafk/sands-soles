
import React, { useState } from 'react';
import { Lock, CreditCard, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';

interface CustomPaymentGatewayProps {
  amountKWD: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const CustomPaymentGateway: React.FC<CustomPaymentGatewayProps> = ({ amountKWD, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  // Format Card Number with spaces
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 16);
    val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(val);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setExpiry(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        onSuccess();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-black p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-accent" />
                <span className="font-bold tracking-wider uppercase text-sm">Secure Checkout</span>
            </div>
            <div className="font-display font-bold text-xl">SANDS & SOULS</div>
        </div>

        <div className="p-8">
            <div className="text-center mb-8">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Total Amount</p>
                <p className="text-4xl font-bold text-gray-900">KWD {amountKWD.toFixed(3)}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cardholder Name</label>
                    <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name on Card"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Card Number</label>
                    <div className="relative">
                        <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            required
                            value={cardNumber}
                            onChange={handleCardChange}
                            placeholder="0000 0000 0000 0000"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Expiry Date</label>
                        <input 
                            type="text" 
                            required
                            value={expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM / YY"
                            maxLength={5}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all text-center"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">CVC / CVV</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                required
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                placeholder="123"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all"
                            />
                        </div>
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg mt-4"
                >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : (
                        <>
                            PAY NOW <ArrowRight size={18} />
                        </>
                    )}
                </button>

                <button 
                    type="button"
                    onClick={onCancel}
                    className="w-full text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                >
                    CANCEL TRANSACTION
                </button>
            </form>
        </div>
        
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-center gap-4 opacity-50 grayscale">
             {/* Mock Card Icons */}
             <div className="h-6 w-10 bg-gray-300 rounded"></div>
             <div className="h-6 w-10 bg-gray-300 rounded"></div>
             <div className="h-6 w-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default CustomPaymentGateway;

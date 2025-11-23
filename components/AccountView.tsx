
import React, { useState } from 'react';
import { User, Order } from '../types';
import { LOYALTY_TIERS, POINTS_PER_KWD, POINTS_PER_REVIEW, REDEMPTION_RATE, POINTS_PER_REFERRAL } from '../constants';
import { Package, Award, MapPin, LogOut, Crown, ChevronRight, Settings, Truck, ShoppingBag, Star, Share2, Gift, Zap, Copy, Check } from 'lucide-react';

interface AccountViewProps {
  user: User;
  onLogout: () => void;
  onTrackOrder?: (order: Order) => void;
  onNavigate: (view: string) => void;
}

const AccountView: React.FC<AccountViewProps> = ({ user, onLogout, onTrackOrder, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');
  const [copied, setCopied] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  // Calculate Progress to next tier
  const currentTierConfig = LOYALTY_TIERS[user.tier];
  const nextTierName = user.tier === 'SILVER' ? 'GOLD' : user.tier === 'GOLD' ? 'PLATINUM' : 'PLATINUM';
  const nextTierConfig = LOYALTY_TIERS[nextTierName];
  const pointsToNext = user.tier === 'PLATINUM' ? 0 : nextTierConfig.min - user.loyaltyPoints;
  const progressPercent = user.tier === 'PLATINUM' 
    ? 100 
    : Math.min(100, ((user.loyaltyPoints - currentTierConfig.min) / (nextTierConfig.min - currentTierConfig.min)) * 100);

  const referralCode = `SANDS-${user.name.split(' ')[0].toUpperCase()}-${Math.floor(Math.random() * 1000 + 100)}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`Join me on Sands & Souls! Use my code ${referralCode} for 10% off your first order.`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 bg-[#EBEBE9] container mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-4xl md:text-6xl font-display font-bold uppercase text-gray-900 mb-2 leading-none">My Account</h1>
                <p className="text-gray-500 text-sm md:text-base">Welcome back, {user.name.split(' ')[0]}</p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center gap-4 w-full md:w-auto justify-between md:justify-start bg-white md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none">
                <div className="text-left md:text-right">
                    <p className="text-[10px] md:text-xs font-bold uppercase text-gray-400">Member Status</p>
                    <p className="font-bold text-sm md:text-base">{user.tier}</p>
                </div>
                <img src={user.avatar} alt={user.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white shadow-lg" />
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-1/4">
                <div className="bg-white rounded-2xl shadow-sm sticky top-24 lg:p-4 overflow-hidden">
                    <nav className="flex lg:flex-col overflow-x-auto no-scrollbar p-2 lg:p-0 lg:space-y-1">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`flex-shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'overview' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            <Award size={18} /> Overview
                        </button>
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`flex-shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'orders' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            <Package size={18} /> Orders
                        </button>
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`flex-shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'settings' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            <Settings size={18} /> Settings
                        </button>
                        <div className="hidden lg:block h-px bg-gray-100 my-2"></div>
                        <button 
                            onClick={onLogout}
                            className="flex-shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={18} /> <span className="hidden lg:inline">Sign Out</span><span className="lg:hidden">Exit</span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
                
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Loyalty Card */}
                        <div className="relative w-full aspect-[1.6] md:h-64 rounded-3xl overflow-hidden shadow-2xl group perspective-1000 bg-black">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black p-6 md:p-8 flex flex-col justify-between z-10">
                                <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-display font-bold text-xl md:text-2xl uppercase tracking-widest text-white">Sands<span className="text-accent">&</span>Souls</h3>
                                        <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mt-1">Rewards Club</p>
                                    </div>
                                    <Crown size={24} className={`${user.tier === 'PLATINUM' ? 'text-gray-200' : user.tier === 'GOLD' ? 'text-yellow-400' : 'text-gray-500'} md:w-8 md:h-8`} />
                                </div>
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">Current Balance</p>
                                            <p className="text-3xl md:text-4xl font-display font-bold text-accent">{user.loyaltyPoints} <span className="text-sm md:text-lg text-white">PTS</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">Tier Status</p>
                                            <p className="text-lg md:text-xl font-bold uppercase text-white">{user.tier}</p>
                                        </div>
                                    </div>
                                    <div className="h-6 md:h-8 w-full flex gap-1 opacity-30 mt-4">
                                        {[...Array(40)].map((_, i) => (
                                            <div key={i} className="flex-1 bg-white" style={{ opacity: Math.random() }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm">
                            <h3 className="font-bold text-lg mb-4">Next Tier Progress</h3>
                            {user.tier !== 'PLATINUM' ? (
                                <>
                                    <div className="flex justify-between text-sm mb-2 font-bold">
                                        <span className="text-gray-500">{user.tier}</span>
                                        <span className="text-black">{nextTierName}</span>
                                    </div>
                                    <div className="w-full h-3 md:h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <div 
                                            className="h-full bg-accent transition-all duration-1000 ease-out"
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs md:text-sm text-gray-500">
                                        Earn <span className="text-black font-bold">{pointsToNext} more points</span> to unlock {nextTierName} status.
                                    </p>
                                </>
                            ) : (
                                <p className="text-accent font-bold">You have reached the highest tier. You are a legend.</p>
                            )}
                        </div>

                        {/* Ways to Earn Points */}
                        <div>
                            <h3 className="font-bold text-xl mb-6 px-2">Ways to Earn</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Shop & Earn */}
                                <div 
                                    onClick={() => onNavigate('collections')}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 cursor-pointer hover:border-black hover:shadow-md transition-all group"
                                >
                                    <div className="w-12 h-12 bg-gray-900 text-accent rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 group-hover:text-accent transition-colors">Shop & Earn</h4>
                                        <p className="text-xs text-gray-500 mt-1 mb-2">Get rewarded for every KWD you spend on our collection.</p>
                                        <p className="text-sm font-bold text-black">{POINTS_PER_KWD} Points / 1 KWD</p>
                                    </div>
                                </div>

                                {/* Leave Review */}
                                <div 
                                    onClick={() => setActiveTab('orders')}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 cursor-pointer hover:border-black hover:shadow-md transition-all group"
                                >
                                    <div className="w-12 h-12 bg-gray-900 text-accent rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Star size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 group-hover:text-accent transition-colors">Leave a Review</h4>
                                        <p className="text-xs text-gray-500 mt-1 mb-2">Share your thoughts on your verified purchases.</p>
                                        <p className="text-sm font-bold text-black">{POINTS_PER_REVIEW} Points / Review</p>
                                    </div>
                                </div>

                                {/* Refer a Friend */}
                                <div 
                                    onClick={() => setShowReferral(!showReferral)}
                                    className={`bg-white p-6 rounded-2xl shadow-sm border flex flex-col items-start gap-4 cursor-pointer hover:shadow-md transition-all group col-span-1 sm:col-span-2 ${showReferral ? 'border-black' : 'border-gray-100'}`}
                                >
                                    <div className="flex items-start gap-4 w-full">
                                        <div className="w-12 h-12 bg-gray-900 text-accent rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <Share2 size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 group-hover:text-accent transition-colors">Refer a Friend</h4>
                                            <p className="text-xs text-gray-500 mt-1 mb-2">Invite friends to join the club.</p>
                                            <p className="text-sm font-bold text-black">{POINTS_PER_REFERRAL} Points / Referral</p>
                                        </div>
                                        {showReferral && (
                                            <ChevronRight size={20} className="text-gray-400 rotate-90" />
                                        )}
                                    </div>
                                    
                                    {/* Referral Code Expansion */}
                                    {showReferral && (
                                        <div className="w-full mt-2 animate-in fade-in slide-in-from-top-2">
                                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Your Unique Referral Code</p>
                                            <div className="flex gap-2">
                                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-sm font-bold text-gray-700 tracking-wider">
                                                    {referralCode}
                                                </div>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCopyReferral();
                                                    }}
                                                    className="bg-black text-white px-4 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-accent hover:text-black transition-colors"
                                                >
                                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                                    {copied ? 'COPIED' : 'COPY'}
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-2">
                                                Share this code. Friends get 10% off, you get {POINTS_PER_REFERRAL} points when they make their first purchase.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Rewards & Redemption */}
                        <div className="bg-black text-white rounded-3xl p-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-accent">
                                        <Gift size={20} />
                                        <span className="font-bold uppercase tracking-widest text-xs">Redeem Rewards</span>
                                    </div>
                                    <h3 className="text-3xl font-display font-bold uppercase mb-2">Turn Points into Cash</h3>
                                    <p className="text-gray-400 text-sm max-w-md mb-6">
                                        Use your points at checkout for instant discounts on your favorite sneakers. No minimum spend required.
                                    </p>
                                    <button 
                                        onClick={() => onNavigate('collections')}
                                        className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-accent transition-colors flex items-center gap-2"
                                    >
                                        <ShoppingBag size={16} /> SHOP NOW
                                    </button>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/10 w-full md:w-auto">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Exchange Rate</p>
                                    <p className="text-3xl font-bold text-white mb-1">{REDEMPTION_RATE} PTS</p>
                                    <Zap size={16} className="mx-auto text-gray-500 my-1" />
                                    <p className="text-3xl font-bold text-accent">1 KWD</p>
                                </div>
                             </div>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <h3 className="font-bold text-xl mb-2 px-2">Order History</h3>
                        {user.orders && user.orders.length > 0 ? (
                            user.orders.map(order => (
                                <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                                        <img src={order.image} alt="Order" className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-bold text-base">{order.id}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-1">{order.date}</p>
                                        <div className="flex justify-between items-end">
                                            <p className="text-xs text-gray-500">{order.itemsCount} Item{order.itemsCount > 1 ? 's' : ''}</p>
                                            <span className="text-black font-bold text-sm">KWD {order.total.toFixed(3)}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => onTrackOrder && onTrackOrder(order)}
                                        className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-accent hover:text-black transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Truck size={14} /> Track
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-8 rounded-2xl text-center">
                                <p className="text-gray-400 text-sm">You haven't placed any orders yet.</p>
                                <button 
                                    onClick={() => onNavigate('collections')}
                                    className="mt-4 text-accent font-bold hover:underline"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                         <h3 className="font-bold text-xl mb-6">Account Settings</h3>
                         
                         <div className="space-y-6 max-w-md">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Full Name</label>
                                <input type="text" value={user.name} disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-500 cursor-not-allowed text-sm" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Email Address</label>
                                <input type="email" value={user.email} disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-500 cursor-not-allowed text-sm" />
                            </div>
                            
                            <div className="pt-6 border-t border-gray-100">
                                <button className="text-red-500 font-bold text-xs hover:underline">Request Account Deletion</button>
                            </div>
                         </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default AccountView;

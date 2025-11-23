
import React from 'react';
import { Crown } from 'lucide-react';

interface LoyaltyBadgeProps {
  points: number;
  tier: string;
  onClick: () => void;
}

const LoyaltyBadge: React.FC<LoyaltyBadgeProps> = ({ points, tier, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-8 right-6 md:right-8 z-40 bg-white/90 backdrop-blur-md text-black pl-3 pr-6 py-3 rounded-full shadow-2xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-700 border border-white/50 group"
    >
      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-accent relative overflow-hidden">
        <Crown size={18} />
        {/* Shine effect */}
        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-[shimmer_1s_infinite]"></div>
      </div>
      
      <div className="text-left leading-none">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{tier} MEMBER</p>
        <p className="font-display font-bold text-xl text-gray-900 tabular-nums">{points} <span className="text-xs text-accent bg-black px-1 rounded">PTS</span></p>
      </div>
    </button>
  );
};

export default LoyaltyBadge;

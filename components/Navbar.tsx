
import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, User as UserIcon, LogOut, Settings, ChevronRight, Heart, LayoutDashboard } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
  onSearchClick: () => void;
  user: User | null;
  onAuthClick: () => void;
  onLogout: () => void;
  wishlistCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, currentView, onChangeView, onSearchClick, user, onAuthClick, onLogout, wishlistCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleNavClick = (view: string) => {
    onChangeView(view);
    setIsMenuOpen(false);
  };

  return (
    <>
    <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center fixed top-0 left-0 z-50 bg-[#EBEBE9]/90 backdrop-blur-md transition-colors duration-300 border-b border-gray-200/50 md:border-none">
      <div className="flex items-center z-50 cursor-pointer" onClick={() => handleNavClick('home')}>
        {/* Logo */}
        <svg width="40" height="24" viewBox="0 0 50 30" fill="currentColor" className="text-black">
          <path d="M10,25 Q25,5 40,25" stroke="currentColor" strokeWidth="3" fill="none" />
        </svg>
        <span className="ml-2 font-display font-bold text-xl md:hidden tracking-wider">SANDS</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-12 text-xs font-bold tracking-widest text-gray-400">
        {['men', 'women', 'kids', 'customize', 'collections', 'news'].map((item) => (
             <button 
                key={item}
                onClick={() => handleNavClick(item)} 
                className={`hover:text-black transition-colors uppercase ${currentView === item ? 'text-black' : ''}`}
            >
                {item === 'news' ? 'Journal' : item}
            </button>
        ))}
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-4 md:space-x-6">
         <button onClick={onSearchClick} className="hover:scale-110 transition-transform p-2 text-gray-800">
            <Search size={20} />
         </button>

         <button onClick={() => handleNavClick('wishlist')} className="hover:scale-110 transition-transform p-2 text-gray-800 relative">
            <Heart size={20} />
            {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-accent text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-[#EBEBE9]">
                    {wishlistCount}
                </span>
            )}
         </button>
         
         {/* User Menu */}
         <div className="relative hidden md:block">
            <button 
                onClick={() => user ? setIsUserMenuOpen(!isUserMenuOpen) : onAuthClick()} 
                className="hover:scale-110 transition-transform flex items-center gap-2 text-gray-800"
            >
                {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full border border-gray-300" />
                ) : (
                    <UserIcon size={20} />
                )}
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && user && (
                <div className="absolute top-full right-0 mt-4 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-50 mb-2 bg-gray-50/50">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Signed in as</p>
                        <p className="text-sm font-bold truncate text-gray-900">{user.name}</p>
                        <p className="text-[10px] font-bold text-accent bg-black inline-block px-2 py-0.5 rounded mt-2">{user.tier} MEMBER</p>
                    </div>
                    
                    {user.isAdmin && (
                        <button 
                            onClick={() => {
                                handleNavClick('admin');
                                setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-black hover:bg-gray-50 flex items-center justify-between font-bold transition-colors border-b border-gray-50"
                        >
                            <span className="flex items-center gap-2"><LayoutDashboard size={16} /> Admin Dashboard</span>
                        </button>
                    )}
                    
                    <button 
                        onClick={() => {
                            handleNavClick('account');
                            setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-between font-medium transition-colors"
                    >
                        <span className="flex items-center gap-2"><Settings size={16} /> My Account</span>
                    </button>

                    <button 
                        onClick={() => {
                            handleNavClick('wishlist');
                            setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-between font-medium transition-colors"
                    >
                        <span className="flex items-center gap-2"><Heart size={16} /> My Wishlist</span>
                    </button>

                    <button 
                        onClick={() => {
                            onLogout();
                            setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 font-medium transition-colors"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            )}
         </div>

         <button onClick={onOpenCart} className="relative hover:scale-110 transition-transform p-2 text-gray-800">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-[#EBEBE9]">
                    {cartCount}
                </span>
            )}
         </button>

         <button className="md:hidden p-2 text-gray-800" onClick={() => setIsMenuOpen(true)}>
            <Menu size={24} />
         </button>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-accent font-display font-bold text-lg pt-1">S</div>
                    <span className="font-display font-bold text-xl tracking-wider">MENU</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center px-8 space-y-6 overflow-y-auto">
                {['Home', 'Men', 'Women', 'Kids', 'Customize', 'Collections', 'Wishlist', 'Journal'].map((item) => (
                    <button 
                        key={item}
                        onClick={() => handleNavClick(item === 'Journal' ? 'news' : item.toLowerCase())} 
                        className={`text-left text-4xl sm:text-5xl font-display font-bold uppercase transition-all duration-300 group flex items-center gap-4
                            ${(currentView === item.toLowerCase() || (item === 'Journal' && currentView === 'news')) 
                                ? 'text-black translate-x-4' 
                                : 'text-gray-300 hover:text-black hover:translate-x-4'
                            }`}
                    >
                        {item}
                        {(currentView === item.toLowerCase() || (item === 'Journal' && currentView === 'news')) && (
                            <ChevronRight size={24} className="text-accent" />
                        )}
                    </button>
                ))}
            </div>

            {/* Footer / Account Actions */}
            <div className="p-8 bg-gray-50 border-t border-gray-100">
                {user ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                             <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                             <div>
                                 <p className="font-bold text-lg leading-none">{user.name}</p>
                                 <p className="text-xs font-bold text-gray-400 uppercase mt-1">{user.tier} MEMBER</p>
                             </div>
                        </div>
                        
                        {user.isAdmin && (
                             <button 
                                onClick={() => handleNavClick('admin')} 
                                className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 mb-2"
                            >
                                ADMIN DASHBOARD
                            </button>
                        )}

                        <button 
                            onClick={() => handleNavClick('account')} 
                            className="w-full py-4 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2"
                        >
                            MY ACCOUNT
                        </button>
                        <button 
                            onClick={onLogout} 
                            className="w-full py-4 border border-gray-200 text-gray-500 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                        >
                            SIGN OUT
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => { onAuthClick(); setIsMenuOpen(false); }}
                            className="py-4 border border-gray-300 font-bold rounded-xl hover:bg-white hover:border-black transition-colors"
                        >
                            SIGN IN
                        </button>
                        <button 
                            onClick={() => { onAuthClick(); setIsMenuOpen(false); }}
                            className="py-4 bg-black text-white font-bold rounded-xl hover:bg-accent hover:text-black transition-colors"
                        >
                            JOIN US
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

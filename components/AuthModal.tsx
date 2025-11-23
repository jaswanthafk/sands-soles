
import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User as UserIcon, Loader2, ArrowRight, Chrome, Ghost } from 'lucide-react';
import { loginUser, registerUser, loginWithGoogle, loginAnonymously } from '../services/authService';
import { User } from '../types';
import gsap from 'gsap';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setLoading(false);
      // Animation In
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, display: 'block' });
      gsap.fromTo(modalRef.current, 
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
      );
    } else {
      // Animation Out
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

  const handleSuccess = (user: User) => {
    // Success Animation
    gsap.to(modalRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
            onLoginSuccess(user);
            onClose();
            // Reset form
            setEmail('');
            setPassword('');
            setName('');
        }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let user: User;
      if (mode === 'LOGIN') {
        user = await loginUser(email, password);
      } else {
        user = await registerUser(name, email, password);
      }
      handleSuccess(user);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      gsap.fromTo(modalRef.current, { x: -10 }, { x: 10, duration: 0.1, repeat: 3, yoyo: true });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
      setError(null);
      setLoading(true);
      try {
          const user = await loginWithGoogle();
          handleSuccess(user);
      } catch (err: any) {
          setError(err.message || "Google login failed");
      } finally {
          setLoading(false);
      }
  };

  const handleGuestLogin = async () => {
      setError(null);
      setLoading(true);
      try {
          const user = await loginAnonymously();
          handleSuccess(user);
      } catch (err: any) {
          setError(err.message || "Guest login failed");
      } finally {
          setLoading(false);
      }
  };

  const toggleMode = () => {
    setError(null);
    setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
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

        <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-display font-bold uppercase mb-2">
                    {mode === 'LOGIN' ? 'Welcome Back' : 'Join the Club'}
                </h2>
                <p className="text-gray-500 text-sm">
                    {mode === 'LOGIN' 
                        ? 'Sign in to access your saved styling and history.' 
                        : 'Create an account for exclusive drops and rewards.'}
                </p>
            </div>

            {error && (
                <div className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 mb-4 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'SIGNUP' && (
                    <div className="space-y-1">
                        <div className="relative">
                            <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                required
                            />
                        </div>
                    </div>
                )}

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

                <div className="space-y-1">
                    <div className="relative">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="password" 
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all"
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-black text-accent font-bold rounded-xl hover:bg-gray-900 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                    {loading && mode === 'LOGIN' ? <Loader2 size={20} className="animate-spin" /> : (
                        <>
                            {mode === 'LOGIN' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                            {mode !== 'LOGIN' && <ArrowRight size={18} />}
                        </>
                    )}
                </button>
            </form>

            <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-300"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Or continue with</span>
                <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            <div className="space-y-3">
                <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                >
                    <Chrome size={18} /> Google
                </button>

                <button 
                    type="button"
                    onClick={handleGuestLogin}
                    disabled={loading}
                    className="w-full py-3 bg-white border border-gray-300 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                >
                    <Ghost size={18} /> Continue as Guest
                </button>
            </div>

            <div className="mt-6 text-center">
                <button 
                    onClick={toggleMode}
                    className="text-xs font-bold text-gray-500 hover:text-black underline underline-offset-4 transition-colors"
                >
                    {mode === 'LOGIN' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

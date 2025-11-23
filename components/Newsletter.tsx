import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Newsletter: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        gsap.fromTo(sectionRef.current,
            { scale: 0.95, opacity: 0, y: 50 },
            {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%"
                }
            }
        );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 my-10 relative overflow-hidden rounded-3xl bg-gray-900 text-white text-center px-6">
      {/* Abstract BG Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
         <div className="absolute -top-20 -left-20 w-96 h-96 bg-accent rounded-full filter blur-[100px]"></div>
         <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 uppercase">Join the Inner Circle</h2>
        <p className="text-gray-400 mb-8 text-lg">
            Subscribe to our newsletter and get <span className="text-accent font-bold">10% OFF</span> your first order. 
            Plus early access to drops and exclusive events.
        </p>
        
        <form className="flex flex-col md:flex-row gap-4">
            <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm"
            />
            <button className="px-8 py-4 bg-accent text-black font-bold rounded-full hover:bg-white transition-colors shadow-[0_0_20px_rgba(193,240,85,0.3)]">
                SUBSCRIBE
            </button>
        </form>
        <p className="text-xs text-gray-500 mt-4">
            By subscribing you agree to our Privacy Policy. No spam, just heat.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Marquee: React.FC = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 20,
        ease: "linear",
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  const content = "AUTHENTICITY GUARANTEED • SAME DAY DELIVERY IN KUWAIT CITY • EXCLUSIVE DROPS • WORLDWIDE SHIPPING • ";

  return (
    <div className="w-full bg-black text-accent py-3 overflow-hidden relative z-20 border-y border-gray-800">
      <div ref={marqueeRef} className="whitespace-nowrap flex w-max">
        <span className="text-sm md:text-base font-bold tracking-widest uppercase mx-4">{content.repeat(10)}</span>
      </div>
    </div>
  );
};

export default Marquee;

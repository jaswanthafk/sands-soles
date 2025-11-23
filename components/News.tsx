import React, { useRef, useLayoutEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface NewsProps {
    onViewAll?: () => void;
    onReadPost?: (post: BlogPost) => void;
}

const News: React.FC<NewsProps> = ({ onViewAll, onReadPost }) => {
  // Take only the first 3 for the home widget
  const featuredPosts = BLOG_POSTS.slice(0, 3);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        // Animate Header
        gsap.fromTo(".news-header", 
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                scrollTrigger: { trigger: containerRef.current, start: "top 85%" }
            }
        );

        // Animate Cards
        gsap.fromTo(".news-card",
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: { trigger: ".news-grid", start: "top 85%" }
            }
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-20 border-t border-gray-300">
      <div className="flex justify-between items-end mb-12 news-header">
        <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 uppercase">Culture & Community</h2>
            <p className="text-gray-500 mt-2">Stories from the streets of KW.</p>
        </div>
        <button 
            onClick={onViewAll}
            className="hidden md:flex items-center gap-2 font-bold text-sm hover:text-accent transition-colors"
        >
            VIEW ALL POSTS <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 news-grid">
        {featuredPosts.map((item) => (
            <article 
                key={item.id} 
                className="group cursor-pointer news-card"
                onClick={() => onReadPost && onReadPost(item)}
            >
                <div className="overflow-hidden rounded-2xl mb-4 h-64 relative">
                    <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">
                        {item.category}
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-2 font-bold tracking-wider">
                    <span>{item.date}</span>
                </div>
                <h3 className="text-xl font-bold leading-tight group-hover:text-gray-600 transition-colors">
                    {item.title}
                </h3>
            </article>
        ))}
      </div>
      
      <div className="md:hidden mt-8 text-center news-header">
        <button 
            onClick={onViewAll}
            className="inline-flex items-center gap-2 font-bold text-sm hover:text-accent transition-colors border-b border-black pb-1"
        >
            VIEW ALL POSTS <ArrowUpRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default News;
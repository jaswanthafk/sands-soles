
import React from 'react';
import { BlogPost } from '../types';
import { ArrowRight } from 'lucide-react';

interface NewsViewProps {
  posts: BlogPost[];
  onReadPost: (post: BlogPost) => void;
}

const NewsView: React.FC<NewsViewProps> = ({ posts, onReadPost }) => {
  return (
    <div className="pt-32 pb-20 container mx-auto px-6 md:px-12 min-h-screen animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-6xl md:text-8xl font-display font-bold text-gray-900 uppercase mb-4 leading-none">
          Culture & <br /> Community
        </h1>
        <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
          Deep dives into sneaker culture, local spots, and style guides from the heart of Kuwait.
        </p>
        <div className="w-24 h-1 bg-accent mt-8"></div>
      </div>

      {/* Featured Post (First Item) */}
      {posts.length > 0 && (
        <div 
            onClick={() => onReadPost(posts[0])}
            className="group relative w-full h-[500px] rounded-3xl overflow-hidden cursor-pointer mb-12"
        >
            <img 
                src={posts[0].image} 
                alt={posts[0].title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
                <span className="bg-accent text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                    {posts[0].category}
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
                    {posts[0].title}
                </h2>
                <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-6">
                    {posts[0].excerpt}
                </p>
                <span className="text-white font-bold flex items-center gap-2 text-sm group-hover:text-accent transition-colors">
                    READ ARTICLE <ArrowRight size={16} />
                </span>
            </div>
        </div>
      )}

      {/* Grid for the rest */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.slice(1).map((post) => (
            <article 
                key={post.id} 
                onClick={() => onReadPost(post)}
                className="group cursor-pointer flex flex-col h-full"
            >
                <div className="overflow-hidden rounded-2xl mb-6 h-64 relative">
                    <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">
                        {post.category}
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 font-bold tracking-wider">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.author}</span>
                </div>
                <h3 className="text-2xl font-bold leading-tight text-gray-900 group-hover:text-gray-600 transition-colors mb-3">
                    {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                </p>
                <span className="text-black font-bold text-xs uppercase tracking-wider underline decoration-gray-300 underline-offset-4 group-hover:decoration-accent transition-all">
                    Read More
                </span>
            </article>
        ))}
      </div>
    </div>
  );
};

export default NewsView;

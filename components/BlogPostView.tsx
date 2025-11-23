
import React from 'react';
import { BlogPost } from '../types';
import { ArrowLeft, Share2, Clock, Calendar } from 'lucide-react';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
}

const BlogPostView: React.FC<BlogPostViewProps> = ({ post, onBack }) => {
  return (
    <article className="bg-white min-h-screen animate-in slide-in-from-bottom-8 duration-500 pt-20">
      {/* Hero Image */}
      <div className="relative w-full h-[40vh] md:h-[60vh]">
        <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        
        <button 
            onClick={onBack}
            className="absolute top-8 left-6 md:left-12 bg-white/90 backdrop-blur hover:bg-white text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-lg"
        >
            <ArrowLeft size={16} /> Back to News
        </button>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative -mt-20 z-10">
        <div className="bg-white rounded-t-3xl p-8 md:p-16 shadow-xl max-w-4xl mx-auto">
            {/* Header Info */}
            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
                <span className="text-accent bg-black px-3 py-1 rounded-full">{post.category}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> 5 Min Read</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 leading-tight mb-8">
                {post.title}
            </h1>

            <div className="flex items-center justify-between border-y border-gray-100 py-6 mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                        {post.author.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{post.author}</p>
                        <p className="text-xs text-gray-500">Editor</p>
                    </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-black transition-colors">
                    <Share2 size={20} />
                </button>
            </div>

            {/* Content Body */}
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                {post.content.map((paragraph, index) => {
                    // Simple Markdown-like parsing for bold text
                    const parts = paragraph.split(/(\*\*.*?\*\*)/);
                    return (
                        <p key={index} className="mb-6">
                            {parts.map((part, i) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={i} className="text-gray-900">{part.slice(2, -2)}</strong>;
                                }
                                return part;
                            })}
                        </p>
                    );
                })}
            </div>

            {/* Footer Tag */}
            <div className="mt-16 pt-8 border-t border-gray-200">
                <p className="text-center text-sm text-gray-400 italic">
                    Published by Sands & Souls Editorial Team
                </p>
            </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostView;

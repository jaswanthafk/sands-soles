
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stylist from './components/Stylist';
import ProductCard from './components/ProductCard';
import Marquee from './components/Marquee';
import Showcase from './components/Showcase';
import News from './components/News';
import Newsletter from './components/Newsletter';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CategoryView from './components/CategoryView';
import CustomizeView from './components/CustomizeView';
import NewsView from './components/NewsView';
import BlogPostView from './components/BlogPostView';
import RecentlyViewed from './components/RecentlyViewed';
import ProductView from './components/ProductView';
import SearchOverlay from './components/SearchOverlay';
import AuthModal from './components/AuthModal';
import AccountView from './components/AccountView';
import LoyaltyBadge from './components/LoyaltyBadge';
import TrackOrderView from './components/TrackOrderView';
import ShippingModal from './components/ShippingModal';
import CustomPaymentGateway from './components/CustomPaymentGateway';
import WishlistView from './components/WishlistView';
import AdminView from './components/AdminView';
import { PRODUCTS, BLOG_POSTS, POINTS_PER_KWD, POINTS_PER_REVIEW, LOYALTY_TIERS } from './constants';
import { Product, CartItem, BlogPost, User, Review, Order, ShippingDetails } from './types';
import { syncUserData, logoutUser, subscribeToAuthChanges, updateUserPoints, getReviews, addReview, submitOrder, getInventory, updateProductStock } from './services/authService';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Loader2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Inventory State (Map<ProductId, StockCount>)
  const [inventory, setInventory] = useState<Record<string, number>>({});
  
  // Checkout State
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [tempShippingDetails, setTempShippingDetails] = useState<ShippingDetails | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const productSectionRef = useRef<HTMLDivElement>(null);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedPost, selectedProduct]);

  // Initialize Auth Listener, Reviews & Inventory
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((authUser) => {
      setUser(authUser);
      if (authUser) {
        if (authUser.savedCart) setCartItems(authUser.savedCart);
        if (authUser.savedHistory) setRecentlyViewedIds(authUser.savedHistory);
        if (authUser.wishlist) setWishlistIds(authUser.wishlist);
      }
    });

    const loadData = async () => {
        const revData = await getReviews();
        setReviews(revData);
        
        let invData = await getInventory();
        // Seed if empty for demo
        if (Object.keys(invData).length === 0) {
            invData = {};
            PRODUCTS.forEach((p, index) => {
                // Random stock 0-25. Force a couple sold out/low for demo.
                const randomStock = Math.floor(Math.random() * 25);
                invData[p.id] = index === 1 ? 0 : index === 3 ? 3 : randomStock; 
                // Sync seeded data to DB (lazy logic in handleUpdateStock or just local until edit)
                updateProductStock(p.id, invData[p.id]);
            });
        }
        setInventory(invData);
    };
    loadData();

    return () => unsubscribe();
  }, []);

  // Load local data if NOT logged in
  useEffect(() => {
    if (!user) {
        const storedHistory = localStorage.getItem('recentlyViewed');
        if (storedHistory) {
            try { setRecentlyViewedIds(JSON.parse(storedHistory)); } catch (e) {}
        }

        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
            try { setWishlistIds(JSON.parse(storedWishlist)); } catch (e) {}
        }
    }
  }, [user]);

  // Sync data to Cloud or LocalStorage
  useEffect(() => {
    if (user) {
        syncUserData(user.id, cartItems, recentlyViewedIds, wishlistIds, user.orders, user.loyaltyPoints, user.tier);
    } else {
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewedIds));
        localStorage.setItem('wishlist', JSON.stringify(wishlistIds));
    }
  }, [cartItems, recentlyViewedIds, wishlistIds, user]);

  // Hash Routing
  useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash.slice(1); // Remove #
        if (!hash) {
            setCurrentView('home');
            return;
        }

        const [route, params] = hash.split('?');
        
        if (route === 'product') {
            const id = new URLSearchParams(params).get('id');
            const product = PRODUCTS.find(p => p.id === id);
            if (product) {
                setSelectedProduct(product);
                setCurrentView('product');
            }
        } else {
            setCurrentView(route);
        }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Handle initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const updateHash = (view: string, params?: string) => {
      let hash = `#${view}`;
      if (params) hash += `?${params}`;
      window.location.hash = hash;
  };

  // Animate Home Grid
  useLayoutEffect(() => {
    if (currentView === 'home') {
        const ctx = gsap.context(() => {
            gsap.fromTo(".grid-header",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, scrollTrigger: { trigger: ".grid-header", start: "top 85%" } }
            );
            gsap.fromTo(".home-product-card",
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    scrollTrigger: { trigger: ".product-grid-container", start: "top 75%" }
                }
            );
        });
        return () => ctx.revert();
    }
  }, [currentView, highlightedIds]);

  const addToRecentlyViewed = (id: string) => {
    const newIds = [id, ...recentlyViewedIds.filter(pid => pid !== id)].slice(0, 4);
    setRecentlyViewedIds(newIds);
  };

  const handleToggleWishlist = (product: Product) => {
      if (wishlistIds.includes(product.id)) {
          setWishlistIds(wishlistIds.filter(id => id !== product.id));
      } else {
          setWishlistIds([...wishlistIds, product.id]);
      }
  };

  const handleRecommendations = (ids: string[]) => {
    setHighlightedIds(ids);
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    addToRecentlyViewed(product.id);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    updateHash('product', `id=${product.id}`);
    addToRecentlyViewed(product.id);
  };

  const handleAddToCart = (product: Product, size: string) => {
    // Check stock
    const stock = inventory[product.id] !== undefined ? inventory[product.id] : 99;
    if (stock <= 0) return;

    const newItem: CartItem = {
        ...product,
        cartId: `${product.id}-${size}-${Date.now()}`, 
        selectedSize: size,
        quantity: 1
    };
    setCartItems([...cartItems, newItem]);
    setIsModalOpen(false);
    setIsCartOpen(true); 
  };

  const handleRemoveFromCart = (cartId: string) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
  };
  
  const handleUpdateStock = async (productId: string, newStock: number) => {
      const updatedInv = { ...inventory, [productId]: newStock };
      setInventory(updatedInv);
      await updateProductStock(productId, newStock);
  };

  const handleReadPost = (post: BlogPost) => {
    setSelectedPost(post);
    updateHash('post');
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setCartItems([]); 
    setRecentlyViewedIds([]);
    setWishlistIds([]);
    updateHash('home');
  };

  // --- REVIEW LOGIC ---
  const handleAddReview = async (productId: string, rating: number, comment: string) => {
      if (!user) return;

      const newReview: Review = {
          id: `rev-${Date.now()}`,
          productId,
          userId: user.id,
          userName: user.name,
          rating,
          comment,
          date: new Date().toISOString()
      };

      await addReview(newReview);
      setReviews(prev => [...prev, newReview]);

      // Award Points
      const newPoints = user.loyaltyPoints + POINTS_PER_REVIEW;
      let newTier = user.tier;
      if (newPoints >= LOYALTY_TIERS.PLATINUM.min) newTier = 'PLATINUM';
      else if (newPoints >= LOYALTY_TIERS.GOLD.min) newTier = 'GOLD';

      await updateUserPoints(user.id, newPoints, newTier);
      setUser({ ...user, loyaltyPoints: newPoints, tier: newTier });
  };

  // --- CHECKOUT LOGIC ---
  
  const handleCheckoutStart = () => {
      if (!user) {
          setIsCartOpen(false);
          setIsAuthOpen(true);
          return;
      }
      setIsCartOpen(false);
      setShippingModalOpen(true);
  };

  const handleShippingSubmit = (details: ShippingDetails) => {
      setTempShippingDetails(details);
      setShippingModalOpen(false);
      updateHash('checkout');
  };

  const handlePaymentSuccess = async () => {
      if (!user || !tempShippingDetails) return;
      
      const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

      const newOrder: Order = {
          id: `ORD-${Date.now()}`,
          date: new Date().toLocaleDateString(),
          status: 'Processing',
          total: subtotal,
          itemsCount: cartItems.length,
          image: cartItems[0].image,
          items: cartItems,
          shippingDetails: tempShippingDetails
      };

      const updatedOrders = [newOrder, ...user.orders];
      
      // Award Points for Purchase
      const pointsEarned = Math.floor(subtotal * POINTS_PER_KWD);
      let newPoints = user.loyaltyPoints + pointsEarned;
      let newTier = user.tier;
      if (newPoints >= LOYALTY_TIERS.PLATINUM.min) newTier = 'PLATINUM';
      else if (newPoints >= LOYALTY_TIERS.GOLD.min) newTier = 'GOLD';

      // Update Stock for purchased items
      cartItems.forEach(item => {
          const currentStock = inventory[item.id] ?? 0;
          if (currentStock > 0) {
              handleUpdateStock(item.id, currentStock - 1);
          }
      });

      // Submit Data
      await submitOrder(newOrder);
      await updateUserPoints(user.id, newPoints, newTier);
      
      setUser({ 
          ...user, 
          orders: updatedOrders,
          loyaltyPoints: newPoints,
          tier: newTier
      });

      setCartItems([]);
      setTempShippingDetails(null);
      updateHash('account');
  };

  const handleTrackOrder = (order: Order) => {
      setTrackingOrder(order);
      updateHash('track-order');
  };

  const getFilteredProducts = (category: string) => {
    if (category === 'home') return PRODUCTS.slice(0, 6);
    return PRODUCTS.filter(p => 
        p.category === category.toUpperCase() || 
        p.category === 'UNISEX'
    );
  };

  const recentlyViewedProducts = recentlyViewedIds
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter((p): p is Product => !!p);

  const renderContent = () => {
    switch (currentView) {
        case 'men':
        case 'women':
        case 'kids':
        case 'collections':
            return (
                <CategoryView 
                    title={currentView === 'collections' ? 'Collections' : `${currentView.charAt(0).toUpperCase() + currentView.slice(1)}'s Collection`}
                    description="Engineered for the streets of Kuwait. Premium selection."
                    products={currentView === 'collections' ? PRODUCTS : getFilteredProducts(currentView)}
                    onAddToCart={openProductModal}
                    onProductClick={handleProductClick}
                    recentlyViewed={recentlyViewedProducts}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={handleToggleWishlist}
                    inventory={inventory}
                />
            );
        case 'customize':
            return <CustomizeView onAddToCart={handleAddToCart} />;
        case 'news':
            return <NewsView posts={BLOG_POSTS} onReadPost={handleReadPost} />;
        case 'wishlist':
            return (
                <WishlistView 
                    products={wishlistIds.map(id => PRODUCTS.find(p => p.id === id)).filter((p): p is Product => !!p)}
                    onProductClick={handleProductClick}
                    onAddToCart={openProductModal}
                    onToggleWishlist={handleToggleWishlist}
                    onExplore={() => updateHash('collections')}
                />
            );
        case 'post':
            if (!selectedPost) return null;
            return <BlogPostView post={selectedPost} onBack={() => updateHash('news')} />;
        case 'product':
            if (!selectedProduct) return null;
            return (
                <ProductView 
                    product={selectedProduct}
                    onAddToCart={handleAddToCart}
                    onBack={() => updateHash('home')}
                    recentlyViewed={recentlyViewedProducts.filter(p => p.id !== selectedProduct.id)}
                    onProductClick={handleProductClick}
                    isWishlisted={wishlistIds.includes(selectedProduct.id)}
                    onToggleWishlist={handleToggleWishlist}
                    reviews={reviews}
                    onAddReview={handleAddReview}
                    user={user}
                    inventory={inventory}
                />
            );
        case 'account':
            if (!user) {
                return (
                    <div className="h-screen flex flex-col items-center justify-center bg-[#EBEBE9] gap-4">
                        <p className="text-gray-500">Access your profile to continue.</p>
                        <button onClick={() => setIsAuthOpen(true)} className="px-8 py-3 bg-black text-white font-bold rounded-xl">Sign In</button>
                    </div>
                )
            }
            return (
                <AccountView 
                    user={user} 
                    onLogout={handleLogout} 
                    onTrackOrder={handleTrackOrder} 
                    onNavigate={(view) => updateHash(view)} 
                />
            );
        case 'admin':
            if (!user || !user.isAdmin) {
                updateHash('home');
                return null;
            }
            return (
                <AdminView 
                    inventory={inventory}
                    onUpdateStock={handleUpdateStock}
                />
            );
        case 'track-order':
            if (!trackingOrder) return null;
            return <TrackOrderView order={trackingOrder} onBack={() => updateHash('account')} />;
        case 'checkout':
            const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
            return (
                <CustomPaymentGateway 
                    amountKWD={subtotal} 
                    onSuccess={handlePaymentSuccess} 
                    onCancel={() => updateHash('home')}
                />
            );
        case 'home':
        default:
            return (
                <>
                    <Hero 
                        products={PRODUCTS.slice(0, 6)} 
                        onOpenModal={openProductModal} 
                        onProductClick={handleProductClick}
                        wishlistIds={wishlistIds}
                        onToggleWishlist={handleToggleWishlist}
                        inventory={inventory}
                    />
                    <Marquee />
                    <div className="container mx-auto px-6 md:px-12 py-12 md:py-20" ref={productSectionRef}>
                        <Showcase />
                        <div className="my-20 md:my-32">
                            <div className="max-w-4xl mx-auto">
                                <Stylist 
                                    products={PRODUCTS} 
                                    onRecommendations={handleRecommendations} 
                                    onProductClick={handleProductClick}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-300 pb-4 gap-4 grid-header">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-gray-900">Latest Arrivals</h2>
                                <p className="text-gray-500 mt-1 text-sm md:text-base">Fresh heat in Kuwait City.</p>
                            </div>
                            {highlightedIds.length > 0 && (
                                <button className="text-sm font-bold text-red-500 hover:text-red-700" onClick={() => setHighlightedIds([])}>
                                    Clear Filter
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 product-grid-container">
                            {PRODUCTS.map((product) => (
                                <div key={product.id} className="home-product-card">
                                    <ProductCard 
                                        product={product} 
                                        isHighlighted={highlightedIds.includes(product.id)}
                                        onAddToCart={openProductModal}
                                        onClick={() => handleProductClick(product)}
                                        isWishlisted={wishlistIds.includes(product.id)}
                                        onToggleWishlist={handleToggleWishlist}
                                        stock={inventory[product.id]}
                                    />
                                </div>
                            ))}
                        </div>
                        <News onViewAll={() => updateHash('news')} onReadPost={handleReadPost} />
                        {recentlyViewedProducts.length > 0 && (
                            <RecentlyViewed 
                                products={recentlyViewedProducts} 
                                onProductClick={handleProductClick} 
                                wishlistIds={wishlistIds}
                                onToggleWishlist={handleToggleWishlist}
                            />
                        )}
                        <Newsletter />
                    </div>
                </>
            );
    }
  };

  return (
      <div className="bg-[#EBEBE9] min-h-screen font-sans text-gray-900 selection:bg-accent selection:text-black">
        <Navbar 
          cartCount={cartItems.length} 
          onOpenCart={() => setIsCartOpen(true)} 
          currentView={currentView}
          onChangeView={(view) => updateHash(view)}
          onSearchClick={() => setIsSearchOpen(true)}
          user={user}
          onAuthClick={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          wishlistCount={wishlistIds.length}
        />
        
        {renderContent()}

        {user && currentView === 'home' && !user.isAdmin && (
            <LoyaltyBadge 
              points={user.loyaltyPoints} 
              tier={user.tier} 
              onClick={() => updateHash('account')} 
            />
        )}

        <footer className="mt-0 border-t border-gray-300 pt-10 pb-6 text-center bg-[#EBEBE9]">
              <h1 className="font-display text-4xl uppercase mb-4 text-gray-400">Sands & Souls</h1>
              <p className="text-xs text-gray-500 tracking-widest uppercase">Al Hamra Tower, Kuwait City</p>
              <div className="flex justify-center gap-4 mt-4 text-sm font-bold text-gray-600">
                  <button onClick={() => updateHash('home')} className="hover:text-black">HOME</button>
                  <a href="#" className="hover:text-black">INSTAGRAM</a>
                  <a href="#" className="hover:text-black">TIKTOK</a>
              </div>
              <p className="text-[10px] text-gray-400 mt-8">© 2024 Sands & Souls. All rights reserved.</p>
        </footer>

        <ProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          product={selectedProduct} 
          onAddToCart={handleAddToCart}
        />

        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cartItems} 
          onRemove={handleRemoveFromCart} 
          onCheckout={handleCheckoutStart}
          user={user}
        />

        <SearchOverlay 
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          products={PRODUCTS}
          onProductClick={handleProductClick}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />

        <AuthModal 
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        <ShippingModal 
            isOpen={shippingModalOpen}
            onClose={() => setShippingModalOpen(false)}
            onSubmit={handleShippingSubmit}
        />
      </div>
  );
};

export default App;

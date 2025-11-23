
import { Product, BlogPost, LoyaltyTier } from './types';

// Stripe Configuration
export const STRIPE_PK = "pk_test_51SOWIQPyOZptftV9aCt8dZDOadpv99Id6zjefhqteI6z4JGwYkVw0J668ufmeiOYvOhgub1W3oLZjxn2VHMlCcph00VGEP6Vls";
export const KWD_TO_USD_RATE = 3.25;

// Loyalty Configuration
export const POINTS_PER_KWD = 10; // Earn 10 points for every 1 KWD spent
export const REDEMPTION_RATE = 100; // 100 Points = 1 KWD Discount
export const POINTS_PER_REVIEW = 50; // Points earned per review
export const POINTS_PER_REFERRAL = 250; // Points earned per referral

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Air Max 95 OG',
    brand: 'Nike',
    price: 55.000,
    image: 'https://newcop.com/cdn/shop/files/air-max-95-levis-denim-01.webp?v=1752590301',
    description: 'The legend returns. The Nike Air Max 95 OG Neon features the classic gradient grey upper with neon yellow accents that defined a generation.',
    tags: ['running', 'classic', 'neon'],
    color: 'Black/Neon',
    category: 'MEN'
  },
  {
    id: '2',
    name: 'Yeezy Boost 350',
    brand: 'Adidas',
    price: 120.000,
    image: 'https://solehub.cz/cdn/shop/files/1ae3hzdaxc2k4hachi8saivfmr3s.png?v=1759925167&width=1946',
    description: 'The Yeezy Boost 350 V2 Sesame features a neutral color palette ideal for the sandy tones of Kuwait.',
    tags: ['hype', 'comfort', 'minimal'],
    color: 'Sesame',
    category: 'UNISEX'
  },
  {
    id: '3',
    name: 'Jordan 1 High',
    brand: 'Jordan',
    price: 65.000,
    image: 'https://newcop.com/cdn/shop/files/air-jordan-1-retro-high-og-black-white3.png?v=1714395270',
    description: 'Fresh colours for the desert heat. The Air Jordan 1 University Blue pays homage to MJ\'s alma mater.',
    tags: ['basketball', 'retro', 'streetwear'],
    color: 'University Blue',
    category: 'MEN'
  },
  {
    id: '4',
    name: 'New Balance 550',
    brand: 'New Balance',
    price: 45.000,
    image: 'https://www.theatticstreetwear.com/cdn/shop/files/New_Balance_550_Vintage_Teal_the_attic.png?v=1761738870',
    description: 'The return of a legend. Simple, clean, and authentic to the late 80s basketball scene.',
    tags: ['casual', 'retro', 'clean'],
    color: 'White/Green',
    category: 'WOMEN'
  },
  {
    id: '5',
    name: 'Dunk Low Retro',
    brand: 'Nike',
    price: 38.000,
    image: 'https://parkaccess.com.ph/cdn/shop/files/AURORA_HF5441-107_PHSLH001-2000.png?v=1757001411',
    description: 'The Panda Dunk. Essential for every rotation. Clean black and white colorway that goes with everything.',
    tags: ['streetwear', 'essential', 'flat'],
    color: 'Black/White',
    category: 'KIDS'
  },
  {
    id: '6',
    name: 'Ultraboost 1.0',
    brand: 'Adidas',
    price: 50.000,
    image: 'https://www.sneakerjagers.com/_next/image?url=https%3A%2F%2Fstatic.sneakerjagers.com%2Fp%2FkTe8b21cDNOAWNIzTdcvcaqF22JQMevgrxcERDoX.png&w=3840&q=100',
    description: 'The original cream Ultraboost. Unmatched comfort and a colorway that perfectly matches the Sands & Souls aesthetic.',
    tags: ['running', 'comfort', 'cream'],
    color: 'Cream',
    category: 'WOMEN'
  },
  // New Products
  {
    id: '7',
    name: 'Air Force 1 Shadow',
    brand: 'Nike',
    price: 42.000,
    image: 'https://www.nike.com.kw/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dwdf7f44fe/nk/36a/3/6/5/4/7/36a36547_edce_473b_8ad4_6cee235fa572.png?sw=700&sh=700&sm=fit&q=100&strip=false',
    description: 'Double the branding, double the fun. The Air Force 1 Shadow puts a playful twist on a classic b-ball design.',
    tags: ['casual', 'chunky', 'pastel'],
    color: 'Pastel/White',
    category: 'WOMEN'
  },
  {
    id: '8',
    name: 'Gazelle Indoor',
    brand: 'Adidas',
    price: 35.000,
    image: 'https://addictsneakers.com/cdn/shop/products/adidas-gazelle-indoor-preloved-blue-white-gum-3.png?height=742&v=1757499193',
    description: 'A low-profile classic reborn. The Gazelle Indoor brings vintage vibes with a premium suede upper.',
    tags: ['retro', 'suede', 'casual'],
    color: 'Blue Fusion',
    category: 'MEN'
  },
  {
    id: '9',
    name: 'Jordan 4 Retro GS',
    brand: 'Jordan',
    price: 48.000,
    image: 'https://www.kickgame.com/cdn/shop/products/air-jordan-4-retro-gs-thunder-2023-408452-017.png?v=1699020074',
    description: 'Scaled down for the next generation of high flyers. The Jordan 4 Retro delivers iconic style and support.',
    tags: ['kids', 'basketball', 'icon'],
    color: 'Thunder',
    category: 'KIDS'
  },
  {
    id: '10',
    name: 'Samba OG',
    brand: 'Adidas',
    price: 32.000,
    image: 'https://newcop.com/cdn/shop/files/SambaOGCloudWhite_2000x_d8e9e346-2303-4a1d-89ee-20da55a59621.webp?v=1682787407',
    description: 'Born on the pitch, worn on the street. The Samba OG is a timeless icon of street style.',
    tags: ['classic', 'football', 'street'],
    color: 'White/Black',
    category: 'UNISEX'
  },
  {
    id: '11',
    name: '9060',
    brand: 'New Balance',
    price: 58.000,
    image: 'https://cdn.shopify.com/s/files/1/2358/2817/products/new-balance-9060-sea-salt-white-4.png?v=1675869643',
    description: 'The 9060 reinterprets familiar elements from the classic 99X series with a warped sensibility.',
    tags: ['chunky', 'comfort', 'modern'],
    color: 'Sea Salt',
    category: 'MEN'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "Top 5 Spots to Flex in Kuwait City",
    date: "Oct 24, 2024",
    image: "https://images.unsplash.com/photo-1512007387089-9bb9e66731bb?q=80&w=2500&auto=format&fit=crop",
    category: "LIFESTYLE",
    excerpt: "From the Avenues to Al Shaheed Park, here are the best backdrops for your fit pics.",
    author: "Ahmad Al-Salem",
    content: [
      "Kuwait City is a blend of modern architecture and traditional heritage, making it one of the most photogenic cities in the Gulf. If you've just copped a fresh pair from Sands & Souls, you need the right background to do them justice.",
      "1. **Al Shaheed Park**: The greenery contrasts perfectly with urban streetwear. The concrete structures near the museums offer a brutalist vibe that works well with chunky silhouettes like the New Balance 9060.",
      "2. **The Avenues (Grand Avenue)**: Natural light, high ceilings, and a bustling atmosphere. It's the runway of Kuwait. Perfect for flexing high-end drops like the Yeezy Boost.",
      "3. **Kuwait Towers**: A classic. Go at sunset for that golden hour glow against the blue mosaic tiles.",
      "Remember, the shoes make the outfit, but the location makes the shot."
    ]
  },
  {
    id: '2',
    title: "Suede Care Guide: Keep 'Em Fresh",
    date: "Oct 20, 2024",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2670&auto=format&fit=crop",
    category: "HOW-TO",
    excerpt: "Dust and sand are the enemies. Learn how to protect your Gazelles and Sambas.",
    author: "Sarah J.",
    content: [
      "Living in a desert climate means dust is inevitable. For sneakerheads who love suede—like on the new Adidas Gazelle Indoor or the Air Max 95s—maintenance is key.",
      "**The Brush is Your Best Friend**: Invest in a high-quality suede brush. Brush gently in one direction to remove surface dust. For matted suede, brush vigorously back and forth to lift the nap.",
      "**Erasers work magic**: For scuffs that won't budge, a white pencil eraser can often lift the mark without damaging the dye.",
      "**Waterproof Spray**: Before you even wear them out, hit them with a coat of repellent. It won't stop a sandstorm, but it will help prevent liquid stains from your iced latte."
    ]
  },
  {
    id: '3',
    title: "Upcoming Drops: Winter Heat 2024",
    date: "Oct 15, 2024",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=2574&auto=format&fit=crop",
    category: "NEWS",
    excerpt: "A sneak peek at what's landing at Sands & Souls this holiday season.",
    author: "The S&S Team",
    content: [
      "As the weather cools down, the heat turns up. We have confirmed shipments arriving throughout November and December.",
      "Expect to see more colorways of the **Jordan 4**, arguably the silhouette of the year. We are also restocking the essentials: Dunk Lows in classic two-tone makeups.",
      "For the luxury lovers, we have a special collaboration landing soon. We can't say much yet, but let's just say it involves a certain Japanese designer and a swoosh.",
      "Stay locked to our newsletter for the exact dates. Members get 24-hour early access."
    ]
  },
  {
    id: '4',
    title: "The Rise of New Balance in the Middle East",
    date: "Oct 10, 2024",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=2612&auto=format&fit=crop",
    category: "INDUSTRY",
    excerpt: "How the 'Dad Shoe' became the ultimate status symbol in the region.",
    author: "Fahad K.",
    content: [
      "A decade ago, New Balance was seen as purely functional. Today, it's the uniform of the creative class in Kuwait, Dubai, and Riyadh.",
      "The shift began with the 990 series gaining cult status, but the introduction of the 550 and 9060 blew the doors open. The comfort is unmatched, which is crucial for long days at the mall or the office.",
      "At Sands & Souls, we've seen sales of NB rise by 200% year over year. It's not just a trend anymore; it's a staple."
    ]
  }
];

export const LOYALTY_TIERS = {
  SILVER: { min: 0, max: 499, color: '#A8A79E', benefits: ['Member-only Newsletter', 'Birthday Gift'] },
  GOLD: { min: 500, max: 1499, color: '#FDB913', benefits: ['Free Shipping', 'Early Access to Drops', '5% off Custom Orders'] },
  PLATINUM: { min: 1500, max: Infinity, color: '#E5E4E2', benefits: ['Priority Delivery', 'Dedicated Stylist', '15% off Everything', 'Invites to Private Events'] }
};


import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { User, CartItem, LoyaltyTier, Order, Review } from '../types';

// --- CONFIGURATION START ---
const firebaseConfig = {
  apiKey: "AIzaSyCDrKWHsVX8KRLVC91pJDkV1byGbKlFYPs",
  authDomain: "sandsandsouls-1.firebaseapp.com",
  projectId: "sandsandsouls-1",
  storageBucket: "sandsandsouls-1.firebasestorage.app",
  messagingSenderId: "75541606500",
  appId: "1:75541606500:web:0badac3cf62a659e6b6f71",
  measurementId: "G-5LL6VVT2T7"
};
// --- CONFIGURATION END ---

// Initialize Firebase safely using Modular SDK
let app;
let auth: any = null;
let db: any = null;

try {
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
    
    // Initialize services ensuring they are attached to the specific app instance
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase Initialized Successfully");
    
} catch (error) {
    console.error("Firebase Initialization Critical Error:", error);
}

// Helper to format Firebase User to App User
const formatUser = (fbUser: FirebaseUser, data?: any): User => {
  return {
    id: fbUser.uid,
    name: fbUser.displayName || data?.name || (fbUser.isAnonymous ? 'Guest User' : 'Sneakerhead'),
    email: fbUser.email || '',
    avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
    savedCart: data?.savedCart || [],
    savedHistory: data?.savedHistory || [],
    wishlist: data?.wishlist || [],
    orders: data?.orders || [],
    loyaltyPoints: (data && data.loyaltyPoints !== undefined) ? data.loyaltyPoints : 0,
    tier: (data && data.tier) ? data.tier : 'SILVER',
    isAdmin: fbUser.email === 'admin@sandsandsouls.com'
  };
};

// Helper to handle DB errors gracefully but NOT disable DB permanently
const handleDbError = (e: any, uid?: string) => {
    console.warn("Firestore Error (Falling back to local):", e.message);
    return false;
};

// LOCAL STORAGE FALLBACK HELPERS
const getLocalUserData = (uid: string) => {
    try {
        const data = localStorage.getItem(`user_data_${uid}`);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
};

const saveLocalUserData = (uid: string, data: any) => {
    try {
        localStorage.setItem(`user_data_${uid}`, JSON.stringify(data));
    } catch (e) {
        console.error("Local Storage Error:", e);
    }
};

// --- AUTH METHODS ---

export const loginUser = async (email: string, password: string): Promise<User> => {
  if (!auth) throw new Error("Authentication service not initialized.");
  
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return handleAuthSuccess(userCredential.user);
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  if (!auth) throw new Error("Authentication service not initialized.");

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const fbUser = userCredential.user;

  if (fbUser) {
      await updateProfile(fbUser, { displayName: name });
  }

  return initializeNewUser(fbUser, name, email);
};

export const loginWithGoogle = async (): Promise<User> => {
    if (!auth) throw new Error("Authentication service not initialized.");
    const provider = new GoogleAuthProvider();
    
    try {
        const result = await signInWithPopup(auth, provider);
        const fbUser = result.user;
        
        // Check if first time login by checking DB
        let existingData = null;
        if (db) {
             try {
                const docRef = doc(db, "users", fbUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    existingData = docSnap.data();
                }
             } catch (e) {
                 handleDbError(e);
             }
        }

        if (existingData) {
            saveLocalUserData(fbUser.uid, existingData);
            return formatUser(fbUser, existingData);
        } else {
            // New Google User
            return initializeNewUser(fbUser, fbUser.displayName || 'Google User', fbUser.email || '');
        }

    } catch (error) {
        console.error("Google Login Error:", error);
        throw error;
    }
};

export const loginAnonymously = async (): Promise<User> => {
    if (!auth) throw new Error("Authentication service not initialized.");
    
    try {
        const result = await signInAnonymously(auth);
        return initializeNewUser(result.user, 'Guest User', '');
    } catch (error) {
        console.error("Anonymous Login Error:", error);
        throw error;
    }
};

// --- HELPER: Initialize New User Data ---
const initializeNewUser = async (fbUser: FirebaseUser, name: string, email: string): Promise<User> => {
  const initialData = {
    name,
    email,
    savedCart: [],
    savedHistory: [],
    wishlist: [],
    orders: [],
    loyaltyPoints: 0,
    tier: 'SILVER' as LoyaltyTier,
    createdAt: new Date().toISOString()
  };
  
  // 1. Try Firestore
  if (db) {
      try {
        await setDoc(doc(db, "users", fbUser.uid), initialData);
      } catch (e) {
         handleDbError(e);
      }
  }
  
  // 2. Always save to Local Storage as backup
  saveLocalUserData(fbUser.uid, initialData);

  return formatUser(fbUser, initialData);
};

// --- HELPER: Handle Existing User Login ---
const handleAuthSuccess = async (fbUser: FirebaseUser): Promise<User> => {
  let userData = {};
  let fetchedFromDb = false;
  
  if (db) {
      try {
        const docRef = doc(db, "users", fbUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            userData = docSnap.data();
            fetchedFromDb = true;
            saveLocalUserData(fbUser.uid, userData);
        }
      } catch (e) {
        handleDbError(e, fbUser.uid);
      }
  }

  if (!fetchedFromDb) {
      const localData = getLocalUserData(fbUser.uid);
      if (localData) {
          userData = localData;
      }
  }

  return formatUser(fbUser, userData);
};

export const logoutUser = async (): Promise<void> => {
  if (!auth) return;
  await signOut(auth);
};

export const syncUserData = async (
    userId: string, 
    cart: CartItem[], 
    history: string[], 
    wishlist: string[], 
    orders?: Order[],
    loyaltyPoints?: number,
    tier?: LoyaltyTier
): Promise<void> => {
  
  const existingData = getLocalUserData(userId) || {};

  const payload: any = { 
    ...existingData, 
    savedCart: cart,
    savedHistory: history,
    wishlist: wishlist,
    lastActive: new Date().toISOString()
  };

  if (orders) payload.orders = orders;
  if (loyaltyPoints !== undefined) payload.loyaltyPoints = loyaltyPoints;
  if (tier) payload.tier = tier;
  
  saveLocalUserData(userId, payload);

  if (!db || !userId) return;
  
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, payload, { merge: true });
  } catch (e) {
    handleDbError(e);
  }
};

export const updateUserPoints = async (userId: string, newPoints: number, tier: LoyaltyTier) => {
    const payload = { loyaltyPoints: newPoints, tier: tier };
    
    const localData = getLocalUserData(userId);
    if (localData) {
        localData.loyaltyPoints = newPoints;
        localData.tier = tier;
        saveLocalUserData(userId, localData);
    }

    if (db) {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, payload);
        } catch(e) {
            handleDbError(e);
        }
    }
};

// --- GLOBAL ORDER MANAGEMENT (ADMIN) ---

export const submitOrder = async (order: Order) => {
    // 1. Local Backup (for admin view simulation on same device)
    try {
        const allOrders = JSON.parse(localStorage.getItem('admin_all_orders') || '[]');
        allOrders.push(order);
        localStorage.setItem('admin_all_orders', JSON.stringify(allOrders));
    } catch(e) {}

    // 2. Firestore Global Collection
    if (db) {
        try {
            await setDoc(doc(db, "orders", order.id), order);
        } catch(e) {
            handleDbError(e);
        }
    }
};

export const getAllOrders = async (): Promise<Order[]> => {
    let orders: Order[] = [];

    // 1. Try Firestore
    if (db) {
        try {
            const q = query(collection(db, "orders"), orderBy("id", "desc"));
            const snap = await getDocs(q);
            snap.forEach(doc => orders.push(doc.data() as Order));
        } catch (e) {
            handleDbError(e);
        }
    }

    // 2. Fallback to Local Storage if Firestore failed or empty (and we have local data)
    if (orders.length === 0) {
         try {
            const localOrders = localStorage.getItem('admin_all_orders');
            if (localOrders) {
                orders = JSON.parse(localOrders);
            }
         } catch(e) {}
    }
    
    return orders;
};

// --- INVENTORY MANAGEMENT ---

export const getInventory = async (): Promise<Record<string, number>> => {
    let inventory: Record<string, number> = {};

    // 1. Try Local Storage First (for speed/offline)
    try {
        const localInv = localStorage.getItem('inventory_data');
        if (localInv) {
            inventory = JSON.parse(localInv);
        }
    } catch (e) {}

    // 2. Try Firestore to get latest
    if (db) {
        try {
            const querySnapshot = await getDocs(collection(db, "inventory"));
            const cloudInv: Record<string, number> = {};
            querySnapshot.forEach((doc) => {
                cloudInv[doc.id] = doc.data().stock;
            });
            
            if (Object.keys(cloudInv).length > 0) {
                inventory = cloudInv;
                localStorage.setItem('inventory_data', JSON.stringify(inventory));
            }
        } catch(e) {
            handleDbError(e);
        }
    }

    return inventory;
};

export const updateProductStock = async (productId: string, stock: number) => {
    // 1. Update Local
    try {
        const localInv = JSON.parse(localStorage.getItem('inventory_data') || '{}');
        localInv[productId] = stock;
        localStorage.setItem('inventory_data', JSON.stringify(localInv));
    } catch(e) {}

    // 2. Update Firestore
    if (db) {
        try {
            const docRef = doc(db, "inventory", productId);
            await setDoc(docRef, { stock }, { merge: true });
        } catch (e) {
            handleDbError(e);
        }
    }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  if (!auth) return () => {};
  
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
       await handleAuthSuccess(fbUser).then(user => callback(user));
    } else {
      callback(null);
    }
  });
};

// --- REVIEW SYSTEM ---

export const addReview = async (review: Review) => {
    // 1. Local Storage (Offline-first approach)
    try {
        const localReviews = JSON.parse(localStorage.getItem('app_reviews') || '[]');
        localReviews.push(review);
        localStorage.setItem('app_reviews', JSON.stringify(localReviews));
    } catch (e) {
        console.error("Local Review Error:", e);
    }

    // 2. Firestore (Async sync)
    if (db) {
        try {
            await addDoc(collection(db, "reviews"), review);
        } catch (e) {
            handleDbError(e);
        }
    }
};

export const getReviews = async (): Promise<Review[]> => {
    let reviews: Review[] = [];
    
    // 1. Try Local Storage first for speed
    try {
        const localData = localStorage.getItem('app_reviews');
        if (localData) {
            reviews = JSON.parse(localData);
        }
    } catch (e) {}

    // 2. Try fetching fresh from Firestore if connected
    if (db) {
        try {
            const q = query(collection(db, "reviews"), orderBy("date", "desc"));
            const querySnapshot = await getDocs(q);
            const cloudReviews: Review[] = [];
            querySnapshot.forEach((doc) => {
                cloudReviews.push(doc.data() as Review);
            });
            if (cloudReviews.length > 0) {
                reviews = cloudReviews; // Source of truth
                localStorage.setItem('app_reviews', JSON.stringify(reviews)); // Sync back to local
            }
        } catch (e) {
            handleDbError(e);
        }
    }
    return reviews;
};

import { create } from 'zustand';
import { api } from '@/lib/mongodb';

export interface Product {
  id: string;
  name: string;
  category: 'food' | 'medicine' | 'cosmetic' | 'other';
  expiryDate: string;
  status: 'active' | 'soon-expiring' | 'expired';
  imageUrl?: string;
  nutrients?: any;
  brand?: string;
  barcode?: string;
  ingredients?: string;
  addedDate: string;
  daysUntilExpiry: number;
}

export interface DonationItem {
  id: string;
  product: Product;
  donatedBy: string;
  location: string;
  contactInfo: string;
  isAvailable: boolean;
}

export interface User {
  id: string;
  email: string;
  token: string;
  profile?: {
    name: string;
    phone?: string;
    dateOfBirth?: string;
    healthConditions: string[];
    allergies: string[];
    dietaryPreferences: string[];
    isProfileComplete: boolean;
  };
}

interface ProductStore {
  products: Product[];
  donations: DonationItem[];
  theme: 'dark' | 'light';
  loading: boolean;
  user: User | null;
  showProfileSetup: boolean;
  showAuthModal: boolean;
  init: () => void;
  addProduct: (product: Omit<Product, 'id' | 'addedDate' | 'daysUntilExpiry'>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  addDonation: (donation: Omit<DonationItem, 'id'>) => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchDonations: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (profile: any) => Promise<void>;
  setShowProfileSetup: (show: boolean) => void;
  setShowAuthModal: (show: boolean) => void;
  toggleTheme: () => void;
  calculateStatus: (expiryDate: string) => Product['status'];
  calculateDaysUntilExpiry: (expiryDate: string) => number;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  donations: [],
  theme: 'dark',
  loading: false,
  user: null,
  showProfileSetup: false,
  showAuthModal: false,

  // Initialize auth state
  init: () => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user: { ...user, token } });
        get().fetchProducts();
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  },

  addProduct: async (productData) => {
    const { user } = get();
    if (!user) throw new Error('User must be logged in');

    set({ loading: true });
    
    try {
      const response = await api.post('/products', {
        name: productData.name,
        category: productData.category,
        expiryDate: productData.expiryDate,
        imageUrl: productData.imageUrl,
        nutrients: productData.nutrients,
        brand: productData.brand,
        barcode: productData.barcode,
        ingredients: productData.ingredients,
      });

      const product: Product = response.data;

      set((state) => ({
        products: [...state.products, product],
        loading: false,
      }));
    } catch (error: any) {
      set({ loading: false });
      throw new Error(error.response?.data?.error || 'Failed to add product');
    }
  },

  removeProduct: async (id) => {
    set({ loading: true });
    
    try {
      await api.delete(`/products/${id}`);

      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ loading: false });
      throw new Error(error.response?.data?.error || 'Failed to remove product');
    }
  },

  updateProduct: async (id, updates) => {
    set({ loading: true });
    
    try {
      const response = await api.put(`/products/${id}`, updates);
      const updatedProduct: Product = response.data;

      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? updatedProduct : p
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ loading: false });
      throw new Error(error.response?.data?.error || 'Failed to update product');
    }
  },

  addDonation: async (donationData) => {
    set({ loading: true });
    
    try {
      const response = await api.post('/donations', {
        productId: donationData.product.id,
        donatedBy: donationData.donatedBy,
        location: donationData.location,
        contactInfo: donationData.contactInfo,
      });

      const donation: DonationItem = response.data;

      set((state) => ({
        donations: [...state.donations, donation],
        loading: false,
      }));
    } catch (error: any) {
      set({ loading: false });
      throw new Error(error.response?.data?.error || 'Failed to add donation');
    }
  },

  fetchProducts: async () => {
    const { user } = get();
    if (!user) return;

    set({ loading: true });

    try {
      const response = await api.get('/products');
      const products: Product[] = response.data;

      set({ products, loading: false });
    } catch (error: any) {
      set({ loading: false });
      console.error('Failed to fetch products:', error.response?.data?.error || error.message);
    }
  },

  fetchDonations: async () => {
    set({ loading: true });

    try {
      const response = await api.get('/donations');
      const donations: DonationItem[] = response.data;

      set({ donations, loading: false });
    } catch (error: any) {
      set({ loading: false });
      console.error('Failed to fetch donations:', error.response?.data?.error || error.message);
    }
  },

  signIn: async (email, password) => {
    set({ loading: true });
    
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      const needsProfileSetup = !user.profile?.isProfileComplete;
      
      set({ 
        user: { ...user, token }, 
        loading: false,
        showProfileSetup: needsProfileSetup,
        showAuthModal: false
      });
      
      if (!needsProfileSetup) {
        get().fetchProducts();
      }
    } catch (error: any) {
      set({ loading: false });
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  signUp: async (email, password) => {
    set({ loading: true });
    
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
      });

      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ 
        user: { ...user, token }, 
        loading: false, 
        showProfileSetup: true,
        showAuthModal: false
      });
    } catch (error: any) {
      set({ loading: false });
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  signOut: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    set({ user: null, products: [], donations: [], loading: false, showProfileSetup: false });
  },

  updateProfile: async (profileData) => {
    const { user } = get();
    if (!user) throw new Error('User must be logged in');

    set({ loading: true });
    
    try {
      const response = await api.put('/auth/profile', profileData);
      const updatedUserData = response.data.user;
      
      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      set({ 
        user: { ...user, profile: updatedUserData.profile }, 
        loading: false,
        showProfileSetup: false
      });
      
      get().fetchProducts();
    } catch (error: any) {
      set({ loading: false });
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  },

  setShowProfileSetup: (show) => {
    set({ showProfileSetup: show });
  },

  setShowAuthModal: (show) => {
    set({ showAuthModal: show });
  },

  toggleTheme: () => {
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    }));
  },

  calculateDaysUntilExpiry: (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  calculateStatus: (expiryDate: string) => {
    const daysUntilExpiry = get().calculateDaysUntilExpiry(expiryDate);
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 7) return 'soon-expiring';
    return 'active';
  },
}));
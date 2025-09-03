import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  category: 'food' | 'medicine' | 'cosmetic' | 'other';
  expiryDate: string;
  status: 'active' | 'soon-expiring' | 'expired';
  imageUrl?: string;
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

interface ProductStore {
  products: Product[];
  donations: DonationItem[];
  theme: 'dark' | 'light';
  addProduct: (product: Omit<Product, 'id' | 'addedDate' | 'daysUntilExpiry'>) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addDonation: (donation: Omit<DonationItem, 'id'>) => void;
  toggleTheme: () => void;
  calculateStatus: (expiryDate: string) => Product['status'];
  calculateDaysUntilExpiry: (expiryDate: string) => number;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  donations: [],
  theme: 'dark',

  addProduct: (productData) => {
    const id = Date.now().toString();
    const addedDate = new Date().toISOString();
    const daysUntilExpiry = get().calculateDaysUntilExpiry(productData.expiryDate);
    const status = get().calculateStatus(productData.expiryDate);
    
    const product: Product = {
      ...productData,
      id,
      addedDate,
      daysUntilExpiry,
      status,
    };

    set((state) => ({
      products: [...state.products, product],
    }));
  },

  removeProduct: (id) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              daysUntilExpiry: updates.expiryDate
                ? get().calculateDaysUntilExpiry(updates.expiryDate)
                : p.daysUntilExpiry,
              status: updates.expiryDate
                ? get().calculateStatus(updates.expiryDate)
                : p.status,
            }
          : p
      ),
    }));
  },

  addDonation: (donationData) => {
    const id = Date.now().toString();
    const donation: DonationItem = {
      ...donationData,
      id,
    };

    set((state) => ({
      donations: [...state.donations, donation],
    }));
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
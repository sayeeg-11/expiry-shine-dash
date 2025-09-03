import { Product, DonationItem } from '@/store/useProductStore';

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Organic Milk",
    category: "food",
    expiryDate: "2025-01-15",
    status: "soon-expiring",
    addedDate: "2025-01-01T00:00:00Z",
    daysUntilExpiry: 12,
    imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop"
  },
  {
    id: "2", 
    name: "Vitamin D Tablets",
    category: "medicine",
    expiryDate: "2025-06-20",
    status: "active",
    addedDate: "2024-12-15T00:00:00Z",
    daysUntilExpiry: 168,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop"
  },
  {
    id: "3",
    name: "Anti-Aging Serum",
    category: "cosmetic", 
    expiryDate: "2024-12-25",
    status: "expired",
    addedDate: "2024-06-01T00:00:00Z",
    daysUntilExpiry: -8,
    imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop"
  },
  {
    id: "4",
    name: "Greek Yogurt",
    category: "food",
    expiryDate: "2025-01-10",
    status: "soon-expiring",
    addedDate: "2025-01-05T00:00:00Z",
    daysUntilExpiry: 7,
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop"
  },
  {
    id: "5",
    name: "Cough Syrup",
    category: "medicine",
    expiryDate: "2025-03-15",
    status: "active", 
    addedDate: "2024-11-20T00:00:00Z",
    daysUntilExpiry: 72,
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop"
  },
  {
    id: "6",
    name: "Face Moisturizer",
    category: "cosmetic",
    expiryDate: "2025-08-30",
    status: "active",
    addedDate: "2024-12-01T00:00:00Z",
    daysUntilExpiry: 240,
    imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop"
  }
];

export const mockDonations: DonationItem[] = [
  {
    id: "d1",
    product: {
      id: "p1",
      name: "Protein Bars (Box of 12)",
      category: "food",
      expiryDate: "2025-02-10",
      status: "active",
      addedDate: "2024-12-20T00:00:00Z",
      daysUntilExpiry: 38,
      imageUrl: "https://images.unsplash.com/photo-1581368076903-c20fee7a18d5?w=400&h=300&fit=crop"
    },
    donatedBy: "Sarah M.",
    location: "Downtown Seattle",
    contactInfo: "sarah.m@email.com",
    isAvailable: true
  },
  {
    id: "d2",
    product: {
      id: "p2",
      name: "Multivitamins",
      category: "medicine",
      expiryDate: "2025-12-15",
      status: "active",
      addedDate: "2024-12-18T00:00:00Z",
      daysUntilExpiry: 350,
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
    },
    donatedBy: "Medical Clinic",
    location: "Capitol Hill",
    contactInfo: "donations@clinic.org",
    isAvailable: true
  },
  {
    id: "d3",
    product: {
      id: "p3",
      name: "Unused Skincare Set",
      category: "cosmetic",
      expiryDate: "2025-09-20",
      status: "active",
      addedDate: "2024-12-22T00:00:00Z",
      daysUntilExpiry: 264,
      imageUrl: "https://images.unsplash.com/photo-1570194065650-d99c79b4d09b?w=400&h=300&fit=crop"
    },
    donatedBy: "Emma K.",
    location: "Fremont",
    contactInfo: "emma.k@email.com",
    isAvailable: true
  }
];

export const categoryIcons = {
  food: "🍎",
  medicine: "💊", 
  cosmetic: "🧴",
  other: "📦"
};

export const statusColors = {
  active: "success",
  "soon-expiring": "warning", 
  expired: "destructive"
} as const;
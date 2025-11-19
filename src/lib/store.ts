// Enhanced store for cart management and product catalog
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Import product images - Fabric Collection


export interface ProductColor {
  name: string;
  value: string;
  images: string[];
}

export interface FabricRequirement {
  size: string;
  meters: number;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  sizes: string[];
  colors: ProductColor[];
  fabricRequirements: FabricRequirement[];
  description: string;
  useCases?: string[];
  gender: 'men' | 'women' | 'unisex';
  isNewArrival?: boolean;
  isOnSale?: boolean;
  featured?: boolean;
  stock?: { [key: string]: number };
  rating?: number;
  reviewCount?: number;
}

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: ProductColor;
  selectedColorImage: string;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  orderDate: Date;
  estimatedDelivery: Date;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  orders: Order[];
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  gender: string[];
}

interface StoreState {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  searchQuery: string;
  orders: Order[];
  currentUser: User | null;
  checkoutStep: number;
  filters: FilterState;
  addToCart: (product: Product, size: string, color: ProductColor) => void;
  removeFromCart: (id: string, size: string, color: ProductColor) => void;
  updateQuantity: (id: string, size: string, color: ProductColor, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;
  getProductsByGender: (gender: 'men' | 'women') => Product[];
  getNewArrivals: () => Product[];
  getSaleProducts: () => Product[];
  getAccessories: () => Product[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistProducts: () => Product[];
  addToRecentlyViewed: (productId: string) => void;
  getRecentlyViewedProducts: () => Product[];
  setSearchQuery: (query: string) => void;
  searchProducts: (query?: string) => Product[];
  setFilters: (filters: FilterState) => void;
  getFilteredProducts: (baseProducts?: Product[]) => Product[];
  getAvailableCategories: (baseProducts?: Product[]) => string[];
  getAvailableSizes: (baseProducts?: Product[]) => string[];
  getAvailableColors: (baseProducts?: Product[]) => string[];
  getPriceRange: (baseProducts?: Product[]) => [number, number];
  clearFilters: () => void;
  getRecommendedProducts: (productId: string, limit?: number) => Product[];
  getUpsellProducts: () => Product[];
  setCheckoutStep: (step: number) => void;
  createOrder: (shippingInfo: ShippingInfo, paymentMethod: string) => string;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByEmail: (email: string) => Order[];
  createUser: (email: string, firstName: string, lastName: string) => User;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  resetStore: () => void;
}

// Enhanced product catalog - Professional Tailoring Collection
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Shirt Fabric',
    price: 899,
    image: '/assets/fabric-collection.jpg',
    category: 'Shirt',
    gender: 'men',
    sizes: ['2m', '2.5m', '3m', '3.5m', '4m'],
    stock: { '2m': 50, '2.5m': 45, '3m': 40, '3.5m': 35, '4m': 30 },
    rating: 4.9,
    reviewCount: 234,
    colors: [
      {
        name: 'White Cotton',
        value: '#FFFFFF',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      },
      {
        name: 'Sky Blue',
        value: '#87CEEB',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      },
      {
        name: 'Light Pink',
        value: '#FFB6C1',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      }
    ],
    fabricRequirements: [
      { size: 'S (36-38)', meters: 2, description: 'Small size chest 36-38 inches' },
      { size: 'M (39-41)', meters: 2.5, description: 'Medium size chest 39-41 inches' },
      { size: 'L (42-44)', meters: 3, description: 'Large size chest 42-44 inches' },
      { size: 'XL (45-47)', meters: 3.5, description: 'Extra Large chest 45-47 inches' },
      { size: 'XXL (48-50)', meters: 4, description: 'Double XL chest 48-50 inches' },
    ],
    description: 'Premium cotton fabric perfect for custom tailored shirts. Breathable and comfortable.',
    useCases: ['Formal shirts', 'Casual shirts', 'Business wear', 'Custom tailoring'],
    isNewArrival: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Luxury Pant Fabric',
    price: 1299,
    image: '/assets/fabric-collection.jpg',
    category: 'Pant',
    gender: 'men',
    sizes: ['2m', '2.5m', '3m', '3.5m'],
    stock: { '2m': 40, '2.5m': 50, '3m': 45, '3.5m': 35 },
    rating: 4.8,
    reviewCount: 189,
    colors: [
      {
        name: 'Charcoal Gray',
        value: '#36454F',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      },
      {
        name: 'Navy Blue',
        value: '#000080',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      },
      {
        name: 'Black',
        value: '#000000',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      }
    ],
    fabricRequirements: [
      { size: 'S (28-30)', meters: 2, description: 'Small waist 28-30 inches' },
      { size: 'M (32-34)', meters: 2.5, description: 'Medium waist 32-34 inches' },
      { size: 'L (36-38)', meters: 3, description: 'Large waist 36-38 inches' },
      { size: 'XL (40-42)', meters: 3.5, description: 'Extra Large waist 40-42 inches' },
    ],
    description: 'High-quality wool blend fabric for elegant tailored pants. Durable and wrinkle-resistant.',
    useCases: ['Formal pants', 'Business trousers', 'Dress pants', 'Professional wear'],
    featured: true,
  },
  {
    id: '3',
    name: 'Traditional Kurta Fabric',
    price: 1599,
    originalPrice: 1999,
    image: '/assets/fabric-collection.jpg',
    category: 'Kurta',
    gender: 'men',
    sizes: ['3m', '3.5m', '4m', '4.5m'],
    stock: { '3m': 60, '3.5m': 55, '4m': 50, '4.5m': 40 },
    rating: 4.7,
    reviewCount: 156,
    colors: [
      {
        name: 'Cream White',
        value: '#FFFDD0',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      },
      {
        name: 'Golden Beige',
        value: '#D4AF37',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      },
      {
        name: 'Royal Blue',
        value: '#4169E1',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      }
    ],
    fabricRequirements: [
      { size: 'S (36-38)', meters: 3, description: 'Small size chest 36-38 inches' },
      { size: 'M (39-41)', meters: 3.5, description: 'Medium size chest 39-41 inches' },
      { size: 'L (42-44)', meters: 4, description: 'Large size chest 42-44 inches' },
      { size: 'XL (45-47)', meters: 4.5, description: 'Extra Large chest 45-47 inches' },
    ],
    description: 'Finest cotton and silk blend for traditional kurtas. Perfect for festive occasions.',
    useCases: ['Festival wear', 'Wedding functions', 'Traditional events', 'Ethnic wear'],
    isNewArrival: true,
    featured: true,
  },
  {
    id: '4',
    name: 'Comfortable Pajama Fabric',
    price: 699,
    image: '/assets/fabric-collection.jpg',
    category: 'Pajama',
    gender: 'men',
    sizes: ['2m', '2.5m', '3m'],
    stock: { '2m': 70, '2.5m': 65, '3m': 55 },
    rating: 4.6,
    reviewCount: 142,
    colors: [
      {
        name: 'White',
        value: '#FFFFFF',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      },
      {
        name: 'Cream',
        value: '#FFFDD0',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      },
      {
        name: 'Light Gray',
        value: '#D3D3D3',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      }
    ],
    fabricRequirements: [
      { size: 'S (28-30)', meters: 2, description: 'Small waist 28-30 inches' },
      { size: 'M (32-34)', meters: 2.5, description: 'Medium waist 32-34 inches' },
      { size: 'L (36-40)', meters: 3, description: 'Large waist 36-40 inches' },
    ],
    description: 'Soft and breathable cotton fabric ideal for traditional pajamas. Maximum comfort.',
    useCases: ['Traditional wear', 'Festive occasions', 'Casual wear', 'Ethnic ensembles'],
    featured: true,
  },
  {
    id: '5',
    name: 'Premium Suit Fabric',
    price: 2499,
    originalPrice: 2999,
    image: '/assets/fabric-collection.jpg',
    category: 'Suit',
    gender: 'men',
    sizes: ['5m', '5.5m', '6m', '6.5m'],
    stock: { '5m': 30, '5.5m': 35, '6m': 40, '6.5m': 25 },
    rating: 4.9,
    reviewCount: 198,
    colors: [
      {
        name: 'Midnight Navy',
        value: '#191970',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      },
      {
        name: 'Charcoal',
        value: '#36454F',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      },
      {
        name: 'Jet Black',
        value: '#000000',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      }
    ],
    fabricRequirements: [
      { size: 'S (36-38)', meters: 5, description: 'Small size chest 36-38 inches (3-piece suit)' },
      { size: 'M (39-41)', meters: 5.5, description: 'Medium size chest 39-41 inches (3-piece suit)' },
      { size: 'L (42-44)', meters: 6, description: 'Large size chest 42-44 inches (3-piece suit)' },
      { size: 'XL (45-48)', meters: 6.5, description: 'Extra Large chest 45-48 inches (3-piece suit)' },
    ],
    description: 'Imported wool and cashmere blend for luxurious suits. Perfect drape and finish.',
    useCases: ['Business suits', 'Formal wear', 'Wedding suits', 'Corporate attire'],
    isOnSale: true,
    featured: true,
  },
  {
    id: '6',
    name: 'Elegant Koti Fabric',
    price: 999,
    image: '/assets/fabric-collection.jpg',
    category: 'Koti',
    gender: 'men',
    sizes: ['1.5m', '2m', '2.5m'],
    stock: { '1.5m': 45, '2m': 50, '2.5m': 40 },
    rating: 4.8,
    reviewCount: 167,
    colors: [
      {
        name: 'Deep Maroon',
        value: '#800000',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      },
      {
        name: 'Royal Blue',
        value: '#4169E1',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      },
      {
        name: 'Emerald Green',
        value: '#50C878',
        images: ['/assets/fabric-collection.jpg', '/assets/fabric-collection.jpg']
      }
    ],
    fabricRequirements: [
      { size: 'S (36-38)', meters: 1.5, description: 'Small size chest 36-38 inches' },
      { size: 'M (39-41)', meters: 2, description: 'Medium size chest 39-41 inches' },
      { size: 'L (42-46)', meters: 2.5, description: 'Large size chest 42-46 inches' },
    ],
    description: 'Rich brocade and silk fabric for traditional koti/waistcoat. Adds elegance to any outfit.',
    useCases: ['Wedding wear', 'Traditional functions', 'Festive occasions', 'Ethnic styling'],
    featured: true,
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      cart: [],
      wishlist: [],
      recentlyViewed: [],
      searchQuery: '',
      orders: [],
      currentUser: null,
      checkoutStep: 0,
      filters: {
        categories: [],
        priceRange: [0, 2000],
        sizes: [],
        colors: [],
        gender: []
      },
      
      addToCart: (product, size, color) => {
        const existingItem = get().cart.find(
          item => item.id === product.id && item.selectedSize === size && item.selectedColor.name === color.name
        );
        
        const selectedColorImage = color.images && color.images.length > 0 ? color.images[0] : product.image;
        
        if (existingItem) {
          set(state => ({
            cart: state.cart.map(item =>
              item.id === product.id && item.selectedSize === size && item.selectedColor.name === color.name
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          }));
        } else {
          set(state => ({
            cart: [...state.cart, { ...product, quantity: 1, selectedSize: size, selectedColor: color, selectedColorImage }]
          }));
        }
      },
      
      removeFromCart: (id, size, color) => {
        set(state => ({
          cart: state.cart.filter(
            item => !(item.id === id && item.selectedSize === size && item.selectedColor.name === color.name)
          )
        }));
      },
      
      updateQuantity: (id, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id, size, color);
          return;
        }
        
        set(state => ({
          cart: state.cart.map(item =>
            item.id === id && item.selectedSize === size && item.selectedColor.name === color.name
              ? { ...item, quantity }
              : item
          )
        }));
      },
      
      clearCart: () => set({ cart: [] }),
      
      cartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      cartCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      getProductsByGender: (gender) => {
        return get().products.filter(product => product.gender === gender);
      },

      getNewArrivals: () => {
        return get().products.filter(product => product.isNewArrival);
      },

      getSaleProducts: () => {
        return get().products.filter(product => product.isOnSale);
      },

      getAccessories: () => {
        const allProducts = get().products;
        const accessories = allProducts.filter(product => product.category === 'Accessories');
        return accessories;
      },

      addToWishlist: (productId) => {
        set(state => ({
          wishlist: state.wishlist.includes(productId) 
            ? state.wishlist 
            : [...state.wishlist, productId]
        }));
      },

      removeFromWishlist: (productId) => {
        set(state => ({
          wishlist: state.wishlist.filter(id => id !== productId)
        }));
      },

      isInWishlist: (productId) => {
        return get().wishlist.includes(productId);
      },

      getWishlistProducts: () => {
        return get().products.filter(product => get().wishlist.includes(product.id));
      },

      addToRecentlyViewed: (productId) => {
        set(state => {
          const filtered = state.recentlyViewed.filter(id => id !== productId);
          return {
            recentlyViewed: [productId, ...filtered].slice(0, 10)
          };
        });
      },

      getRecentlyViewedProducts: () => {
        return get().recentlyViewed
          .map(id => get().products.find(p => p.id === id))
          .filter(Boolean) as Product[];
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      searchProducts: (query) => {
        const searchTerm = query || get().searchQuery;
        if (!searchTerm.trim()) return get().products;
        
        const lowercaseQuery = searchTerm.toLowerCase();
        return get().products.filter(product =>
          product.name.toLowerCase().includes(lowercaseQuery) ||
          product.category.toLowerCase().includes(lowercaseQuery) ||
          product.description.toLowerCase().includes(lowercaseQuery) ||
          product.useCases?.some(useCase => useCase.toLowerCase().includes(lowercaseQuery)) ||
          product.gender.toLowerCase().includes(lowercaseQuery)
        );
      },

      getRecommendedProducts: (productId, limit = 3) => {
        const currentProduct = get().products.find(p => p.id === productId);
        if (!currentProduct) return [];

        return get().products
          .filter(product => 
            product.id !== productId && 
            (product.gender === currentProduct.gender || 
             product.category === currentProduct.category)
          )
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, limit);
      },

      getUpsellProducts: () => {
        return get().products.filter(product => product.category === 'Accessories');
      },
      
      setCheckoutStep: (step) => {
        set({ checkoutStep: step });
      },
      
      createOrder: (shippingInfo, paymentMethod) => {
        const cart = get().cart;
        const subtotal = get().cartTotal();
        const shipping = subtotal >= 500 ? 0 : 25;
        const tax = Math.round(subtotal * 0.08 * 100) / 100;
        const total = subtotal + shipping + tax;
        
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const orderDate = new Date();
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(orderDate.getDate() + 10);
        
        const order: Order = {
          id: orderId,
          items: [...cart],
          subtotal,
          shipping,
          tax,
          total,
          shippingInfo,
          paymentMethod,
          status: 'pending',
          trackingNumber: `TRK${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
          orderDate,
          estimatedDelivery,
        };
        
        set(state => ({
          orders: [order, ...state.orders],
          cart: [],
          checkoutStep: 0
        }));
        
        return orderId;
      },
      
      getOrderById: (orderId) => {
        return get().orders.find(order => order.id === orderId);
      },
      
      getOrdersByEmail: (email) => {
        return get().orders.filter(order => 
          order.shippingInfo.email.toLowerCase() === email.toLowerCase()
        );
      },
      
      createUser: (email, firstName, lastName) => {
        const userId = `USR-${Date.now()}`;
        const user: User = {
          id: userId,
          email,
          firstName,
          lastName,
          orders: get().orders.filter(order => 
            order.shippingInfo.email.toLowerCase() === email.toLowerCase()
          )
        };
        
        set({ currentUser: user });
        return user;
      },
      
      loginUser: (user) => {
        set({ currentUser: user });
      },
      
      logoutUser: () => {
        set({ currentUser: null });
      },
      
      setFilters: (filters) => {
        set({ filters });
      },
      
      getFilteredProducts: (baseProducts) => {
        const { filters } = get();
        const productsToFilter = baseProducts || get().products;
        
        return productsToFilter.filter(product => {
          if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
            return false;
          }
          
          if (filters.gender.length > 0 && !filters.gender.includes(product.gender)) {
            return false;
          }
          
          if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
            return false;
          }
          
          if (filters.sizes.length > 0) {
            const hasMatchingSize = product.sizes.some(size => filters.sizes.includes(size));
            if (!hasMatchingSize) return false;
          }
          
          if (filters.colors.length > 0) {
            const hasMatchingColor = product.colors.some(color => 
              filters.colors.some(filterColor => 
                color.name.toLowerCase().includes(filterColor.toLowerCase())
              )
            );
            if (!hasMatchingColor) return false;
          }
          
          return true;
        });
      },
      
      getAvailableCategories: (baseProducts) => {
        const productsToAnalyze = baseProducts || get().products;
        const categories = [...new Set(productsToAnalyze.map(p => p.category))];
        return categories.sort();
      },
      
      getAvailableSizes: (baseProducts) => {
        const productsToAnalyze = baseProducts || get().products;
        const allSizes = productsToAnalyze.flatMap(p => p.sizes);
        const uniqueSizes = [...new Set(allSizes)];
        return uniqueSizes.sort((a, b) => {
          const aNum = parseFloat(a);
          const bNum = parseFloat(b);
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
          }
          return a.localeCompare(b);
        });
      },
      
      getAvailableColors: (baseProducts) => {
        const productsToAnalyze = baseProducts || get().products;
        const allColors = productsToAnalyze.flatMap(p => p.colors.map(c => c.name));
        const uniqueColors = [...new Set(allColors)];
        return uniqueColors.sort();
      },
      
      getPriceRange: (baseProducts) => {
        const productsToAnalyze = baseProducts || get().products;
        if (productsToAnalyze.length === 0) return [0, 2000];
        
        const prices = productsToAnalyze.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        return [Math.floor(minPrice / 10) * 10, Math.ceil(maxPrice / 10) * 10] as [number, number];
      },
      
      clearFilters: () => {
        const defaultPriceRange = get().getPriceRange();
        set({
          filters: {
            categories: [],
            priceRange: defaultPriceRange,
            sizes: [],
            colors: [],
            gender: []
          }
        });
      },

      resetStore: () => {
        const defaultPriceRange = get().getPriceRange();
        set({
          products: mockProducts,
          cart: [],
          wishlist: [],
          recentlyViewed: [],
          searchQuery: '',
          orders: [],
          currentUser: null,
          checkoutStep: 0,
          filters: {
            categories: [],
            priceRange: defaultPriceRange,
            sizes: [],
            colors: [],
            gender: []
          }
        });
      },
    }),
    {
      name: 'elegante-tailoring-store',
    }
  )
);

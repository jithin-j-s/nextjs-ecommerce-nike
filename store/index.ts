import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'

// Types
interface User {
  id: string
  name: string
  phone_number: string
}

interface Order {
  order_id: string
  product_amount: number
  product_name: string
  product_image: string
  created_date: string
  product_mrp: number
}

interface PurchasedProduct {
  name: string
  image: string
  price: number
  originalPrice?: number
  size: string
  productId: string
}

// Auth Store
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (token: string, user: User) => void
  logout: () => void
  initAuth: () => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
}

// App Store
interface AppState {
  orders: Order[]
  lastPurchasedProduct: PurchasedProduct | null
  isOrdersLoading: boolean
  ordersError: string | null
  setOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void
  setLastPurchasedProduct: (product: PurchasedProduct) => void
  setOrdersLoading: (loading: boolean) => void
  setOrdersError: (error: string | null) => void
  clearOrders: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: (token: string, user: User) => {
    try {
      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' })
      try {
        Cookies.set('user', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' })
      } catch (stringifyError) {
        throw new Error('Failed to serialize user data')
      }
      set({ token, user, isAuthenticated: true, error: null })
    } catch (error) {
      set({ error: 'Failed to save login data' })
      Cookies.remove('token')
      Cookies.remove('user')
    }
  },
  
  logout: () => {
    try {
      Cookies.remove('token')
      Cookies.remove('user')
      set({ token: null, user: null, isAuthenticated: false, error: null })
    } catch (error) {
      console.error('Logout error:', error)
    }
  },
  
  initAuth: () => {
    set({ isLoading: true })
    try {
      const token = Cookies.get('token')
      const userStr = Cookies.get('user')
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr)
          // Validate token format (basic check)
          if (token.length > 10 && user.id) {
            set({ token, user, isAuthenticated: true, error: null })
          } else {
            // Invalid token, clear cookies
            Cookies.remove('token')
            Cookies.remove('user')
          }
        } catch (parseError) {
          // Malformed JSON in cookie, clear cookies
          Cookies.remove('token')
          Cookies.remove('user')
        }
      }
    } catch (error) {
      set({ error: 'Failed to initialize authentication' })
      Cookies.remove('token')
      Cookies.remove('user')
    } finally {
      set({ isLoading: false })
    }
  },
  
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading })
}))

export const useAppStore = create<AppState>()(  
  persist(
    (set) => ({
      orders: [],
      lastPurchasedProduct: null,
      isOrdersLoading: false,
      ordersError: null,
      
      setOrders: (orders) => set({ orders, ordersError: null }),
      addOrder: (order) => set((state) => ({ 
        orders: [order, ...state.orders],
        ordersError: null 
      })),
      setLastPurchasedProduct: (product) => set({ lastPurchasedProduct: product }),
      setOrdersLoading: (isOrdersLoading) => set({ isOrdersLoading }),
      setOrdersError: (ordersError) => set({ ordersError }),
      clearOrders: () => set({ orders: [], ordersError: null })
    }),
    {
      name: 'nike-app-storage',
      partialize: (state) => ({ lastPurchasedProduct: state.lastPurchasedProduct })
    }
  )
)
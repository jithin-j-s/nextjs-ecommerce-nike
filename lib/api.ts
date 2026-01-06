const BASE_URL = 'https://skilltestnextjs.evidam.zybotechlab.com/api'

// Allowed domains for SSRF protection
const ALLOWED_DOMAINS = ['skilltestnextjs.evidam.zybotechlab.com']
const ALLOWED_IMAGE_DOMAINS = ['skilltestnextjs.evidam.zybotechlab.com', 'localhost']

// URL validation to prevent SSRF
const validateUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url)
    return ALLOWED_DOMAINS.includes(parsedUrl.hostname)
  } catch {
    return false
  }
}

// Image URL validation
const validateImageUrl = (url: string): boolean => {
  if (!url || url.startsWith('/')) return true // Local images are safe
  try {
    const parsedUrl = new URL(url)
    return ALLOWED_IMAGE_DOMAINS.includes(parsedUrl.hostname)
  } catch {
    return false
  }
}

// Sanitize product data to prevent SSRF
const sanitizeProduct = (product: any): Product => {
  return {
    id: product.id,
    name: product.name,
    product_images: product.product_images?.map((img: any) => ({
      image: validateImageUrl(img.image) ? img.image : '/images/placeholder.jpg'
    })) || [],
    variations_exist: product.variations_exist || false,
    variation_colors: product.variation_colors?.map((c: any) => ({
      color_id: c.color_id,
      color_name: c.color_name,
      color_images: c.color_images?.filter((img: string) => validateImageUrl(img)) || [],
      status: c.status,
      sizes: c.sizes || []
    })) || [],
    sale_price: product.sale_price || product.price || 0,
    mrp: product.mrp || product.original_price || 0,
    new: product.new || false,
    discount: product.discount || 0,
    out_of_stock: product.out_of_stock || false,
    slug: product.slug || ''
  }
}

// Sanitize order data
const sanitizeOrder = (order: any) => {
  return {
    ...order,
    product_image: validateImageUrl(order.product_image) ? order.product_image : '/images/placeholder.jpg'
  }
}

// Secure fetch wrapper
const secureFetch = async (url: string, options?: RequestInit): Promise<Response> => {
  if (!validateUrl(url)) {
    throw new ApiError(400, 'Invalid URL: Domain not allowed')
  }
  return fetch(url, options)
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

interface VerifyUserResponse {
  otp: string
  user?: {
    id: string
    name: string
    phone_number: string
  }
  token?: {
    access: string
  }
}

interface RegisterUserResponse {
  token: {
    access: string
  }
  user_id: string
  name: string
  phone_number: string
}

interface PurchaseProductResponse {
  success: boolean
  message: string
  order_id?: string
  order?: any
}

interface UserOrdersResponse {
  orders: {
    order_id: string
    product_amount: number
    product_name: string
    product_image: string
    created_date: string
    product_mrp: number
  }[]
}

interface Product {
  id: string
  name: string
  product_images: {
    image: string
  }[]
  variations_exist: boolean
  variation_colors: {
    color_id: number
    color_name: string
    color_images: string[]
    status: boolean
    sizes: {
      size_id: number
      variation_product_id: number
      size_name: string
      status: boolean
      price: number
    }[]
  }[]
  sale_price: number
  mrp: number
  new: boolean
  discount: number
  out_of_stock: boolean
  slug: string
}

interface NewProductsResponse {
  products?: Product[]
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }))
    throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`)
  }
  return response.json()
}

export const api = {
  async verifyUser(phone_number: string): Promise<VerifyUserResponse> {
    try {
      const response = await secureFetch(`${BASE_URL}/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number })
      })
      return await handleResponse<VerifyUserResponse>(response)
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to verify user')
    }
  },

  async registerUser(name: string, phone_number: string, unique_id?: string): Promise<RegisterUserResponse> {
    try {
      const response = await secureFetch(`${BASE_URL}/login-register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone_number, unique_id })
      })
      return await handleResponse<RegisterUserResponse>(response)
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to register user')
    }
  },

  async purchaseProduct(productId: string, variationId?: string, token?: string): Promise<PurchaseProductResponse> {
    if (!token) throw new ApiError(401, 'Authentication required')
    
    try {
      const body = variationId ? { variation_product_id: variationId } : { product_id: productId }
      const response = await secureFetch(`${BASE_URL}/purchase-product/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      return await handleResponse<PurchaseProductResponse>(response)
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to purchase product')
    }
  },

  async getUserOrders(token: string): Promise<UserOrdersResponse> {
    if (!token) throw new ApiError(401, 'Authentication required')
    
    try {
      const response = await secureFetch(`${BASE_URL}/user-orders/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await handleResponse<UserOrdersResponse>(response)
      return {
        orders: data.orders?.map(sanitizeOrder) || []
      }
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to fetch orders')
    }
  },

  async getNewProducts(): Promise<Product[]> {
    try {
      console.log('Making API call to:', `${BASE_URL}/new-products/`)
      const response = await secureFetch(`${BASE_URL}/new-products/`)
      console.log('Response status:', response.status)
      const data = await handleResponse<any>(response)
      console.log('Raw API response:', data)
      
      // Handle different possible response structures
      let products = []
      if (Array.isArray(data)) {
        products = data
      } else if (data.products && Array.isArray(data.products)) {
        products = data.products
      } else if (data.data && Array.isArray(data.data)) {
        products = data.data
      }
      
      console.log('Processed products:', products)
      return products.map(sanitizeProduct)
    } catch (error) {
      console.error('API Error:', error)
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to fetch products')
    }
  }
}

export { ApiError, type Product, type VerifyUserResponse, type RegisterUserResponse, type PurchaseProductResponse, type UserOrdersResponse }
import ProductCard from '@/components/ProductCard'
import { api, type Product } from '@/lib/api'

async function getProducts(): Promise<Product[]> {
  try {
    console.log('Fetching products...')
    const products = await api.getNewProducts()
    console.log('Products received:', products)
    return products
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()
  console.log('Products in component:', products)

  return (
    <div className="w-full max-w-[1320px] min-h-screen mx-auto bg-nike-black py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Men's Jordan Shoes</h1>
      
      {products.length === 0 ? (
        <div className="text-white text-center">No products available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-[100px]">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
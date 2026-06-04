import type { Product } from '@/lib/types'

const categories: Product['category'][] = ['Shirts', 'Pants', 'Dresses', 'Jackets', 'Accessories']

const productNames: Record<Product['category'], string[]> = {
  Shirts: ['Classic Oxford', 'Slim Fit Dress', 'Casual Polo', 'Button Down', 'Henley', 'Flannel Check', 'Linen Summer', 'Chambray', 'Denim Work', 'Performance Tech'],
  Pants: ['Chino Classic', 'Slim Fit Trousers', 'Cargo Work', 'Jogger Comfort', 'Dress Formal', 'Denim Straight', 'Pleated Front', 'Stretch Active', 'Corduroy Winter', 'Linen Beach'],
  Dresses: ['A-Line Classic', 'Maxi Floral', 'Cocktail Evening', 'Shift Work', 'Wrap Summer', 'Bodycon Party', 'Midi Casual', 'Shirt Dress', 'Sundress Cotton', 'Formal Gown'],
  Jackets: ['Bomber Classic', 'Blazer Formal', 'Denim Trucker', 'Puffer Winter', 'Leather Biker', 'Windbreaker Sport', 'Cardigan Knit', 'Peacoat Wool', 'Track Jacket', 'Fleece Quarter-Zip'],
  Accessories: ['Silk Tie', 'Leather Belt', 'Wool Scarf', 'Baseball Cap', 'Leather Wallet', 'Sunglasses Classic', 'Watch Band', 'Cufflinks Set', 'Pocket Square', 'Beanie Winter']
}

const colors = ['Navy', 'Black', 'White', 'Gray', 'Charcoal', 'Khaki', 'Olive', 'Burgundy', 'Blue', 'Brown']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const suppliers = ['TextilePro Inc.', 'FabricFirst Ltd.', 'Global Threads Co.', 'Premium Weave', 'Cotton Kings', 'Silk Route Trading', 'Garment Galaxy', 'Fashion Forward LLC']

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

function generateProducts(): Product[] {
  const products: Product[] = []
  const random = seededRandom(123)
  let productId = 1

  for (const category of categories) {
    const names = productNames[category]
    for (const name of names) {
      for (const color of colors.slice(0, 5 + Math.floor(random() * 5))) {
        for (const size of sizes.slice(0, 4 + Math.floor(random() * 2))) {
          if (productId > 1000) break
          
          const basePrice = category === 'Dresses' ? 45 : category === 'Jackets' ? 60 : category === 'Pants' ? 35 : category === 'Shirts' ? 25 : 15
          const priceVariation = basePrice * (0.8 + random() * 0.6)
          const price = Math.round(priceVariation * 100) / 100
          const costPrice = Math.round(price * (0.4 + random() * 0.2) * 100) / 100

          products.push({
            id: `PRD-${String(productId).padStart(5, '0')}`,
            sku: `${category.substring(0, 3).toUpperCase()}-${color.substring(0, 3).toUpperCase()}-${size}-${String(productId).padStart(4, '0')}`,
            name: `${name} ${color} ${size}`,
            category,
            price,
            costPrice,
            stockQuantity: Math.floor(random() * 500),
            reorderLevel: 20 + Math.floor(random() * 30),
            supplier: suppliers[Math.floor(random() * suppliers.length)],
            imageUrl: `/products/${category.toLowerCase()}-${productId % 10}.jpg`,
            createdAt: new Date(2022 + Math.floor(random() * 2), Math.floor(random() * 12), Math.floor(1 + random() * 28)).toISOString()
          })
          productId++
        }
      }
    }
  }

  return products.slice(0, 1000)
}

export const products = generateProducts()

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter(p => p.category === category)
}

export function getLowStockProducts(threshold: number = 50): Product[] {
  return products.filter(p => p.stockQuantity <= p.reorderLevel)
}

export function getProductCategories(): { category: Product['category']; count: number; totalValue: number }[] {
  return categories.map(category => {
    const categoryProducts = products.filter(p => p.category === category)
    return {
      category,
      count: categoryProducts.length,
      totalValue: categoryProducts.reduce((sum, p) => sum + p.price * p.stockQuantity, 0)
    }
  })
}

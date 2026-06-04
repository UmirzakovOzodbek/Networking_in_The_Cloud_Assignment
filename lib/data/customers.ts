import type { Customer } from '@/lib/types'

const companyPrefixes = ['Global', 'Premier', 'Elite', 'Pacific', 'Atlantic', 'Metro', 'Central', 'United', 'National', 'Royal']
const companySuffixes = ['Fashion', 'Apparel', 'Textiles', 'Clothing Co.', 'Wear', 'Outfitters', 'Styles', 'Garments', 'Trading', 'Wholesale']
const firstNames = ['James', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'Robert', 'Sophia', 'William', 'Isabella', 'John', 'Mia', 'Richard', 'Charlotte', 'Thomas']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson']
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA']
const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany']
const streets = ['Main St', 'Oak Ave', 'Maple Blvd', 'Commerce Dr', 'Industrial Pkwy', 'Trade Center', 'Business Park', 'Market St', 'Enterprise Way', 'Corporate Dr']

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

function generateCustomers(): Customer[] {
  const customers: Customer[] = []
  const random = seededRandom(42)

  for (let i = 1; i <= 100; i++) {
    const cityIndex = Math.floor(random() * cities.length)
    const segment: Customer['segment'] = random() < 0.2 ? 'Premium' : random() < 0.6 ? 'Regular' : 'New'
    const totalSpent = segment === 'Premium' 
      ? 50000 + Math.floor(random() * 450000)
      : segment === 'Regular' 
        ? 10000 + Math.floor(random() * 40000)
        : 1000 + Math.floor(random() * 9000)

    customers.push({
      id: `CUS-${String(i).padStart(4, '0')}`,
      companyName: `${companyPrefixes[Math.floor(random() * companyPrefixes.length)]} ${companySuffixes[Math.floor(random() * companySuffixes.length)]}`,
      contactName: `${firstNames[Math.floor(random() * firstNames.length)]} ${lastNames[Math.floor(random() * lastNames.length)]}`,
      email: `contact${i}@company${i}.com`,
      phone: `+1 (${Math.floor(200 + random() * 800)}) ${Math.floor(100 + random() * 900)}-${Math.floor(1000 + random() * 9000)}`,
      segment,
      totalSpent,
      ordersCount: Math.floor(totalSpent / (2000 + random() * 3000)),
      lastOrderDate: new Date(2024, Math.floor(random() * 12), Math.floor(1 + random() * 28)).toISOString().split('T')[0],
      createdAt: new Date(2020 + Math.floor(random() * 4), Math.floor(random() * 12), Math.floor(1 + random() * 28)).toISOString(),
      address: {
        street: `${Math.floor(100 + random() * 9900)} ${streets[Math.floor(random() * streets.length)]}`,
        city: cities[cityIndex],
        state: states[cityIndex],
        country: countries[Math.floor(random() * countries.length)],
        zipCode: String(10000 + Math.floor(random() * 89999))
      }
    })
  }

  return customers
}

export const customers = generateCustomers()

export function getCustomerById(id: string): Customer | undefined {
  return customers.find(c => c.id === id)
}

export function getCustomersBySegment(segment: Customer['segment']): Customer[] {
  return customers.filter(c => c.segment === segment)
}

export function getTopCustomers(limit: number = 10): Customer[] {
  return [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, limit)
}

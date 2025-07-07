export interface ProductClient {
    _id: string
    name: string
    price: number
    isAvailable?: boolean
    category: string
    restaurant: string
    order?: number
  }
  
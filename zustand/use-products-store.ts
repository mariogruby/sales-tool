// zustand/use-products-store.ts
import { create } from "zustand"
import { ProductClient } from "@/types/product-client"

interface ProductStore {
  products: ProductClient[]
  setProducts: (products: ProductClient[]) => void
  addProduct: (product: ProductClient) => void
  removeProduct: (id: string) => void
  isSortingEnabled: boolean
  setIsSortingEnabled: (value: boolean) => void
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({
      products: [product, ...state.products],
    })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product._id !== id),
    })),
  isSortingEnabled: false,
  setIsSortingEnabled: (value) => set({ isSortingEnabled: value }),
}))

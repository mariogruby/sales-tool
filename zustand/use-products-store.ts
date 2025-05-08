import { create } from "zustand"
import { IProduct } from "@/types/product"

interface ProductStore {
    products: IProduct[]
    setProducts: (products: IProduct[]) => void
    addProduct: (product: IProduct) => void
    removeProduct: (id: string) => void
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
}))

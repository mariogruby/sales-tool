"use client"
import { useProducts } from "@/hooks/use-products"
import { useProductStore } from "@/zustand/use-products-store"
import { useCategoryStore } from "@/zustand/use-categories-store" // IMPORTA EL STORE DE CATEGORÍAS
import { AllProducts } from "./components/products/all-products"

const Page = () => {
  const { loading, error } = useProducts()
  const products = useProductStore((state) => state.products)
  
  // OBTÉN LA CATEGORÍA SELECCIONADA DEL STORE
  const selectedCategory = useCategoryStore((state) => state.selectedCategory)

  return (
    <div className="container mx-auto py-4">
      <AllProducts 
        products={products} 
        loading={loading} 
        error={error} 
        selectedCategory={selectedCategory}
      />
    </div>
  )
}

export default Page

"use client"
import { useProducts } from "@/hooks/products/use-products"
import { useCategoryStore } from "@/zustand/use-categories-store"
import { AllProducts } from "./components/products/all-products"

const Page = () => {
  const { loading, error } = useProducts()
  const selectedCategory = useCategoryStore((state) => state.selectedCategory)

  return (
    <div className="container mx-auto py-4">
      <AllProducts
        loading={loading}
        error={error}
        selectedCategory={selectedCategory}
      />
    </div>
  )
}

export default Page
"use client"
import { AllProducts } from "@/app/dashboard/(routes)/product/components/all-products"
import { useProducts } from "@/hooks/use-products"
import { useProductStore } from "@/zustand/use-products-store"

const Page = () => {
  const { loading, error } = useProducts()
  const products = useProductStore((state) => state.products)

  return (
    <div className="container mx-auto py-4">
      <AllProducts products={products} loading={loading} error={error} />
    </div>
  )
}

export default Page

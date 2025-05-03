"use client"
import { AllProducts } from "@/app/dashboard/(routes)/product/components/all-products"
import { useProducts } from "@/hooks/use-products"

const Page = () => {
  const { products, loading, error } = useProducts()

  return (
    <div className="container mx-auto py-4">
      <AllProducts products={products} loading={loading} error={error} />
    </div>
  )
}

export default Page

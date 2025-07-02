"use client"
import { useProducts } from "@/hooks/products/use-products"
import { useCategoryStore } from "@/zustand/use-categories-store"
import { AllProducts } from "./components/products/all-products"
import { ProtectedRouteGuard } from "@/app/security/protectedRouteGuard"
import { usePathname } from "next/navigation"

const Page = () => {
  const { loading, error } = useProducts()
  const selectedCategory = useCategoryStore((state) => state.selectedCategory)

  const pathname = usePathname()

  return (
    <ProtectedRouteGuard route={pathname}>
      <div className="container mx-auto py-4">
        <AllProducts
          loading={loading}
          error={error}
          selectedCategory={selectedCategory}
        />
      </div>
    </ProtectedRouteGuard>
  )
}

export default Page
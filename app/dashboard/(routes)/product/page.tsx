"use client"
import { useProducts } from "@/hooks/products/use-products"
// import { useMediaQuery } from "@/hooks/use-media-query"
import { useCategoryStore } from "@/zustand/use-categories-store"
import { AllProducts } from "./components/products/all-products"
import { ProtectedRouteGuard } from "@/app/security/protectedRouteGuard"
import { usePathname } from "next/navigation"
import { AllCategoriesButtons } from "./components/categories/all-categories-buttons"

const Page = () => {
  const { loading, error } = useProducts()
  const selectedCategory = useCategoryStore((state) => state.selectedCategory)
  const setSelectedCategory = useCategoryStore((state) => state.setSelectedCategory)

  const pathname = usePathname()

  // const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <ProtectedRouteGuard route={pathname}>
      <div className="container mx-auto  space-y-4">
        <AllCategoriesButtons
          // categories={categories}
          loading={loading}
          error={error}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          showEditButton={true}
        />
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
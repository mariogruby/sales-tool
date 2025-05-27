"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CreateProduct } from "@/app/dashboard/(routes)/product/components/products/create-product"
import { IconPlus } from "@tabler/icons-react"
import { CloseDayModal } from "@/app/dashboard/components/closeDay/close-day-modal"
import { AllCategories } from "@/app/dashboard/(routes)/product/components/categories/all-categories"
import { useProducts } from "@/hooks/use-products"
import { useCategoryStore } from "@/zustand/use-categories-store"
import CreateCategory from "@/app/dashboard/(routes)/product/components/categories/create-category"
import { CreateTables } from "@/app/dashboard/(routes)/tables/components/create-table"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const [openCloseDayModal, setOpenCloseDayModal] = useState(false)
  const [openTableModal, setOpenTableModal] = useState(false)

  const pathname = usePathname()

  const isDashboardPage = pathname === "/dashboard"
  const isProductPage = pathname === "/dashboard/product"
  const isTablesPage = pathname === "/dashboard/tables"

  const { loading, error } = useProducts()
  const { categories, selectedCategory, setSelectedCategory } = useCategoryStore()


  return (
    <header className="flex h-[--header-height] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[--header-height]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <div className="ml-auto py-2 flex items-center gap-2">
          {isProductPage && (
            <>
              <AllCategories
                categories={categories}
                loading={loading}
                error={error}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <Button onClick={() => setOpenCategoryModal(true)} size="sm">
                <IconPlus className="mr-1 h-4 w-4" />
                Añadir categoría
              </Button>
              <CreateCategory open={openCategoryModal} setOpen={setOpenCategoryModal} />
              <Button onClick={() => setOpen(true)} size="sm">
                <IconPlus className="mr-1 h-4 w-4" />
                Añadir producto
              </Button>
              <CreateProduct open={open} setOpen={setOpen} />
            </>
          )}
          {isDashboardPage && (
            <>
              <Button onClick={() => setOpenCloseDayModal(true)} size="sm">
                {/* <IconPlus className="mr-1 h-4 w-4" /> */}
                Cerrar dia
              </Button>
              <CloseDayModal open={openCloseDayModal} setOpen={setOpenCloseDayModal} />
            </>
          )}
          {isTablesPage && (
            <>
            <Button onClick={() => setOpenTableModal(true)} size="sm">
              Crear mesas
            </Button>
            <CreateTables open={openTableModal} setOpen={setOpenTableModal} />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
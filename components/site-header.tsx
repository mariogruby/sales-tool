"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CreateProduct } from "@/app/dashboard/(routes)/product/components/create-product"
import { CreateCategory } from "@/app/dashboard/(routes)/categories/components/create-category"
import { IconPlus } from "@tabler/icons-react"
import { AllCategories } from "@/app/dashboard/(routes)/categories/components/all-categories"
import { useCategories } from "@/hooks/use-categories"
import { useCategoryStore } from "@/zustand/use-categories-store"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [openCategory, setOpenCategory] = useState(false)
  const pathname = usePathname()

  useCategories()

  const isProductPage = pathname === "/dashboard/product"
  const isCategoryPage = pathname === "/dashboard/categories"
  const setSelectedCategoryId = useCategoryStore((state) => state.setSelectedCategoryId)

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
              <Button onClick={() => setOpen(true)} size="sm">
                <IconPlus className="mr-1 h-4 w-4" />
                Añadir producto
              </Button>
              <CreateProduct open={open} setOpen={setOpen} />
            </>
          )}

          {isCategoryPage && (
            <>
              <AllCategories onSelect={setSelectedCategoryId} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenCategory(true)}
              >
                <IconPlus className="mr-1 h-4 w-4" />
                <span className="hidden lg:inline">Añadir categoria</span>
              </Button>
              <CreateCategory open={openCategory} setOpen={setOpenCategory} />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
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
import { useProducts } from "@/hooks/products/use-products"
import { useCategoryStore } from "@/zustand/use-categories-store"
import CreateCategory from "@/app/dashboard/(routes)/product/components/categories/create-category"
import { CreateTables } from "@/app/dashboard/(routes)/tables/components/create-table"
import { ExtraordinarySaleModal } from "@/app/dashboard/components/extraordinarySale/extraordinary-sale-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useTables } from "@/hooks/tables/use-tables"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const [openCloseDayModal, setOpenCloseDayModal] = useState(false)
  const [openTableModal, setOpenTableModal] = useState(false)
  const [openExtraSale, setOpenExtraSale] = useState(false)

  const pathname = usePathname()
  const isDashboardPage = pathname === "/dashboard"
  const isProductPage = pathname === "/dashboard/product"
  const isTablesPage = pathname === "/dashboard/tables"

  const { loading, error } = useProducts()
  const { categories, selectedCategory, setSelectedCategory } = useCategoryStore()
  const {refetch }= useTables()

  const renderButtons = () => {
    if (isProductPage) {
      return (
        <>
          <AllCategories
            categories={categories}
            loading={loading}
            error={error}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <Button
            onClick={() => setOpenCategoryModal(true)}
            size="sm"
            className="cursor-pointer"
          >
            <IconPlus className="mr-1 h-4 w-4" />
            Añadir categoría
          </Button>
          <CreateCategory open={openCategoryModal} setOpen={setOpenCategoryModal} />
          <Button
            onClick={() => setOpen(true)}
            size="sm"
            className="cursor-pointer"
          >
            <IconPlus className="mr-1 h-4 w-4" />
            Añadir producto
          </Button>
          <CreateProduct open={open} setOpen={setOpen} />
        </>
      )
    }

    if (isDashboardPage) {
      return (
        <>
          <Button
            onClick={() => setOpenExtraSale(true)}
            size="sm"
            className="cursor-pointer"
          >
            Venta extraordinaria
          </Button>
          <ExtraordinarySaleModal open={openExtraSale} setOpen={setOpenExtraSale} />
          <Button
            onClick={() => setOpenCloseDayModal(true)}
            size="sm"
            variant="destructive"
            className="cursor-pointer"
          >
            Cerrar día
          </Button>
          <CloseDayModal open={openCloseDayModal} setOpen={setOpenCloseDayModal} />
        </>
      )
    }

    if (isTablesPage) {
      return (
        <>
          <Button
            onClick={() => setOpenTableModal(true)}
            size="sm"
            className="cursor-pointer"
          >
            Crear mesas
          </Button>
          <CreateTables 
          open={openTableModal} 
          setOpen={setOpenTableModal}
          onSuccess={refetch}
          />
        </>
      )
    }

    return null
  }

  const renderDropdown = () => {
    return (
      <>
        {isProductPage && (
          <>
            <DropdownMenuItem onClick={() => setOpenCategoryModal(true)}>
              Añadir categoría
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              Añadir producto
            </DropdownMenuItem>
          </>
        )}
        {isDashboardPage && (
          <>
            <DropdownMenuItem onClick={() => setOpenExtraSale(true)}>
              Venta Extraordinaria
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenCloseDayModal(true)} variant="destructive">
              Cerrar día
            </DropdownMenuItem>
          </>
        )}
        {isTablesPage && (
          <DropdownMenuItem onClick={() => setOpenTableModal(true)}>
            Crear mesas
          </DropdownMenuItem>
        )}
      </>
    )
  }

  return (
    <header className="flex h-[--header-height] items-center border-b">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-4" />
        </div>

        {/* Botones visibles en pantallas medianas y grandes */}
        <div className="hidden sm:flex flex-wrap items-center gap-2 py-2">
          {renderButtons()}
        </div>

        {/* Menú desplegable en pantallas pequeñas */}
        <div className="sm:hidden ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {renderDropdown()}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

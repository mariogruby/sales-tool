"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { IconDotsVertical } from "@tabler/icons-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateProduct } from "@/app/dashboard/(routes)/product/components/products/create-product"
import CreateCategory from "@/app/dashboard/(routes)/product/components/categories/create-category"
import { CreateTables } from "@/app/dashboard/(routes)/tables/components/create-table"
import { CloseDayModal } from "@/app/dashboard/components/close-day/close-day-modal"
import { ExtraordinarySaleModal } from "@/app/dashboard/components/extraordinary-sale/extraordinary-sale-modal"
import { useTableStore } from "@/zustand/use-table-store"
import { useProductStore } from "@/zustand/use-products-store"

type ActiveModal = "product" | "category" | "closeDay" | "table" | "extraSale" | null

interface PageAction {
    label: string
    modal: ActiveModal
    variant?: "default" | "destructive"
}

const PAGE_ACTIONS: Record<string, PageAction[]> = {
    "/dashboard/product": [
        { label: "Crear categoría", modal: "category" },
        { label: "Crear producto", modal: "product" },
    ],
    "/dashboard": [
        { label: "Venta extraordinaria", modal: "extraSale" },
        { label: "Cerrar día", modal: "closeDay", variant: "destructive" },
    ],
    "/dashboard/tables": [
        { label: "Crear mesas", modal: "table" },
    ],
}

export function SiteHeader() {
    const [activeModal, setActiveModal] = useState<ActiveModal>(null)
    const [openDropdown, setOpenDropdown] = useState(false)

    const pathname = usePathname()
    const isProductPage = pathname === "/dashboard/product"

    const refetch = useTableStore((s) => s.refetchTables)
    const { isSortingEnabled, setIsSortingEnabled } = useProductStore()

    const actions = PAGE_ACTIONS[pathname] ?? []
    const closeModal = () => setActiveModal(null)

    // setTimeout resuelve conflicto de aria-hidden con Radix UI al encadenar modales
    const handleDropdownAction = (modal: ActiveModal) => {
        setOpenDropdown(false)
        setTimeout(() => setActiveModal(modal), 50)
    }

    return (
        <header className="flex h-[--header-height] items-center border-b">
            <div className="flex w-full flex-wrap items-center justify-between gap-2 px-4 lg:px-6">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1 p-5" />
                    <Separator orientation="vertical" className="mx-2 h-4" />
                </div>

                {/* Botones desktop */}
                <div className="hidden sm:flex flex-wrap items-center gap-2 py-2">
                    {isProductPage && (
                        <div className="flex items-center gap-2 px-2">
                            <Switch
                                id="sort-toggle"
                                checked={isSortingEnabled}
                                onCheckedChange={setIsSortingEnabled}
                            />
                            <Label htmlFor="sort-toggle">Editar</Label>
                        </div>
                    )}
                    {actions.map((action) => (
                        <Button
                            key={action.label}
                            size="sm"
                            variant={action.variant ?? "default"}
                            className="cursor-pointer"
                            onClick={() => setActiveModal(action.modal)}
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>

                {/* Switch + dropdown mobile */}
                <div className="sm:hidden flex items-center gap-2 ml-auto">
                    {isProductPage && (
                        <div className="flex items-center gap-2">
                            <Switch
                                id="sort-toggle-mobile"
                                checked={isSortingEnabled}
                                onCheckedChange={setIsSortingEnabled}
                            />
                            <Label htmlFor="sort-toggle-mobile">Editar</Label>
                        </div>
                    )}
                    {actions.length > 0 && (
                        <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                                >
                                    <IconDotsVertical className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {actions.map((action) => (
                                    <DropdownMenuItem
                                        key={action.label}
                                        variant={action.variant}
                                        onClick={() => handleDropdownAction(action.modal)}
                                    >
                                        {action.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Modales */}
            <CreateProduct open={activeModal === "product"} setOpen={(v) => !v && closeModal()} />
            <CreateCategory open={activeModal === "category"} setOpen={(v) => !v && closeModal()} />
            <CloseDayModal open={activeModal === "closeDay"} setOpen={(v) => !v && closeModal()} />
            <CreateTables open={activeModal === "table"} setOpen={(v) => !v && closeModal()} onSuccess={refetch} />
            <ExtraordinarySaleModal open={activeModal === "extraSale"} setOpen={(v) => !v && closeModal()} />
        </header>
    )
}

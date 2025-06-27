import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconDotsVertical } from "@tabler/icons-react"
import { DeleteProduct } from "./products/delete-product-modal"
import { EditProduct } from "./products/edit-product"
import { IProduct } from "@/types/product"

type Props = {
    productId: string
    product: IProduct[];
}

export function DropdownMenuDemo({ productId, product }: Props) {
    const [openDropdown, setOpenDropdown] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)

    // ! CONFLICTO CON RADIX UI CON EL ARIA-HIDDEN, RESUELTO CON setTimeout, (solucion robusta)

    const handleDeleteClick = () => {
        setOpenDropdown(false)
        setTimeout(() => setOpenDelete(true), 50)
    }

    const handleEditClick = () => {
        setOpenDropdown(false)
        setTimeout(() => setOpenEdit(true), 50)
    }

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={handleEditClick}>
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={handleDeleteClick}
                    >
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteProduct
                open={openDelete}
                setOpen={setOpenDelete}
                productId={productId}
            />
            <EditProduct
                open={openEdit}
                setOpen={setOpenEdit}
                product={product[0]}
            />
        </div>
    )
}

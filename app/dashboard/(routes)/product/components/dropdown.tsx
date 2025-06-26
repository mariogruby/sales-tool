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
    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)

    // console.log("product:", product)

    const handleDeleteClick = () => {
        setOpen(true)
    }
    

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
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
                    <DropdownMenuItem onClick={() => setOpenEdit(true)}>Editar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={handleDeleteClick}
                    >
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Drawer de eliminación */}
            <DeleteProduct
                open={open}
                setOpen={setOpen}
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

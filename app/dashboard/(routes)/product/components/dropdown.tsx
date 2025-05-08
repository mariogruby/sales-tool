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
import { DeleteProduct } from "./delete-product-modal"

type Props = {
    productId: string
}

export function DropdownMenuDemo({ productId }: Props) {
    const [open, setOpen] = useState(false)

    const handleDeleteClick = () => {
        setOpen(true)
    }

    return (
        <>
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
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Make a copy</DropdownMenuItem>
                    <DropdownMenuItem>Favorite</DropdownMenuItem>
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
        </>
    )
}

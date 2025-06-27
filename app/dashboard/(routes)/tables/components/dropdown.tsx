import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconDotsVertical } from "@tabler/icons-react"
import { DeleteTable } from "./delete-table-modal"

type Props = {
    tableNumber: number
}

export function DropdownMenuTable({ tableNumber }: Props) {
    const [openDropdown, setOpenDropdown] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    // ! CONFLICTO CON RADIX UI CON EL ARIA-HIDDEN, RESUELTO CON setTimeout, (solucion robusta)

    const handleDeleteClick = () => {
        setOpenDropdown(false)
        setTimeout(() => setOpenDelete(true), 50)
    }

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={handleDeleteClick}
                    >
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteTable
                open={openDelete}
                setOpen={setOpenDelete}
                tableNumber={tableNumber}
            />
        </div>
    )
}

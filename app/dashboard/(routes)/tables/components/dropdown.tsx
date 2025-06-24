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
    const [open, setOpen] = useState(false)

    const handleDeleteClick = () => {
        setOpen(true)
    }

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
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
                open={open}
                setOpen={setOpen}
                tableNumber={tableNumber}
            />
        </div>
    )
}

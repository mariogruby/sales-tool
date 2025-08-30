import * as React from "react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    // DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { useDeleteTable } from "@/hooks/tables/use-delete-table"
import { AlertCircleIcon, Loader2Icon } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

type DrawerDialogDemoProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    tableNumber: number
}

export function DeleteTable({ open, setOpen, tableNumber }: DrawerDialogDemoProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { deleteTable, loading, error } = useDeleteTable()

    // console.log("numero de mesa:", tableNumber) 

    const handleDelete = async () => {
        const success = await deleteTable(tableNumber)
        if (success) {
            setOpen(false)
        }
        setOpen(true)
    }

    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        ¿Estás seguro de que quieres eliminar esta Mesa?
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Esta acción no se puede deshacer
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4">
                    {error &&
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircleIcon />
                            <AlertTitle>Error:</AlertTitle>
                            <AlertDescription className="text-center">
                                {error}
                            </AlertDescription>
                        </Alert>}
                    <div className="flex justify-center items-center space-x-2">
                        <Button
                            onClick={() => setOpen(false)}
                            disabled={loading}
                            variant="outline"
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                "Eliminar"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="text-center">
                        ¿Estás seguro de que quieres eliminar esta Mesa?
                    </DrawerTitle>
                    {/* <DrawerDescription className="text-center">
                            Esta acción no se puede deshacer
                            </DrawerDescription> */}
                </DrawerHeader>
                <div className="p-4">
                    {error && <div className="text-red-500">{error}</div>}
                    <div className="flex justify-center items-center space-x-2">
                        <Button
                            onClick={() => setOpen(false)}
                            variant="outline"
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                "Eliminar"
                            )}
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )

}
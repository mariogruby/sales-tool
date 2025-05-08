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
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { useDeleteProduct } from "@/hooks/use-delete-product"

type DrawerDialogDemoProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    productId: string
}

export function DeleteProduct({ open, setOpen, productId }: DrawerDialogDemoProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { deleteProduct, loading, error } = useDeleteProduct()

    const handleDelete = async () => {
        await deleteProduct(productId)
        setOpen(false)
    }

    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>
                        ¿Estás seguro de que quieres eliminar este producto?
                    </DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4">
                    {error && <div className="text-red-500">{error}</div>}
                    <div className="flex justify-center items-center space-x-2">
                        <Button onClick={() => setOpen(false)} variant="outline">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            disabled={loading}
                        >
                            {loading ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Eliminar Producto</DrawerTitle>
                    <DrawerDescription>
                        ¿Estás seguro de que quieres eliminar este producto?
                    </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                    {error && <div className="text-red-500">{error}</div>}
                    <div className="flex justify-center items-center space-x-2">
                        <Button onClick={() => setOpen(false)} variant="outline">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            disabled={loading}
                        >
                            {loading ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

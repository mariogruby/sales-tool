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
import { AlertCircleIcon } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { useDeleteProduct } from "@/hooks/products/use-delete-product"
import { Loader2Icon } from "lucide-react"

type DrawerDialogDemoProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    productId: string
}

export function DeleteProduct({ open, setOpen, productId }: DrawerDialogDemoProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { deleteProduct, loading, error } = useDeleteProduct()

    const handleDelete = async () => {
        const success = await deleteProduct(productId)
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
                        ¿Estás seguro de que quieres eliminar este producto?
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
                        ¿Estás seguro de que quieres eliminar este producto?
                    </DrawerTitle>
                    {/* <DrawerDescription className="text-center">
                    Esta acción no se puede deshacer
                    </DrawerDescription> */}
                </DrawerHeader>
                <div className="p-4">
                    {error && <div className="text-red-500">{error}</div>}
                    <div className="flex flex-col justify-center items-center space-x-2 gap-2 w-full">
                        <Button
                            onClick={() => setOpen(false)}
                            variant="outline"
                            disabled={loading}
                            className="w-full"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            disabled={loading}
                            className="w-full"
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

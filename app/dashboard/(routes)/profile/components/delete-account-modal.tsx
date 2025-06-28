import * as React from "react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    // DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Loader2Icon } from "lucide-react"
import { useDeleteAccount } from "@/hooks/account/use-delete-account"

type DrawerDialogDemoProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function DeleteAccount({ open, setOpen }: DrawerDialogDemoProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { deleteAccount, loading, error } = useDeleteAccount()

    const handleDelete = async () => {
        await deleteAccount()
        setOpen(false)
    }

    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">Eliminar cuenta</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        ¿Estás seguro de que quieres eliminar esta cuenta?
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Esta acción no se puede deshacer
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4">
                    {error && <div className="text-red-500">{error}</div>}
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
                                "Eliminar cuenta"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="destructive">Eliminar cuenta</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="text-center">
                        ¿Estás seguro de que quieres eliminar esta cuneta?
                    </DrawerTitle>
                    <DrawerDescription className="text-center">
                        Esta acción no se puede deshacer
                    </DrawerDescription>
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
                                "Eliminar cuenta"
                            )}
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}


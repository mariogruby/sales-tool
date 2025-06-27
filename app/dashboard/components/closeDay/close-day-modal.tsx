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
import { useCloseDay } from "@/hooks/sales/use-close-day"
import { Loader2Icon } from "lucide-react"

type DrawerDialogDemoProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    dailySalesId?: string; // <-- nuevo
}

export function CloseDayModal({ open, setOpen, dailySalesId }: DrawerDialogDemoProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { closeDay, loading } = useCloseDay()

    const handleCloseDay = async () => {
        await closeDay(dailySalesId)
        setOpen(false)
    }
    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        ¿Estás seguro de que quieres cerrar el dia de ventas?
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Verifica que no hayan quedado ventas pendientes por facturar en mesas
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4">
                    {/* {error && <div className="text-red-500">{error}</div>} */}
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
                            onClick={handleCloseDay}
                            variant="destructive"
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Cerrando...
                                </>
                            ) : (
                                "Cerrar dia"
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
                        ¿Estás seguro de que quieres cerrar el dia de ventas?
                    </DrawerTitle>
                    <DrawerDescription className="text-center">
                        Verifica que no hayan quedado ventas pendientes por facturar en mesas
                    </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                    {/* {error && <div className="text-red-500">{error}</div>} */}
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
                            onClick={handleCloseDay}
                            variant="destructive"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Cerrando...
                                </>
                            ) : (
                                "Cerrar dia"
                            )}
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

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

type DrawerDialogDemoProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function CloseDayModal({ open, setOpen }: DrawerDialogDemoProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { closeDay, loading } = useCloseDay()

    const handleCloseDay = async () => {
        await closeDay()
        setOpen(false)
    }
    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>
                        ¿Estás seguro de que quieres cerrar el dia de ventas?
                    </DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4">
                    {/* {error && <div className="text-red-500">{error}</div>} */}
                    <div className="flex justify-center items-center space-x-2">
                        <Button onClick={() => setOpen(false)} variant="outline">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCloseDay}
                            variant="destructive"
                            disabled={loading}
                        >
                            {loading ? "Cerrando..." : "Cerrar dia"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>¿Estás seguro de que quieres cerrar el dia de ventas?</DrawerTitle>
                    <DrawerDescription>
                    </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                    {/* {error && <div className="text-red-500">{error}</div>} */}
                    <div className="flex justify-center items-center space-x-2">
                        <Button onClick={() => setOpen(false)} variant="outline">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCloseDay}
                            variant="destructive"
                            disabled={loading}
                        >
                            {loading ? "Cerrando..." : "Cerrar dia"}
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

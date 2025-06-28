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
import { signOut } from "next-auth/react"
import { Loader2Icon } from "lucide-react"


type DrawerDialogDemoProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Logout({ open, setOpen }: DrawerDialogDemoProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const [loading, setLoading] = React.useState(false)

    const handleLogout = async () => {
        setLoading(true)
        await signOut({ callbackUrl: "/sign-in" })
    }


    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        ¿Estás seguro de que quieres cerrar sesión?
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Verifica que no haya quedado pendiente cerrar un dia de ventas.
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
                            onClick={handleLogout}
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
                                "Cerrar sesión"
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
                        ¿Estás seguro de que quieres cerrar sesión?
                    </DrawerTitle>
                    <DrawerDescription className="text-center">
                        Verifica que no haya quedado pendiente cerrar un dia de ventas.
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
                            onClick={handleLogout}
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
                                "Cerrar sesión"
                            )}
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
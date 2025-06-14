import * as React from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { useDeleteSale } from "@/hooks/sales/use-delete-sale";
import { toast } from "sonner";

type DrawerDialogProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    saleId: string;
    onSuccess?: () => void; // para recargar la tabla
};

export function DeleteSale({ open, setOpen, saleId, onSuccess }: DrawerDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { deleteSale, loading } = useDeleteSale();
    const [error, setError] = React.useState<string | null>(null);

    const handleDelete = async () => {
        setError(null);
        const success = await deleteSale(saleId);
        if (success) {
            toast.success("Venta eliminada");
            setOpen(false);
            onSuccess?.();
        } else {
            setError("No se pudo eliminar la venta. Intenta nuevamente.");
        }
    };

    const content = (
        <>
            <div className="p-4">
                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                <div className="flex justify-center items-center space-x-2">
                    <Button onClick={() => setOpen(false)} variant="outline">
                        Cancelar
                    </Button>
                    <Button
                        className="cursor-pointer"
                        onClick={handleDelete}
                        variant="destructive"
                        disabled={loading}
                    >
                        {loading ? "Eliminando..." : "Eliminar"}
                    </Button>
                </div>
            </div>
        </>
    );

    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>
                        ¿Estás seguro de que quieres eliminar esta venta?
                    </DialogTitle>
                    <DialogDescription>
                        Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Eliminar Venta</DrawerTitle>
                    <DrawerDescription>
                        ¿Estás seguro de que quieres eliminar esta venta?
                    </DrawerDescription>
                </DrawerHeader>
                {content}
            </DrawerContent>
        </Drawer>
    );
}

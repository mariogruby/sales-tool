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
import { Loader2Icon } from "lucide-react";

type DrawerDialogProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    saleId: string;
    onSuccess?: () => void;
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
                <div className="flex flex-col md:flex-row justify-center gap-2">
                    <Button
                        onClick={() => setOpen(false)}
                        variant="outline"
                        disabled={loading}
                        className="w-full md:w-auto cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="w-full md:w-auto cursor-pointer"
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
        </>
    );

    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        ¿Estás seguro de que quieres eliminar esta venta?
                    </DialogTitle>
                    <DialogDescription className="text-center">
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
                    <DrawerTitle className="text-center">Eliminar Venta</DrawerTitle>
                    <DrawerDescription className="text-center">
                        ¿Estás seguro de que quieres eliminar esta venta?
                    </DrawerDescription>
                </DrawerHeader>
                {content}
            </DrawerContent>
        </Drawer>
    );
}

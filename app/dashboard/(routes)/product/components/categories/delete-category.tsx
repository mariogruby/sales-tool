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
import { AlertCircle, Loader2Icon } from "lucide-react";
import { useDeleteCategory } from "@/hooks/categories/use-delete-category";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type DeleteCategoryProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    categoryId: string;
    categoryName: string;
};

export function DeleteCategory({
    open,
    setOpen,
    categoryId,
    categoryName,
}: DeleteCategoryProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { deleteCategory, loading, error, setError } = useDeleteCategory();

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen); // <--- X button
        if (!isOpen) {
            setError("");
        }
    };

    const handleCancel = () => {
        setOpen(false); // <--- Cancelar button
        setError("");
    };
    

    const handleDelete = async () => {
        const success = await deleteCategory(categoryId);
        if (success) {
            setOpen(false);
        } else {
            setOpen(true)
        }
    };

    const title = `¿Estás seguro de eliminar la categoría "${categoryName}"?`;

    return isDesktop ? (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="text-center">{title}</DialogTitle>
                    <DialogDescription className="text-center">
                        Solo puedes eliminar categorías que no tengan productos.
                    </DialogDescription>
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error || "Ocurrió un error."}</AlertDescription>
                        </Alert>
                    )}
                </DialogHeader>
                <div className="p-4">
                    <div className="flex justify-center items-center space-x-2">
                        <Button
                            onClick={handleCancel}
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
                                    <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                                    Eliminando...
                                </>
                            ) : (
                                <>
                                    Eliminar
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="text-center">{title}</DrawerTitle>
                    <DrawerDescription className="text-center">
                        Solo puedes eliminar categorías que no tengan productos.
                    </DrawerDescription>
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error || "Ocurrió un error."}</AlertDescription>
                        </Alert>
                    )}
                </DrawerHeader>
                <div className="p-4">
                    <div className="flex flex-col justify-center items-center space-x-2 gap-2 w-full">
                        <Button
                            onClick={handleCancel}
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
                                    <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                                    Eliminando...
                                </>
                            ) : (
                                <>
                                    Eliminar
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

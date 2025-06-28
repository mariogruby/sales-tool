'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetClose,
    SheetFooter,
} from "@/components/ui/sheet";
import { Sale } from "@/hooks/sales/use-daily-sales";

interface ProductDetailsSheetProps {
    products: Sale['products'] | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductDetailsSheet({ products, isOpen, onClose }: ProductDetailsSheetProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full flex">
                <SheetHeader>
                    <SheetTitle>Detalles de Productos</SheetTitle>
                    <SheetDescription>Lista de productos de la venta seleccionada</SheetDescription>
                </SheetHeader>

                <div className="mt-4 p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {products && products.length > 0 ? (
                        <>
                            {products.map((p, idx) => (
                                <div
                                    key={idx}
                                    className="relative flex flex-col bg-primary-foreground rounded-xl border p-4 shadow-sm space-y-3"
                                >
                                    <div className="flex justify-between items-center ">
                                        <span className="font-medium">
                                            {p.productId?.name || "Producto eliminado"}
                                        </span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-sm text-muted-foreground">
                                            Precio: €
                                            <span className="font-mono">
                                                {p.price.toFixed(2)}
                                            </span>
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            Subtotal: €
                                            <span className="font-mono">
                                                {(p.price * p.quantity).toFixed(2)}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p className="text-muted-foreground">No hay productos para mostrar.</p>
                    )}
                </div>
                <Separator />
                <SheetFooter className="mt-4">
                    <SheetClose asChild>
                        <Button className="cursor-pointer">
                            Cerrar
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
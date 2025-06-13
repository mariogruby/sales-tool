'use client';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetClose,
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
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Detalles de Productos</SheetTitle>
                    <SheetDescription>Lista de productos de la venta seleccionada</SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                    {products && products.length > 0 ? (
                        <ul className="space-y-2">
                            {products.map((product, index) => (
                                <li key={index} className="flex justify-between border-b py-2">
                                    <span>{product.productId.name}</span>
                                    <span>
                                        x{product.quantity} -{" "}
                                        {new Intl.NumberFormat("es-ES", {
                                            style: "currency",
                                            currency: "EUR",
                                        }).format(product.price * product.quantity)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No hay productos para mostrar.</p>
                    )}
                </div>
                <SheetClose asChild>
                    <button className="mt-4 w-full rounded-md bg-gray-200 py-2 text-sm font-medium">
                        Cerrar
                    </button>
                </SheetClose>
            </SheetContent>
        </Sheet>
    );
}
"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCreateTableSale } from "@/hooks/use-create-sale-from-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTableStore } from "@/zustand/use-table-store";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useUpdateTableProducts } from "@/hooks/use-update-table-products";
import { CashCalculatorDialog } from "@/app/dashboard/footer/components/cash-calculator-modal";
import { DividedPaymentDialog } from "@/app/dashboard/footer/components/divided-payment-modal";

interface Product {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

interface Table {
    number: number;
    products: Product[];
}

interface TableDetailsProps {
    open: boolean;
    onClose: () => void;
    table: Table | null;
}

export function TableDetails({ open, onClose, table }: TableDetailsProps) {
    const [paymentType, setPaymentType] = useState<"efectivo" | "tarjeta" | "dividido">("efectivo");

    const {
        tableNumber,
        products,
        setTable,
        increaseQuantity,
        decreaseQuantity,
        removeProduct,
        reset,
    } = useTableStore();

    const { updateTableProducts } = useUpdateTableProducts();
    const { createTableSale, loading } = useCreateTableSale();

    useEffect(() => {
        if (table) {
            setTable(table.number, table.products);
        }
    }, [table]);

    if (!table) return null;

    const total = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

    const handleConfirmSale = async (cashAmount?: number, cardAmount?: number) => {
        const updated = await updateTableProducts({
            tableNumber: tableNumber!,
            products,
        });

        if (!updated) return;

        const saleData: Parameters<typeof createTableSale>[0] = {
            tableNumber: tableNumber!,
            paymentType,
            status: "pagado",
            products,
        };

        if (paymentType === "efectivo" && cashAmount !== undefined) {
            saleData.paymentDetails = { cashAmount, cardAmount: 0 };
        } else if (paymentType === "dividido" && cashAmount !== undefined && cardAmount !== undefined) {
            saleData.paymentDetails = { cashAmount, cardAmount };
        }

        const result = await createTableSale(saleData);

        if (result?.success) {
            reset();
            onClose();
        }
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-full max-w-md sm:max-w-lg flex flex-col">
                <SheetHeader>
                    <SheetTitle>Mesa {tableNumber}</SheetTitle>
                </SheetHeader>

                <div className="mt-4 p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {products.length === 0 ? (
                        <p className="text-center text-muted-foreground mt-10">No hay productos en esta mesa.</p>
                    ) : (
                        <div className="space-y-4">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="relative flex flex-col bg-white rounded-xl border p-4 shadow-sm space-y-3"
                                >
                                    {/* Botón de eliminar (X) */}
                                    <button
                                        onClick={() => removeProduct(product._id)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>

                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-800">{product.name}</span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1 rounded-md border px-2 py-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => decreaseQuantity(product._id)}
                                                disabled={product.quantity <= 1}
                                                className="sm:h-7 w-7 md:w-10 hover:bg-gray-100 disabled:opacity-40"
                                            >
                                                <Minus className="h-4 w-4 text-gray-600" />
                                            </Button>

                                            <span className="w-10 text-center text-sm">{product.quantity}</span>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => increaseQuantity(product._id)}
                                                className="sm:h-7 w-7 md:w-10 hover:bg-gray-100"
                                            >
                                                <Plus className="h-4 w-4 text-gray-600" />
                                            </Button>
                                        </div>

                                        <div className="flex flex-col text-right">
                                            <span className="text-sm text-muted-foreground">
                                                Precio: €
                                                <span className="font-mono">{product.price.toFixed(2)}</span>
                                            </span>
                                            <span className="text-sm font-semibold text-gray-700">
                                                Subtotal: €
                                                <span className="font-mono">
                                                    {(product.price * product.quantity).toFixed(2)}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-4 space-y-2">
                    <div className="text-xl font-bold text-right">
                        Total: €{total.toFixed(2)}
                    </div>

                    <Select
                        value={paymentType}
                        onValueChange={(value) => setPaymentType(value as "efectivo" | "tarjeta" | "dividido")}
                    >
                        <SelectTrigger className="w-full md:w-[140px] bg-white">
                            <SelectValue placeholder="Pago" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="efectivo">Efectivo</SelectItem>
                            <SelectItem value="tarjeta">Tarjeta</SelectItem>
                            <SelectItem value="dividido">Dividido</SelectItem>
                        </SelectContent>
                    </Select>

                    {paymentType === "efectivo" && (
                        <CashCalculatorDialog
                            total={total}
                            paymentType={paymentType}
                            onConfirmSale={(cashReceived) => handleConfirmSale(cashReceived)}
                            disabled={loading || products.length === 0}
                        />
                    )}
                    {paymentType === "dividido" && (
                        <DividedPaymentDialog
                            total={total}
                            onConfirmSale={(cashAmount, cardAmount) => handleConfirmSale(cashAmount, cardAmount)}
                            disabled={loading || products.length === 0}
                        />
                    )}
                </div>

                <SheetFooter className="mt-4 flex flex-col gap-2">
                    <Button
                        disabled={loading || products.length === 0}
                        onClick={() => handleConfirmSale()}
                    >
                        Confirmar venta
                    </Button>

                    <SheetClose asChild>
                        <Button variant="outline" onClick={onClose}>
                            Cerrar
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
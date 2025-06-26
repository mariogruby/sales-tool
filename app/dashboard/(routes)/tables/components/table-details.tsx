"use client";

import { useEffect, useState } from "react";
import { useCreateTableSale } from "@/hooks/sales/use-create-sale-from-table";
import { Button } from "@/components/ui/button";
import { useTableStore } from "@/zustand/use-table-store";
import { useUpdateTableProducts } from "@/hooks/tables/use-update-table-products";
import { CashCalculatorDialog } from "@/app/dashboard/footer/components/cash-calculator-modal";
import { DividedPaymentDialog } from "@/app/dashboard/footer/components/divided-payment-modal";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Plus,
    Minus,
    X,
    Loader2Icon,
} from "lucide-react";

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
    refetch: () => void
}

export function TableDetails({ open, onClose, table, refetch }: TableDetailsProps) {
    const [paymentType, setPaymentType] = useState<"efectivo" | "tarjeta" | "dividido">("tarjeta");
    const [editMode, setEditMode] = useState(false);

    const {
        tableNumber,
        products,
        setTable,
        increaseQuantity,
        decreaseQuantity,
        removeProduct,
        reset,
    } = useTableStore();

    const { updateTableProducts, loading: loadingUpdateTable } = useUpdateTableProducts();
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
            refetch()
        }
    };

    const handleConfirmUpdate = async () => {
        const updatedData = await updateTableProducts({
            tableNumber: tableNumber!,
            products,
        });
        if (updatedData) {
            onClose();
            refetch();
        }
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-full flex">
                <SheetHeader>
                    <SheetTitle className="text-center">Mesa {tableNumber}</SheetTitle>

                    <div className="flex items-center space-x-2">
                        <Switch id="edit-mode" checked={editMode} onCheckedChange={setEditMode} />
                        <Label htmlFor="edit-mode">Edit Mode</Label>
                    </div>

                </SheetHeader>

                <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {products.length === 0 ? (
                        <p className="text-center text-muted-foreground mt-10">No hay productos en esta mesa.</p>
                    ) : (
                        <div className="space-y-4">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="relative flex flex-col bg-primary-foreground rounded-xl border p-4 shadow-sm space-y-3"
                                >

                                    <button
                                        onClick={() => removeProduct(product._id)}
                                        disabled={!editMode}
                                        className={`absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer ${!editMode ? "opacity-40 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        <X className="w-6 h-6" />
                                    </button>

                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{product.name}</span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1 rounded-md border px-2 py-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => decreaseQuantity(product._id)}
                                                disabled={!editMode || product.quantity <= 1}
                                                className="sm:h-7 w-7 md:w-10 hover:bg-gray-100 disabled:opacity-40"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>

                                            <span className="w-10 text-center text-sm">{product.quantity}</span>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => increaseQuantity(product._id)}
                                                disabled={!editMode}
                                                className="sm:h-7 w-7 md:w-10 hover:bg-gray-100"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="flex flex-col text-right">
                                            <span className="text-sm text-muted-foreground">
                                                Precio: €
                                                <span className="font-mono">{product.price.toFixed(2)}</span>
                                            </span>
                                            <span className="text-sm font-semibold">
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

                <div className="border-t pt-4 text-center text-lg font-bold">
                    Total: €{total.toFixed(2)}
                </div>

                <SheetFooter className="mt-4">
                    <div className="space-y-2 flex flex-wrap gap-2">
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
                    {editMode && (
                        <Button
                            variant="secondary"
                            disabled={loading || products.length === 0 || loadingUpdateTable}
                            onClick={handleConfirmUpdate}
                        >
                            {loadingUpdateTable ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar cambios"
                            )}
                        </Button>
                    )}
                    <Button
                        disabled={loading || products.length === 0}
                        onClick={() => handleConfirmSale()}
                        className="cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2Icon className="animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Confirmar venta"
                        )}
                    </Button>

                    <SheetClose asChild>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="cursor-pointer"
                        >
                            Cerrar
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
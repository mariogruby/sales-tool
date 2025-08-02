"use client";

import { Loader2Icon, Minus, Plus, X } from "lucide-react";
import { useSaleStore } from "@/zustand/use-sale-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { CreditCard, Divide } from "lucide-react";
import { useCreateSale } from "@/hooks/sales/use-create-sale";
import { useAddProductsToTable } from "@/hooks/tables/use-add-products-to-table";
import { useEffect, useState } from "react";
import { SaleDetailsModal } from "./components/sale-details-modal";
import { CashCalculatorDialog } from "./components/cash-calculator-modal";
import { DividedPaymentDialog } from "./components/divided-payment-modal";
import { toast } from "sonner";
import { useTables } from "@/hooks/tables/use-tables";
import { PaymentType } from "@/zustand/use-sale-store";
import { IconCash } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

export function SiteFooter() {
    const {
        products,
        paymentType,
        // paymentDetails,
        setPaymentType,
        setStatus,
        clearSale,
        removeProduct,
    } = useSaleStore();

    const { createSale, loading } = useCreateSale();
    const { addProductsToTable, loading: addingToTableLoading } = useAddProductsToTable();
    const { tables, loading: loadingTables, refetch } = useTables();

    const [localProducts, setLocalProducts] = useState(products);
    const [selectedTableNumber, setSelectedTableNumber] = useState<number | null>(null);

    useEffect(() => {
        setLocalProducts(products);
    }, [products]);

    const handleQuantityChange = (index: number, value: number) => {
        if (value < 1) return;
        localProducts[index].quantity = value;
        setLocalProducts([...localProducts]);
        useSaleStore.setState({ products: [...localProducts] });
    };

    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const handleConfirmSale = async (cashAmount?: number, cardAmount?: number) => {
        if (selectedTableNumber) {
            const success = await addProductsToTable({
                tableNumber: selectedTableNumber,
                products,
            });

            if (success) {
                clearSale();
                setSelectedTableNumber(null);
                return refetch();
            }
            return;
        }

        if (paymentType === "dividido" && cashAmount !== undefined && cardAmount !== undefined) {
            const totalPaid = cashAmount + cardAmount;
            if (totalPaid !== total) {
                toast.error("La suma de efectivo y tarjeta debe ser igual al total de la venta.");
                return;
            }
            useSaleStore.setState({
                paymentDetails: { cashAmount, cardAmount },
            });
        } else if (paymentType === "efectivo" && cashAmount !== undefined) {
            useSaleStore.setState({
                paymentDetails: { cashAmount, cardAmount: 0 },
            });
        }

        setStatus("pagado");
        createSale();
    };

    if (products.length === 0) return null;

    return (
        <footer className="sticky bottom-0 z-20 w-full border-t bg-primary-foreground px-4 py-3 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 max-h-[180px] overflow-x-auto md:overflow-y-auto pr-2 flex gap-4 flex-nowrap md:flex-wrap items-start">
                    {products.map((p, idx) => (
                        <div
                            key={idx}
                            className="relative flex-shrink-0 md:flex-shrink bg-secondary  rounded-lg border-2 p-2 w-auto min-w-[140px]"
                        >
                            <button
                                onClick={() => removeProduct(p.productId)}
                                className="py-1 absolute top-1 right-1 text-red-500 hover:text-red-700 cursor-pointer"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex justify-between items-center gap-2">
                                <span className="font-medium truncate max-w-[100px]">
                                    {p.name.charAt(0).toUpperCase() + p.name.slice(1).toLocaleLowerCase()}
                                </span>
                            </div>

                            <div className="mt-2 flex flex-col gap-2">
                                <div className="flex items-center gap-1 rounded-md p-1 border">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleQuantityChange(idx, p.quantity - 1)}
                                        disabled={p.quantity <= 1}
                                        className="h-8 w-8 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>

                                    <Input
                                        className="w-12 text-center border-transparent bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        value={p.quantity}
                                        min={1}
                                        onChange={(e) => handleQuantityChange(idx, Number(e.target.value))}
                                    />

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleQuantityChange(idx, p.quantity + 1)}
                                        className="h-8 w-8 hover:bg-gray-100"
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>

                                <span className="font-semibold font-mono text-sm text-right">
                                    €{(p.price * p.quantity).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3 md:gap-2 md:justify-between min-w-full md:min-w-[300px] border-t md:border-t-0 md:border-l border-gray-300 pt-4 md:pt-0 md:pl-4">
                    <SaleDetailsModal>
                        <Button variant="outline" className="w-full md:w-auto cursor-pointer">
                            Ver detalles
                        </Button>
                    </SaleDetailsModal>

                    {paymentType === "efectivo" && (
                        <CashCalculatorDialog
                            total={total}
                            paymentType={paymentType}
                            onConfirmSale={(cashReceived) => handleConfirmSale(cashReceived)}
                            disabled={loading || addingToTableLoading}
                        />
                    )}
                    {paymentType === "dividido" && (
                        <DividedPaymentDialog
                            total={total}
                            onConfirmSale={(cashAmount, cardAmount) => handleConfirmSale(cashAmount, cardAmount)}
                            disabled={loading || addingToTableLoading}
                        />
                    )}
                    <ToggleGroup
                        type="single"
                        value={paymentType}
                        onValueChange={(value) => {
                            if (value) setPaymentType(value as PaymentType);
                        }}
                        className="flex w-full md:w-auto gap-1"
                    >
                        <ToggleGroupItem value="efectivo" aria-label="Pago en efectivo" className="w-10 h-10 border">
                            <IconCash className="!w-8 !h-8" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="tarjeta" aria-label="Pago con tarjeta" className="w-10 h-10 border">
                            <CreditCard className="!w-8 !h-8" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="dividido" aria-label="Pago dividido" className="w-10 h-10 border">
                            <Divide className="!w-8 !h-8" />
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <div className="">
                        <Select
                            value={selectedTableNumber?.toString() || ""}
                            onValueChange={(value) => setSelectedTableNumber(Number(value))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Mesa (opcional)" />
                            </SelectTrigger>
                            <SelectContent className="max-h-54 overflow-auto">
                                {loadingTables ? (
                                    <div className="p-2 text-sm text-gray-500">Cargando mesas...</div>
                                ) : tables.length === 0 ? (
                                    // <div className="p-2 text-sm text-gray-500">No hay mesas</div>
                                    null
                                ) : (
                                    tables.map((table) => (
                                        <SelectItem key={table._id} value={table.number.toString()} className="flex justify-between items-center text-lg">
                                            <div className="flex items-center gap-2">
                                                <span>Mesa {table.number} - {table.location}</span>
                                                <Badge className={table.isOccupied ? "bg-destructive" : "bg-green-500"}>
                                                    {table.isOccupied ? "Ocupada" : "Libre"}
                                                </Badge>
                                            </div>
                                        </SelectItem>

                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="font-bold text-center text-lg md:text-xl">
                        Total: €<span className="font-mono">{total.toFixed(2)}</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <Button
                            variant="destructive"
                            onClick={() => {
                                clearSale();
                                setSelectedTableNumber(null);
                            }}
                            disabled={loading || addingToTableLoading}
                            className="w-full md:w-auto cursor-pointer"
                        >
                            Cancelar venta
                        </Button>
                        <Button
                            onClick={() => handleConfirmSale()}
                            disabled={loading || addingToTableLoading}
                            className="w-full md:w-auto cursor-pointer"
                        >
                            {loading || addingToTableLoading ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Guardando...
                                </>
                            ) : selectedTableNumber ? (
                                "Agregar a mesa"
                            ) : (
                                "Confirmar venta"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
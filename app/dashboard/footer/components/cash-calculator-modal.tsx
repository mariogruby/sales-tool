"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { NumericKeypad } from "@/components/common/numeric-keypad";
import { ResponsiveModal } from "@/components/common/responsive-modal";

interface CashCalculatorDialogProps {
    total: number;
    onConfirmSale: (cashReceived: number) => void;
    disabled?: boolean;
}

export function CashCalculatorDialog({
    total,
    onConfirmSale,
    disabled = false,
}: CashCalculatorDialogProps) {
    const [cashReceived, setCashReceived] = useState("");
    const [open, setOpen] = useState(false);

    const numericValue = parseFloat(cashReceived || "0");
    const change = numericValue - total;

    const handleKeyPress = (key: string) => {
        if (key === "C") {
            setCashReceived("");
        } else if (key === "←") {
            setCashReceived((prev) => prev.slice(0, -1));
        } else if (key === "." && cashReceived.includes(".")) {
            return;
        } else {
            setCashReceived((prev) => prev + key);
        }
    };

    const handleConfirm = () => {
        if (numericValue < total) {
            toast.error("El monto entregado en efectivo debe ser mayor o igual al total de la venta.", {
                style: { background: "red" },
            });
            return;
        }
        onConfirmSale(numericValue);
        setOpen(false);
        setCashReceived("");
    };

    const trigger = (
        <Button variant="outline" className="w-full md:w-auto cursor-pointer" disabled={disabled}>
            Calcular cambio
        </Button>
    );

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={setOpen}
            trigger={trigger}
            title="Calcular Cambio"
            description="Ingresa el monto en efectivo."
            dialogClassName="space-y-4"
        >
            <Card className="border-none bg-background shadow-none p-0">
                <CardContent className="flex flex-col gap-4 px-0">
                    <div className="text-center space-y-2">
                        <p className="text-xl font-bold">
                            Total: <span className="font-mono">€{total.toFixed(2)}</span>
                        </p>
                        <div className="text-xl font-mono rounded border px-4 py-2">
                            Efectivo: €{cashReceived || "0.00"}
                        </div>
                    </div>

                    <NumericKeypad onKeyPress={handleKeyPress} />

                    <div
                        className={`text-xl text-center font-mono rounded px-4 py-2 ${
                            change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                    >
                        Cambio: €{change.toFixed(2)}
                    </div>

                    <Button
                        onClick={handleConfirm}
                        disabled={disabled || numericValue < total}
                        className="w-full cursor-pointer"
                    >
                        {disabled ? (
                            <>
                                <Loader2Icon className="animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Confirmar venta"
                        )}
                    </Button>
                </CardContent>
            </Card>
        </ResponsiveModal>
    );
}

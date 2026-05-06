"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { NumericKeypad } from "@/components/common/numeric-keypad";
import { ResponsiveModal } from "@/components/common/responsive-modal";

interface DividedPaymentDialogProps {
    total: number;
    onConfirmSale: (cashAmount: number, cardAmount: number) => void;
    disabled?: boolean;
}

export function DividedPaymentDialog({
    total,
    onConfirmSale,
    disabled = false,
}: DividedPaymentDialogProps) {
    const [cashInput, setCashInput] = useState("");
    const [cardInput, setCardInput] = useState("");
    const [activeField, setActiveField] = useState<"cash" | "card">("cash");
    const [open, setOpen] = useState(false);

    const cash = parseFloat(cashInput || "0");
    const card = parseFloat(cardInput || "0");
    const remaining = total - (cash + card);

    const handleKeyPress = (key: string) => {
        const current = activeField === "cash" ? cashInput : cardInput;
        const setter = activeField === "cash" ? setCashInput : setCardInput;

        if (key === "C") {
            setter("");
        } else if (key === "←") {
            setter(current.slice(0, -1));
        } else if (key === "." && current.includes(".")) {
            return;
        } else {
            setter(current + key);
        }
    };

    const handleConfirm = () => {
        if (remaining !== 0) {
            toast.error("La suma de efectivo y tarjeta debe ser igual al total.", {
                style: { background: "red" },
            });
            return;
        }
        onConfirmSale(cash, card);
        setOpen(false);
        setCashInput("");
        setCardInput("");
    };

    const trigger = (
        <Button variant="outline" className="w-full md:w-auto cursor-pointer" disabled={disabled}>
            Ingresar montos
        </Button>
    );

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={setOpen}
            trigger={trigger}
            title="Pago dividido"
            description="Ingresa efectivo y tarjeta"
            dialogClassName="space-y-4"
        >
            <Card className="border-none bg-background shadow-none p-0">
                <CardContent className="flex flex-col gap-4 px-0">
                    <div className="text-center space-y-2">
                        <p className="text-xl font-bold">
                            Total: <span className="font-mono">€{total.toFixed(2)}</span>
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setActiveField("cash")}
                                className={`px-4 py-2 rounded font-mono text-lg ${
                                    activeField === "cash" ? "border border-blue-500" : ""
                                }`}
                            >
                                Efectivo: €{cashInput || "0.00"}
                            </button>

                            <button
                                onClick={() => setActiveField("card")}
                                className={`px-4 py-2 rounded font-mono text-lg ${
                                    activeField === "card" ? "border border-blue-500" : ""
                                }`}
                            >
                                Tarjeta: €{cardInput || "0.00"}
                            </button>
                        </div>
                    </div>

                    <NumericKeypad onKeyPress={handleKeyPress} />

                    <div
                        className={`text-xl text-center font-mono rounded px-4 py-2 ${
                            remaining === 0
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                        {remaining === 0 ? "Montos correctos" : `Faltan: €${remaining.toFixed(2)}`}
                    </div>

                    <Button
                        onClick={handleConfirm}
                        disabled={disabled || remaining !== 0}
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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

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
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [cashInput, setCashInput] = useState("");
    const [cardInput, setCardInput] = useState("");
    const [activeField, setActiveField] = useState<"cash" | "card">("cash");
    const [open, setOpen] = useState(false);

    const cash = parseFloat(cashInput || "0");
    const card = parseFloat(cardInput || "0");
    const totalPaid = cash + card;
    const remaining = total - totalPaid;

    const handleKeyPress = (key: string) => {
        const currentValue = activeField === "cash" ? cashInput : cardInput;

        if (key === "C") {
            updateField("");
        } else if (key === "←") {
            updateField(currentValue.slice(0, -1));
        } else if (key === "." && currentValue.includes(".")) {
            return;
        } else {
            updateField(currentValue + key);
        }
    };

    const updateField = (value: string) => {
        if (activeField === "cash") {
            setCashInput(value);
        } else {
            setCardInput(value);
        }
    };

    const handleConfirm = () => {
        if (totalPaid !== total) {
            toast.error("La suma de efectivo y tarjeta debe ser igual al total.", {
                style: {
                    background: 'red',
                },
            });
            return;
        }

        onConfirmSale(cash, card);
        setOpen(false);
        setCashInput("");
        setCardInput("");
    };

    const Keypad = () => {
        const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "←"];

        return (
            <div className="grid grid-cols-3 gap-2">
                {keys.map((key) => (
                    <Button
                        key={key}
                        variant="secondary"
                        className="text-xl py-6 border"
                        onClick={() => handleKeyPress(key)}
                    >
                        {key}
                    </Button>
                ))}
                <Button
                    className="col-span-3 bg-destructive"
                    onClick={() => handleKeyPress("C")}
                >
                    Limpiar
                </Button>
            </div>
        );
    };

    const content = (
        <Card className="border-none bg-background shadow-none p-0">
            <CardContent className="flex flex-col gap-4 px-0">
                <div className="text-center space-y-2">
                    <p className="text-xl font-bold">
                        Total: <span className="font-mono">€{total.toFixed(2)}</span>
                    </p>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setActiveField("cash")}
                            className={`px-4 py-2 rounded font-mono text-lg ${activeField === "cash" ? "border border-blue-500" : ""
                                }`}
                        >
                            Efectivo: €{cashInput || "0.00"}
                        </button>

                        <button
                            onClick={() => setActiveField("card")}
                            className={`px-4 py-2 rounded font-mono text-lg ${activeField === "card" ? "border border-blue-500" : ""
                                }`}
                        >
                            Tarjeta: €{cardInput || "0.00"}
                        </button>
                    </div>
                </div>

                <Keypad />

                <div
                    className={`text-xl text-center font-mono rounded px-4 py-2 ${remaining === 0 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
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
    );

    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto cursor-pointer" disabled={disabled}>
                    Ingresar montos
                </Button>
            </DialogTrigger>
            <DialogContent className="space-y-4">
                <DialogHeader className="text-center">
                    <DialogTitle className="mx-auto">Pago dividido</DialogTitle>
                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="w-full" disabled={disabled}>
                    Ingresar montos
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Pago dividido</DrawerTitle>
                    <DrawerDescription>Ingresa efectivo y tarjeta</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-6">{content}</div>
            </DrawerContent>
        </Drawer>
    );
}
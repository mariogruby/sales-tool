"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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

interface CashCalculatorDialogProps {
    total: number;
    paymentType: "efectivo" | "tarjeta" | "dividido";
    onConfirmSale: (cashReceived: number) => void;
    disabled?: boolean;
}

export function CashCalculatorDialog({
    total,
    paymentType,
    onConfirmSale,
    disabled = false,
}: CashCalculatorDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [cashReceived, setCashReceived] = useState<string>("");
    const [open, setOpen] = useState(false);

    const numericValue = parseFloat(cashReceived || "0");
    const changeToReturn = paymentType === "efectivo" ? numericValue - total : null;

    const handleKeyPress = (key: string) => {
        if (key === "C") {
            setCashReceived("");
        } else if (key === "←") {
            setCashReceived(cashReceived.slice(0, -1));
        } else if (key === "." && cashReceived.includes(".")) {
            return;
        } else {
            setCashReceived((prev) => prev + key);
        }
    };

    const handleConfirm = () => {
        if (numericValue < total) {
            toast.error("El monto entregado en efectivo debe ser mayor o igual al total de la venta.", {
                style: {
                    background: 'red',
                },
            });
            return;
        }
        onConfirmSale(numericValue);
        setOpen(false);
        setCashReceived("");
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
                    <div className="text-xl font-mono rounded border px-4 py-2">
                        Efectivo: €{cashReceived || "0.00"}
                    </div>
                </div>

                <Keypad />

                {paymentType === "efectivo" && (
                    <div
                        className={`text-xl text-center font-mono rounded px-4 py-2 ${changeToReturn !== null && changeToReturn >= 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        Cambio: €{(changeToReturn ?? -total).toFixed(2)}
                    </div>
                )}

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
    );

    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto cursor-pointer" disabled={disabled}>
                    Calcular cambio
                </Button>
            </DialogTrigger>
            <DialogContent className="space-y-4">
                <DialogHeader className="text-center">
                    <DialogTitle className="mx-auto">Calcular Cambio</DialogTitle>
                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="w-full" disabled={disabled}>
                    Calcular cambio
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Calcular Cambio</DrawerTitle>
                    <DrawerDescription>Ingresa el monto en efectivo.</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-6">{content}</div>
            </DrawerContent>
        </Drawer>
    );
}
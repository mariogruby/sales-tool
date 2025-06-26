"use client";

import React, { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Dialog,
    //   DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    //   DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import {
    Card,
    CardContent,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExtraordinarySale } from "@/hooks/sales/use-extraordinary-sale";
import {
    Loader2Icon,
    Wallet,
    CreditCard,
} from "lucide-react";


interface ExtraordinarySaleModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function ExtraordinarySaleModal({ open, setOpen }: ExtraordinarySaleModalProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { createExtraordinarySale, loading } = useExtraordinarySale();

    const [cashAmount, setCashAmount] = useState("");
    const [cardAmount, setCardAmount] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cash = parseFloat(cashAmount);
        const card = parseFloat(cardAmount);

        if (isNaN(cash) || cash < 0) {
            alert("Ingrese un monto válido para efectivo");
            return;
        }
        if (isNaN(card) || card < 0) {
            alert("Ingrese un monto válido para tarjeta");
            return;
        }
        if (cash + card === 0) {
            alert("El total no puede ser 0");
            return;
        }

        const result = await createExtraordinarySale(cash, card);
        if (result?.success) {
            setCashAmount("");
            setCardAmount("");
            setOpen(false);
        }
    };

    const content = (
        <>
            <form onSubmit={handleSubmit} className="p-2">
                <Card className="border-none bg-background shadow-none">
                    <CardContent className="space-y-6 px-0">
                        <div>
                            <Label htmlFor="cashAmount" className="text-sm">Monto en efectivo</Label>
                            <div className="relative mt-1">
                                <Wallet className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="cashAmount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={cashAmount}
                                    onChange={(e) => setCashAmount(e.target.value)}
                                    placeholder="0.00"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="cardAmount" className="text-sm">Monto en tarjeta</Label>
                            <div className="relative mt-1">
                                <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="cardAmount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={cardAmount}
                                    onChange={(e) => setCardAmount(e.target.value)}
                                    placeholder="0.00"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col md:flex-row justify-center gap-2 w-full">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={loading}
                            onClick={() => setOpen(false)}
                            className="w-full md:w-auto cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </>
    );

    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Crear Venta Extraordinaria</DialogTitle>
                    <DialogDescription className="text-center">Ingrese los montos para efectivo y tarjeta</DialogDescription>
                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="text-center">Crear Venta Extraordinaria</DrawerTitle>
                    <DrawerDescription className="text-center">Ingrese los montos para efectivo y tarjeta</DrawerDescription>
                </DrawerHeader>
                {content}
            </DrawerContent>
        </Drawer>
    );
}
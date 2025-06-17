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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExtraordinarySale } from "@/hooks/sales/use-extraordinary-sale";

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
            <form onSubmit={handleSubmit} className="space-y-4 p-4 min-w-[300px]">
                <div>
                    <Label htmlFor="cashAmount">Monto en efectivo</Label>
                    <Input
                        id="cashAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        placeholder="0.00"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="cardAmount">Monto en tarjeta</Label>
                    <Input
                        id="cardAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={cardAmount}
                        onChange={(e) => setCardAmount(e.target.value)}
                        placeholder="0.00"
                        required
                    />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer"
                    >
                        {loading ? "Creando..." : "Crear Venta"}
                    </Button>
                </div>
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
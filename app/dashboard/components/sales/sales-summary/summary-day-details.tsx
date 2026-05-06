import {
    SheetClose,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
    Wallet,
    CreditCard,
} from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

interface SummaryDayContentProps {
    totalDay: number;
    cashTotal: number;
    cardTotal: number;
}

export function SummaryDayContent({ totalDay, cashTotal, cardTotal }: SummaryDayContentProps) {

    return (
        <>
            <SheetHeader>
                <SheetTitle>Detalles de las ventas de hoy</SheetTitle>
                <SheetDescription>
                    Podrás ver aquí las cantidades en tarjeta y efectivo contabilizadas hasta el momento.
                </SheetDescription>
            </SheetHeader>
            <div className="mt-6 border-t pt-4 text-center text-lg font-bold space-y-2">
                <div className="font-semibold flex items-center justify-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Efectivo: €{formatPrice(cashTotal)}
                </div>
                <div className="font-semibold flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Tarjeta: €{formatPrice(cardTotal)}
                </div>
            </div>
            <SheetFooter className="mt-4">
                <div className="mt-6 border-t pt-4 text-center text-lg font-bold">
                    Total: €{totalDay.toFixed(2)}
                </div>
                <SheetClose asChild>
                    <Button className="cursor-pointer">Cerrar</Button>
                </SheetClose>
            </SheetFooter>
        </>
    );
}

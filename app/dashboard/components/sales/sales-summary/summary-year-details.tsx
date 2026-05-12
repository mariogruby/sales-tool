import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Wallet, CreditCard } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

interface SummaryYearContentProps {
  cashYearTotal: number;
  cardYearTotal: number;
}

export function SummaryYearContent({
  cashYearTotal,
  cardYearTotal,
}: SummaryYearContentProps) {
  return (
    <>
      <SheetHeader>
        <SheetTitle>Detalles de las ventas del año</SheetTitle>
        <SheetDescription>
          Podrás ver aquí las cantidades en tarjeta y efectivo contabilizadas
          hasta el momento en el año.
        </SheetDescription>
      </SheetHeader>
      <div className="mt-6 border-t pt-4 text-center text-lg font-bold space-y-2">
        <div className="font-semibold flex items-center justify-center gap-2">
          <Wallet className="w-5 h-5" />
          Efectivo: €{formatPrice(cashYearTotal)}
        </div>
        <div className="font-semibold flex items-center justify-center gap-2">
          <CreditCard className="w-5 h-5" />
          Tarjeta: €{formatPrice(cardYearTotal)}
        </div>
      </div>
      <SheetFooter className="mt-4">
        <SheetClose asChild>
          <Button className="cursor-pointer">Cerrar</Button>
        </SheetClose>
      </SheetFooter>
    </>
  );
}

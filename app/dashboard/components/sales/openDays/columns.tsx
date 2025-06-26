"use client";

import { ColumnDef } from "@tanstack/react-table";
import { OpenDay } from "@/hooks/sales/use-sales-summary";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";

export function useOpenDaysColumns(onOpenModal: (dailySalesId: string) => void): ColumnDef<OpenDay>[] {
  return [
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) =>
        new Date(row.getValue("date")).toLocaleDateString("es-ES"),
    },
    {
      accessorKey: "saleCount",
      header: "N° de ventas",
    },
    {
      accessorKey: "totalAmount",
      header: "Total vendido",
      cell: ({ row }) => {
        const amount = formatPrice(parseFloat(row.getValue("totalAmount")));
        return `€${amount}`;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const dailySalesId = row.original._id;

        return (
          <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onOpenModal(dailySalesId)}
          className="cursor-pointer"
          >
            Cerrar día
          </Button>
        );
      },
    },
  ];
}

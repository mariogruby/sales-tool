"use client";

import { ColumnDef } from "@tanstack/react-table";
import { OpenDay } from "@/hooks/sales/use-sales-summary";
import { Button } from "@/components/ui/button";

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
        const amount = parseFloat(row.getValue("totalAmount"));
        return new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: "EUR",
        }).format(amount);
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

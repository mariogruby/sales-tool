// lib/recentSalesColumns.ts
import { ColumnDef } from "@tanstack/react-table";
import { RecentSale } from "@/hooks/sales/use-sales-summary";

export const recentSalesColumns: ColumnDef<RecentSale>[] = [
    {
        accessorKey: "date",
        header: "Fecha",
        cell: ({ row }) =>
            new Date(row.getValue("date")).toLocaleDateString("es-ES"),
    },
    {
        accessorKey: "closedAt",
        header: "Hora de cierre",
        cell: ({ row }) => {
            const value = row.getValue("closedAt");
            return value
                ? new Date(value).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : "—";
        },
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
];

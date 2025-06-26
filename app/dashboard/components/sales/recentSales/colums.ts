import { ColumnDef } from "@tanstack/react-table";
import { RecentSale } from "@/hooks/sales/use-sales-summary";
import { formatPrice } from "@/lib/formatPrice";

export const recentSalesColumns: ColumnDef<RecentSale>[] = [
    {
        accessorKey: "date",
        header: "Fecha",
        cell: ({ row }) =>
            new Date(row.getValue("date") as string).toLocaleDateString("es-ES"),
    },
    {
        accessorKey: "closedAt",
        header: "Hora de cierre",
        cell: ({ row }) => {
            const value = row.getValue("closedAt") as string | null;
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
            const amount = formatPrice(
                parseFloat(row.getValue("totalAmount") as string)
            );
            return `€${amount}`;
        },
    },
];

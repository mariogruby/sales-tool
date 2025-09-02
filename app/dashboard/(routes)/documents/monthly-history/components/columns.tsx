"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatPrice } from "@/lib/formatPrice";
import { MonthlyTotal } from "@/hooks/sales/use-monthy";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ActionsCell = ({ month }: { month: string }) => {
    const router = useRouter();
    return (
        <Button
            onClick={() => router.push(`/dashboard/documents/monthly-history/${month}`)}
            variant="link"
            className="cursor-pointer"
            size="sm"
        >
            Ver detalles
        </Button>
    );
};

export const monthlyColumns: ColumnDef<MonthlyTotal>[] = [
    {
        accessorKey: 'month',
        header: 'Mes',
        cell: ({ row }) =>
            new Date(row.getValue('month')).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
    },
    {
        accessorKey: 'efectivo',
        header: 'Efectivo',
        cell: ({ row }) => `€${formatPrice(parseFloat(row.getValue('efectivo') as string))}`,
    },
    {
        accessorKey: 'tarjeta',
        header: 'Tarjeta',
        cell: ({ row }) => `€${formatPrice(parseFloat(row.getValue('tarjeta') as string))}`,
    },
    {
        accessorKey: "total",
        header: "Total vendido",
        cell: ({ row }) => `€${formatPrice(parseFloat(row.getValue("total") as string))}`,
    },
    {
        accessorKey: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const monthValue = row.getValue('month');
            return <ActionsCell month={String(monthValue)} />;
        },
    },
];

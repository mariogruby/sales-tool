import { ColumnDef } from "@tanstack/react-table";
import { Sale } from "@/hooks/sales/use-daily-sales";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconCircleCheckFilled } from "@tabler/icons-react"

export function dailySalesColumns(onOpenModal: (products: Sale['products']) => void): ColumnDef<Sale>[] {
    return [
        {
            accessorKey: "createdAt",
            header: "Fecha",
            cell: ({ row }) =>
                new Date(row.getValue("createdAt")).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("total"));
                return new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                }).format(amount);
            },
        },
        {
            accessorKey: "status",
            header: "Status", // Cambiado de "Status" a "Estado"
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <Badge variant="outline">
                        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                        {status === "pagado" ? "Pagado" : "Pendiente"}
                    </Badge>
                )
                // return status === "pagado" ? "Pagado" : "Pendiente";
            },
        },
        {
            accessorKey: "paymentType",
            header: "Tipo de Pago",
            cell: ({ row }) => {
                const paymentType = row.getValue("paymentType") as string;
                return paymentType === "efectivo"
                    ? "Efectivo"
                    : paymentType === "tarjeta"
                        ? "Tarjeta"
                        : "Dividido";
            },
        },
        {
            accessorKey: "products",
            header: "Productos",
            cell: ({ row }) => {
                const products = row.getValue("products") as Sale['products'];
                return (
                    <Button
                        variant="link"
                        className="cursor-pointer"
                        size="sm"
                        onClick={() => onOpenModal(products)}
                    >
                        Ver detalles
                    </Button>
                );
            },
        },
    ];
}

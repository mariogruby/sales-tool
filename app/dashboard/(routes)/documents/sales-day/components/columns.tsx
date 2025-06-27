import { ColumnDef } from "@tanstack/react-table";
import { Sale } from "@/hooks/sales/use-daily-sales";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconCircleCheckFilled, IconDotsVertical } from "@tabler/icons-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPrice } from "@/lib/formatPrice";

export function dailySalesColumns(
    onOpenModal: (products: Sale["products"]) => void,
    onDelete: (saleId: string) => void
): ColumnDef<Sale>[] {
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
                const amount = formatPrice(parseFloat(row.getValue("total")));
                return `€${amount}`;
            },
        },
        {
            accessorKey: "status",
            header: "Estado",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <Badge variant="outline">
                        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400 mr-1" />
                        {status === "pagado" ? "Pagado" : "Pendiente"}
                    </Badge>
                );
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
                const products = row.getValue("products") as Sale["products"];
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
        {
            id: "actions",
            cell: ({ row }) => {
                const sale = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                            <IconDotsVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => onDelete(sale._id)}
                            >
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}

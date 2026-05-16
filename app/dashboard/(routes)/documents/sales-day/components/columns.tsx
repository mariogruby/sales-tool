import { ColumnDef } from "@tanstack/react-table";
import { SaleClient as Sale } from "@/types/sale-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { formatPrice } from "@/lib/formatPrice";
import { DropdownMenuDemo } from "./dropdown";

export function dailySalesColumns(
  onOpenModal: (products: Sale["products"]) => void,
  onDeleteSale: () => void,
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
          <DropdownMenuDemo
            saleId={sale._id}
            products={sale.products}
            total={sale.total}
            onDelete={onDeleteSale}
          />
        );
      },
    },
  ];
}

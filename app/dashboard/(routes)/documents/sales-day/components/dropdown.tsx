import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { useDeleteSale } from "@/hooks/sales/use-delete-sale";
import { ModalDeleteConfirmation } from "@/components/common/modal-delete-confirmation";
import { SendInvoiceDialog } from "@/components/common/send-invoice-dialog";
import { SaleProductPopulated } from "@/types/sale-client";

type Props = {
  saleId: string;
  products: SaleProductPopulated[];
  total: number;
  onDelete: () => void;
};

export function DropdownMenuDemo({ saleId, products, total, onDelete }: Props) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const { deleteSale, loading, error } = useDeleteSale();

  const handleDeleteClick = () => {
    setOpenDropdown(false);
    setTimeout(() => setOpenDelete(true), 50);
  };

  const handleInvoiceClick = () => {
    setOpenDropdown(false);
    setTimeout(() => setOpenInvoice(true), 50);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteSale(saleId);
    if (success) {
      setOpenDelete(false);
      onDelete();
    }
  };

  const invoiceItems = products.map((p) => ({
    name: p.productId.name,
    quantity: p.quantity,
    price: p.price,
  }));

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <IconDotsVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleInvoiceClick}>
            Generar factura
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={handleDeleteClick}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SendInvoiceDialog
        open={openInvoice}
        setOpen={setOpenInvoice}
        items={invoiceItems}
        total={total}
      />

      <ModalDeleteConfirmation
        open={openDelete}
        title="¿Estás seguro de que quieres eliminar esta venta?"
        description="Esta acción no se puede deshacer"
        confirmLabel="Eliminar"
        loading={loading}
        error={error ?? undefined}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenDelete(false)}
      />
    </div>
  );
}

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
import { ModalDeleteConfirmation } from "@/shared/modalDeleteConfirmation";

type Props = {
  saleId: string;
  onDelete: () => void;
};

export function DropdownMenuDemo({ saleId, onDelete }: Props) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { deleteSale, loading, error } = useDeleteSale();

  const handleDeleteClick = () => {
    setOpenDropdown(false);
    setTimeout(() => setOpenDelete(true), 50);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteSale(saleId);
    if (success) {
      setOpenDelete(false);
      onDelete();
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <IconDotsVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" onClick={handleDeleteClick}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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

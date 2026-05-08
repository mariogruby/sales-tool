import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { useDeleteTable } from "@/hooks/tables/use-delete-table";
import { ModalDeleteConfirmation } from "@/components/common/modal-delete-confirmation";

type Props = {
  tableNumber: number;
};

export function TableDropdown({ tableNumber }: Props) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { deleteTable, loading, error } = useDeleteTable();

  // setTimeout resuelve conflicto de aria-hidden con Radix UI al encadenar modales
  const handleDeleteClick = () => {
    setOpenDropdown(false);
    setTimeout(() => setOpenDelete(true), 50);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteTable(tableNumber);
    if (success) setOpenDelete(false);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={handleDeleteClick}
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalDeleteConfirmation
        open={openDelete}
        title="¿Estás seguro de que quieres eliminar esta mesa?"
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

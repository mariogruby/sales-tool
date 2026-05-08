import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { ModalDeleteConfirmation } from "@/components/common/modal-delete-confirmation";
import { useDeleteProduct } from "@/hooks/products/use-delete-product";
import { EditProduct } from "./products/edit-product";
import { ProductClient } from "@/types/product-client";

type Props = {
  productId: string;
  product: ProductClient[];
};

export function ProductDropdown({ productId, product }: Props) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { deleteProduct, loading, error } = useDeleteProduct();

  // setTimeout resuelve conflicto de aria-hidden con Radix UI al encadenar modales
  const handleDeleteClick = () => {
    setOpenDropdown(false);
    setTimeout(() => setOpenDelete(true), 50);
  };

  const handleEditClick = () => {
    setOpenDropdown(false);
    setTimeout(() => setOpenEdit(true), 50);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteProduct(productId);
    if (success) setOpenDelete(false);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={handleEditClick}>Editar</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleDeleteClick}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalDeleteConfirmation
        open={openDelete}
        title="¿Estás seguro de que quieres eliminar este producto?"
        description="Esta acción no se puede deshacer"
        confirmLabel="Eliminar"
        loading={loading}
        error={error ?? undefined}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenDelete(false)}
      />
      <EditProduct open={openEdit} setOpen={setOpenEdit} product={product[0]} />
    </div>
  );
}

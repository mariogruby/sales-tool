
'use client';

import { useState } from "react";
import { DailySalesTable } from "./components/data-table-sales-day";
import { dailySalesColumns } from "./components/columns";
import { useDailySales } from "@/hooks/sales/use-daily-sales";
import { ProductDetailsSheet } from "./components/products-details";
import { Sale } from "@/hooks/sales/use-daily-sales";
import { DeleteSale } from "./components/delete-sale-modal";
import { ProtectedRouteGuard } from "@/app/security/protectedRouteGuard";
import { usePathname } from "next/navigation";

export default function Page() {
    const { sales, page, totalPages, loading, error, setPage, refetch } = useDailySales();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<Sale['products'] | null>(null);

    const handleOpenModal = (products: Sale['products']) => {
        setSelectedProducts(products);
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setSelectedProducts(null);
    };

    const handleDeleteClick = (id: string) => {
        setSaleToDelete(id);
        setDeleteModalOpen(true);
    };

    const pathname = usePathname()

    return (
        <ProtectedRouteGuard route={pathname}>
            <div className="p-4 max-w-full overflow-x-auto">
                <h1 className="mb-4 text-lg font-semibold">Ventas Diarias</h1>
                <DailySalesTable
                    columns={dailySalesColumns(handleOpenModal, handleDeleteClick)}
                    data={sales}
                    loading={loading}
                    error={error}
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                />
                <ProductDetailsSheet
                    products={selectedProducts}
                    isOpen={isSheetOpen}
                    onClose={handleCloseSheet}
                />
                {saleToDelete && (
                    <DeleteSale
                        open={deleteModalOpen}
                        setOpen={setDeleteModalOpen}
                        saleId={saleToDelete}
                        onSuccess={() => {
                            refetch(); // recarga ventas sin cambiar la página
                        }}
                    />
                )}
            </div>
        </ProtectedRouteGuard>
    );
}

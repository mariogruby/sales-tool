import { useState } from "react";
import { toast } from "sonner";
import { useSaleStore } from "@/zustand/use-sale-store";
import { useCreateSale } from "@/hooks/sales/use-create-sale";
import { useAddProductsToTable } from "@/hooks/tables/use-add-products-to-table";
import { useTables } from "@/hooks/tables/use-tables";
import { PaymentType } from "@/types/sale-client";

export function useSiteFooter() {
    const {
        products,
        paymentType,
        setPaymentType,
        setStatus,
        clearSale,
        removeProduct,
    } = useSaleStore();

    const { createSale, loading } = useCreateSale();
    const { addProductsToTable, loading: addingToTableLoading } = useAddProductsToTable();
    const { refetch } = useTables();

    const [selectedTableNumber, setSelectedTableNumber] = useState<number | null>(null);

    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const handleQuantityChange = (productId: string, value: number) => {
        if (value < 1) return;
        const updated = products.map((p) => (p.productId === productId ? { ...p, quantity: value } : p));
        useSaleStore.setState({ products: updated });
    };

    const handleConfirmSale = async (cashAmount?: number, cardAmount?: number) => {
        if (selectedTableNumber) {
            const success = await addProductsToTable({ tableNumber: selectedTableNumber, products });
            if (success) {
                clearSale();
                setSelectedTableNumber(null);
                refetch();
            }
            return;
        }

        if (paymentType === "dividido" && cashAmount !== undefined && cardAmount !== undefined) {
            if (cashAmount + cardAmount !== total) {
                toast.error("La suma de efectivo y tarjeta debe ser igual al total de la venta.", {
                    style: { background: "red" },
                });
                return;
            }
            useSaleStore.setState({ paymentDetails: { cashAmount, cardAmount } });
        } else if (paymentType === "efectivo" && cashAmount !== undefined) {
            useSaleStore.setState({ paymentDetails: { cashAmount, cardAmount: 0 } });
        }

        setStatus("pagado");
        createSale();
    };

    const handleCancelSale = () => {
        clearSale();
        setSelectedTableNumber(null);
    };

    const handleAddToTable = async (tableNumber: number) => {
        const success = await addProductsToTable({ tableNumber, products });
        if (success) {
            clearSale();
            setSelectedTableNumber(null);
            refetch();
        }
    };

    return {
        products,
        paymentType,
        setPaymentType: setPaymentType as (type: PaymentType) => void,
        selectedTableNumber,
        setSelectedTableNumber,
        total,
        loading,
        addingToTableLoading,
        removeProduct,
        handleQuantityChange,
        handleConfirmSale,
        handleCancelSale,
        handleAddToTable,
    };
}

import { useState } from "react";
import { toast } from "sonner";
import { PaymentDetails, PaymentType, SaleStatus } from "@/types/sale-client";
import { TableProductClient } from "@/types/table-client";

export function useCreateTableSale() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const createTableSale = async ({
        tableNumber,
        paymentType,
        paymentDetails,
        status = "pagado",
    }: {
        tableNumber: number;
        paymentType: PaymentType;
        paymentDetails?: PaymentDetails;
        status?: SaleStatus;
        products: TableProductClient[];
    }) => {
        try {
            setLoading(true);

            const res = await fetch("/api/sales/addSaleFromTable", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tableNumber,
                    paymentType,
                    paymentDetails,
                    status,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Venta de mesa registrada con éxito", {
                    style: {
                        background: 'green',
                    },
                });
                return { success: true };
            } else {
                setError(data.message || "Error al crear la venta desde mesa");
                toast.error(data.message || "Error al crear la venta desde mesa", {
                    style: {
                        background: 'red',
                    },
                });
                return { success: false };
            }
        } catch (err) {
            console.error(err);
            setError("Error de red o del servidor");
            toast.error("Error de red o del servidor", {
                style: {
                    background: 'red',
                },
            });
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { createTableSale, loading, error };
}

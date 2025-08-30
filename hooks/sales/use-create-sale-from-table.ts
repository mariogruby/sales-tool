import { useState } from "react";
import { toast } from "sonner";
import { Product } from "../tables/use-table-by-number";

interface PaymentDetails {
    cashAmount: number;
    cardAmount: number;
}

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
        paymentType: "efectivo" | "tarjeta" | "dividido";
        paymentDetails?: PaymentDetails;
        status?: "pagado" | "pendiente";
        products: Product[];
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

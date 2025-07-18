import { useState } from "react";
import { useSalesSummaryStore } from "@/zustand/use-sales-summary-store";
import { toast } from "sonner";

export function useExtraordinarySale() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { refetchSummary } = useSalesSummaryStore();

    const createExtraordinarySale = async (cashAmount: number, cardAmount: number) => {

        if (cashAmount < 0 || cardAmount < 0) {
            setError("Los montos no pueden ser negativos");
            toast.error("Los montos no pueden ser negativos");
            return { success: false };
        }

        if (cashAmount + cardAmount === 0) {
            setError("El total no puede ser 0");
            toast.error("El total no puede ser 0");
            return { success: false };
        }

        try {
            setLoading(true);

            const saleData = {
                paymentDetails: {
                    cashAmount,
                    cardAmount,
                },
            };

            const res = await fetch("/api/sales/extraordinarySale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(saleData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Venta extraordinaria creada con éxito");
                if (refetchSummary) {
                    refetchSummary(); // <--- summary
                }
                return { success: true };
            } else {
                setError(data.message || "Error al crear la venta extraordinaria");
                toast.error(data.message || "Error al crear la venta extraordinaria");
                return { success: false };
            }
        } catch (err) {
            console.error(err);
            setError("Error de red o del servidor");
            toast.error("Error de red o del servidor");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { createExtraordinarySale, loading, error };
}

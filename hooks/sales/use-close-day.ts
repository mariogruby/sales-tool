import { useState } from "react"
import { toast } from "sonner"
import { useSalesSummaryStore } from "@/zustand/use-sales-summary-store";
import { useDailySales } from "./use-daily-sales";

export function useCloseDay() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { refetchSummary, refetchGraph } = useSalesSummaryStore();
    const { refetch } = useDailySales()

    const closeDay = async (dailySalesId?: string) => {
        try {
            setLoading(true);

            const res = await fetch("/api/sales/closeDay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dailySalesId }) // puede ser undefined,
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Día cerrado exitosamente", {
                    style: {
                        background: 'green',
                    },
                });
                if (refetchSummary && refetchGraph) {
                    refetchSummary(); // <--- summary 
                    refetchGraph() // <-- graph
                    refetch() // <--- daily sales list
                }
                return { success: true, data: data.totalSales };
            } else {
                setError(data.message || "Error al cerrar el día");
                toast.error(data.message || "Error al cerrar el día", {
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

    return { closeDay, loading, error };
}


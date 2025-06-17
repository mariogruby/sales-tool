import { useState } from "react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useSalesSummaryStore } from "@/zustand/use-sales-summary-store";

export function useCloseDay() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { refetchSummary } = useSalesSummaryStore();

    const closeDay = async (dailySalesId?: string) => {
        try {
            setLoading(true);

            const res = await fetch("/api/sales/closeDay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    restaurantId: session?.user?.id,
                    dailySalesId, // puede ser undefined
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Día cerrado exitosamente");
                if (refetchSummary) {
                    refetchSummary();
                }
                return { success: true, data: data.totalSales };
            } else {
                setError(data.message || "Error al cerrar el día");
                toast.error(data.message || "Error al cerrar el día");
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

    return { closeDay, loading, error };
}


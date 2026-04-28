import { useCallback, useEffect, useState } from "react";
import { useSalesSummaryStore } from "@/zustand/use-sales-summary-store";
import { OpenDay, RecentSale, SalesSummary } from "@/types/sale-client";

export type { OpenDay, RecentSale, SalesSummary };

export function useSalesSummary() {
    const [summary, setSummary] = useState<SalesSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { setRefetchSummary } = useSalesSummaryStore();

    const fetchSalesSummary = useCallback(async () => {

        try {
            setLoading(true);
            const res = await fetch("/api/sales/summary")

            const data = await res.json();

            if (res.ok) {
                setSummary(data);
            } else {
                setError(data.message || "Error al obtener los datos de ventas");
            }
        } catch (err) {
            console.error(err);
            setError("Error de red o del servidor");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSalesSummary();
    }, [fetchSalesSummary]);

    useEffect(() => {
        setRefetchSummary(fetchSalesSummary);
    }, [fetchSalesSummary, setRefetchSummary]);

    return { summary, loading, error, refetch: fetchSalesSummary };
}
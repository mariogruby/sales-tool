/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { SaleClient } from "@/types/sale-client";

export type { SaleClient };

export function useDailySales() {
    const [sales, setSales] = useState<SaleClient[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSales = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/sales/dailySales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page }),
            });

            const data = await res.json();

            if (res.ok) {
                setSales(data.sales);
                setTotalPages(data.totalPages);
            } else {
                console.error(data.message);
                setError(data.message || "Error desconocido");
                setSales([]);
            }
        } catch (error) {
            console.error("Error al obtener ventas diarias", error);
            setError("Error de red o del servidor");
            setSales([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [page]);

    return {
        sales,
        page,
        totalPages,
        loading,
        error,
        setPage,
        refetch: fetchSales,
    };
}

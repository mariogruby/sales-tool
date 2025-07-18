import { useEffect, useState } from "react";

export interface TotalSales {
    _id: string;
    totalAmount: number;
    saleCount: number;
    date: string;
    closedAt?: string;
}

export function useTotalSales() {
    const [sales, setSales] = useState<TotalSales[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await fetch("/api/sales/totalSales", {
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
                    setError(data.message);
                }
            } catch (error) {
                console.error("Error al obtener ventas", error);
                setError("Error de red o del servidor");
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [page]);

    return {
        sales,
        page,
        totalPages,
        loading,
        error,
        setPage,
    };
}

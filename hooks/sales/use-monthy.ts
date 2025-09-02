import { useEffect, useState } from "react";

export interface MonthlyTotal {
    month: string; // "YYYY-MM"
    total: number;
    efectivo: number;
    tarjeta: number;
}

export function useMonthly() {
    const [monthly, setMonthly] = useState<MonthlyTotal[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    useEffect(() => {
    const fetchMonthly = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/sales/monthly", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page }),
            });

            const data = await res.json();

            if (res.ok) {
                setMonthly(data.items);
                setTotalPages(data.totalPage)
            } else {
                setError(data.message || "Error al obtener los totales mensuales");
            }
        } catch (err) {
            console.error(err);
            setError("Error de red o del servidor");
        } finally {
            setLoading(false);
        }
    };
    fetchMonthly();
},[page]);

    return {
        monthly,
        page,
        setPage,
        totalPages,
        loading,
        error,
    };
}

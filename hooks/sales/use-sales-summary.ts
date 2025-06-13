import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export interface RecentSale {
    _id: string;
    totalAmount: number;
    saleCount: number;
    date: string;
    closedAt?: string;
  }
  
  export interface OpenDay {
    _id: string;
    date: string;
    totalAmount: number;
    saleCount: number;
    isClosed: boolean;
  }

interface SalesSummary {
    day: number;
    month: number;
    year: number;
    changeDay: number;
    changeMonth: number;
    changeYear: number;
    recentSales?: RecentSale[];
    openDays?: OpenDay[];
}

export function useSalesSummary() {
    const { data: session } = useSession();
    const [summary, setSummary] = useState<SalesSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSalesSummary = async () => {
            if (!session?.user?.id) return;

            try {
                setLoading(true);
                const res = await fetch("/api/sales/summary", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ restaurantId: session.user.id }),
                });

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
        };

        fetchSalesSummary();
    }, [session]);

    return { summary, loading, error };
}

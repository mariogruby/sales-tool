import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export interface Sale {
    _id: string;
    products: {
        productId: {
            _id: string;
            name: string;
            price: number;
        };
        quantity: number;
        price: number;
    }[];
    status: "pagado" | "pendiente";
    paymentType: "efectivo" | "tarjeta" | "dividido";
    paymentDetails: {
        cashAmount: number;
        cardAmount: number;
    };
    total: number;
    createdAt: string;
}

export function useDailySales() {
    const { data: session } = useSession();
    const [sales, setSales] = useState<Sale[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSales = async () => {
            if (!session?.user?.id) return;

            try {
                setLoading(true);
                const res = await fetch("/api/sales/dailySales", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ restaurantId: session.user.id, page }),
                });

                const data = await res.json();
                if (res.ok) {
                    setSales(data.sales);
                    setTotalPages(data.totalPage); // Ajustado al nombre en tu ruta (totalPage)
                } else {
                    console.error(data.message);
                    setError(data.message);
                }
            } catch (error) {
                console.error("Error al obtener ventas diarias", error);
                setError("Error de red o del servidor");
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [page, session]);

    return {
        sales,
        page,
        totalPages,
        loading,
        error,
        setPage,
    };
}
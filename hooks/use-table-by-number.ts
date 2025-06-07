import { useState } from "react";
import { useSession } from "next-auth/react";

export interface Product {
    _id: string;
    name: string;
    price: number;
}

export interface TableWithProducts {
    _id: string;
    number: number;
    location: string;
    isOccupied: boolean;
    products: Product[];
}

export function useTableByNumber() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [table, setTable] = useState<TableWithProducts | null>(null);

    const fetchTableByNumber = async (tableNumber: number) => {
        if (!session?.user?.id) return;

        setLoading(true);
        setError("");
        setTable(null);

        try {
            const res = await fetch("/api/table/getByNumber", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    restaurantId: session.user.id,
                    tableNumber,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Error al obtener la mesa");
                return;
            }

            setTable(data.table);
            console.log("Mesa con productos:", data.table); // 👈 Incluye productos
        } catch (err) {
            console.error("Error en fetchTableByNumber:", err);
            setError("Error de red o del servidor");
        } finally {
            setLoading(false);
        }
    };

    return { table, fetchTableByNumber, loading, error };
}

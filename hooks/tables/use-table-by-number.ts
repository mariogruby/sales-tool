import { useState } from "react";

export interface Product {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface TableWithProducts {
    _id: string;
    number: number;
    location: string;
    isOccupied: boolean;
    products: Product[];
}

export function useTableByNumber() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [table, setTable] = useState<TableWithProducts | null>(null);

    const fetchTableByNumber = async (tableNumber: number) => {

        setLoading(true);
        setError("");
        setTable(null);

        try {
            const res = await fetch("/api/table/getByNumber", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tableNumber }),
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

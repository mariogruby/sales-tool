import { useEffect, useState } from "react";

export interface Table {
    _id: string;
    number: number;
    location: string;
    isOccupied: boolean;
}

export function useTables() {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchTables = async () => {

        setLoading(true);
        
        try {
            const res = await fetch("/api/table/getTables")
            
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.message || "Error al obtener las mesas");
                return;
            }
            setTables(data.tables);
        } catch (err) {
            console.error("Error en fetchTables:", err);
            setError("Error de red o del servidor");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchTables();
    }, []);

    return { tables, loading, error, refetch: fetchTables};
}

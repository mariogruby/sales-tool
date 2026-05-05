/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useTableStore } from "@/zustand/use-table-store";
import { TableClient } from "@/types/table-client";

export type { TableClient };

export function useTables() {
    const { tables, setTables, setRefetchTables } = useTableStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchTables = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/table/getTables");
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
    }, []);

    useEffect(() => {
        setRefetchTables(fetchTables);
    }, [fetchTables, setRefetchTables]);

    useEffect(() => {
        fetchTables();
    }, []);

    return { tables, loading, error, refetch: fetchTables };
}

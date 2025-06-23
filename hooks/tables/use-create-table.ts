import { useState } from "react";
import { toast } from "sonner";

interface TableDataSingle {
    location: string;
}

export function useCreateTable() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const createTable = async (tables: TableDataSingle[]) => {

        try {
            setLoading(true);

            const res = await fetch("/api/table/addTable", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tables }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Mesas creadas con éxito");
                return { success: true, tables: data.tables };
            } else {
                setError(data.message || "Error al crear las mesas");
                toast.error(data.message || "Error al crear las mesas");
                return { success: false };
            }
        } catch (err) {
            console.error(err);
            setError("Error de red o del servidor");
            toast.error("Error de red o del servidor");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { createTable, loading, error };
}
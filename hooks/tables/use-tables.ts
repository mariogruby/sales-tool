import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export interface Table {
    _id: string;
    number: number;
    location: string;
    isOccupied: boolean;
}

export function useTables() {
    const { data: session } = useSession();
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTables = async () => {
            if (!session?.user?.id) return;

            setLoading(true);

            try {
                const res = await fetch("/api/table/getTables", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ restaurantId: session.user.id }),
                });

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

        fetchTables();
    }, [session]);

    return { tables, loading, error };
}

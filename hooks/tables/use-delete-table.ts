import { useState } from "react"
import { useTableStore } from "@/zustand/use-table-store"
import { toast } from "sonner";


export function useDeleteTable() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const removeTable = useTableStore((state) => state.removeTable)

    const deleteTable = async (tableNumber: number) => {
        setLoading(true)
        try {
            const res = await fetch("/api/table/deleteTable", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tableNumber })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Error al intentar eliminar la mesa")
                toast.error("Error al intentar elimianar la mesa")
                return false
            }
            removeTable(tableNumber)
            toast.success(`Mesa ${tableNumber} eliminada`)
            return true

        } catch (error) {
            console.error("Error eliminando mesa", error);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return { deleteTable, loading, error }
}

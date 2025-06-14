import { useSession } from "next-auth/react";
import { useState } from "react";

export function useDeleteSale() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const deleteSale = async (saleId: string): Promise<boolean> => {
        if (!session?.user?.id) return false;

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/sales/deleteSale", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    saleId,
                    restaurantId: session.user.id,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Error al eliminar la venta");
                return false;
            }

            return true;
        } catch (err) {
            console.error("Error al eliminar la venta", err);
            setError("Error de red o del servidor");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteSale,
        loading,
        error,
    };
}

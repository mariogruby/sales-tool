import { useState } from "react";
import { toast } from "sonner";
import { Product } from "./use-table-by-number";

export const useUpdateTableProducts = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(undefined)

    const updateTableProducts = async ({
        tableNumber,
        products,
    }: {
        tableNumber: number;
        products: Product[];
    }) => {
        setLoading(true)
        try {
            const res = await fetch("/api/table/updateProducts", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tableNumber, products }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Error al realizar cambios en la mesa", {
                    style: {
                        background: 'red',
                    },
                });
                setError(data.message || "Error al realizar cambios en la mesa");
                return false;
            }

            toast.success(data.message, {
                style: {
                    background: 'green',
                },
            })
            return true;
        } catch (err) {
            console.error(err);
            toast.error("Error al actualizar productos", {
                style: {
                    background: 'red',
                },
            });
            return false;
        } finally {
            setLoading(false)
        }
    };

    return { updateTableProducts, loading, error };
};

import { useState } from "react";
import { toast } from "sonner";

interface Product {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export const useAddProductsToTable = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")

    const addProductsToTable = async ({
        tableNumber,
        products,
    }: {
        tableNumber: number;
        products: Product[];
    }) => {

        try {
            setLoading(true);
            const res = await fetch(`/api/table/${tableNumber}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tableNumber, products }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError("Error al agregar productos");
                toast.error(data.error, {
                    style: {
                        background: 'red',
                    },
                })
            }

            toast.success("Productos agregados a la mesa", {
                style: {
                    background: 'green',
                },
            });
            return true;
        } catch (error) {
            console.error(error);
            toast.error("No se pudo agregar productos a la mesa", {
                style: {
                    background: 'red',
                },
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { addProductsToTable, loading, error };
};

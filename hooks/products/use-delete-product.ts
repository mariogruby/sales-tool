import { useState } from "react";
import { useProductStore } from "@/zustand/use-products-store";
import { toast } from "sonner";

export function useDeleteProduct() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const removeProduct = useProductStore((state) => state.removeProduct);

    const deleteProduct = async (productId: string) => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/product/deleteProduct", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId }),
            });

            const data = await res.json();

            if (res.ok) {
                removeProduct(productId);
                toast.success("Producto eliminado correctamente")
                return true;
            } else {
                setError(data.message || "Failed to delete product");
                console.error(data.message);
                toast.error("Error al eliminar producto", {
                    style: {
                        background: 'red',
                    },
                })
                return false;
            }
        } catch (err) {
            console.error("Error deleting product:", err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return { deleteProduct, loading, error };
}

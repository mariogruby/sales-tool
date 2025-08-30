import { useState } from "react";
import { useProductStore } from "@/zustand/use-products-store";
import { toast } from "sonner";
import { IProduct } from "@/types/product";

export function useEditProduct() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const setProducts = useProductStore((state) => state.setProducts);
    const products = useProductStore((state) => state.products);

    const editProduct = async (form: {
        productId: string;
        name: string;
        price: string;
        isAvailable: boolean;
        categoryId: string;
    }) => {
        setLoading(true);

        try {
            const res = await fetch("/api/product/editProduct", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                const updatedProduct: IProduct = data.product;

                // Actualizar producto en el store
                const updatedProducts = products.map((p) =>
                    p._id === updatedProduct._id ? updatedProduct : p
                );
                setProducts(updatedProducts);

                toast.success("Producto actualizado correctamente");
                return { success: true };
            } else {
                toast.error("Error al actualizar producto", {
                    style: {
                        background: 'red',
                    },
                });
                setError(data.message);
                return { success: false, message: data.message };
            }
        } catch (err) {
            console.error(err);
            setError("Error de red o del servidor");
            toast.error("Error de red o del servidor", {
                style: {
                    background: 'red',
                },
            });
        }
        finally {
            setLoading(false)
        }
    };

    return { editProduct, loading, error };
}

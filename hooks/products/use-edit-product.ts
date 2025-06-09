import { useSession } from "next-auth/react";
import { useState } from "react";
import { useProductStore } from "@/zustand/use-products-store"
import { toast } from "sonner";
import { IProduct } from '../types/product';

export function useEditProduct() {
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const setProducts = useProductStore((state) => state.setProducts)
    const products = useProductStore((state) => state.products)

    const editProduct = async (form: {
        productId: string
        name: string
        price: string
        isAvailable: boolean
        categoryId: string
        restaurantId: string
    }) => {
        setLoading(true)

        const res = await fetch("/api/product/editProduct", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                restaurantId: session?.user?.id,
            }),
        })

        const data = await res.json()
        if (res.ok) {
            const updatedProduct: IProduct = data.product

            // Actualizar producto en el store
            const updatedProducts = products.map((p) =>
                p._id === updatedProduct._id ? updatedProduct : p
            )
            setProducts(updatedProducts)

            toast.success("Producto actualizado correctamente")
            setLoading(false)
            return { success: true }
        } else {
            toast.error("Error al actualizar producto")
            setError(data.message)
            setLoading(false)
            return { success: false, message: data.message }
        }
    }
    return { editProduct, loading, error }

}
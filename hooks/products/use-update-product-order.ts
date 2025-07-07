import { useState } from "react"
import { toast } from "sonner"
import { useProductStore } from "@/zustand/use-products-store"
import { ProductClient } from "@/types/product-client"

export function useUpdateProductOrder() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const setProducts = useProductStore((state) => state.setProducts)

    const updateOrder = async (orderedProducts: ProductClient[]) => {
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/product/updateOrder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    products: orderedProducts.map((p, index) => ({
                        _id: p._id,
                        order: index,
                    })),
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Error al actualizar el orden")
                toast.error("No se pudo guardar el orden")
                return
            }

            // Actualizar orden local en el store
            const updated: ProductClient[] = orderedProducts.map((p, index) => ({
                _id: p._id,
                name: p.name,
                price: p.price,
                isAvailable: p.isAvailable ?? true,
                category: p.category,
                restaurant: p.restaurant,
                order: index,
            }))

            setProducts(updated)
            //   toast.success("Orden guardado correctamente")
        } catch (err) {
            console.error(err)
            setError("Error de red o del servidor")
            toast.error("Error al actualizar el orden")
        } finally {
            setLoading(false)
        }
    }

    return {
        updateOrder,
        loading,
        error,
    }
}

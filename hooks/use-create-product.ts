// hooks/use-create-product.ts
import { useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { useProductStore } from "@/zustand/use-products-store"
import { IProduct } from "@/types/product"

export function useCreateProduct() {
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const addProduct = useProductStore((state) => state.addProduct)

    const createProduct = async (form: {
        name: string;
        price: string;
        isAvailable: boolean;
        categoryId: string;
    }) => {
        setLoading(true)

        const res = await fetch("/api/product/addProduct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                restaurantId: session?.user?.id,
            }),
        })

        const data = await res.json()

        if (res.ok) {
            const newProduct: IProduct = data.product
            addProduct(newProduct) // 👉 actualiza Zustand store
            toast.success("Producto creado exitosamente")
            setLoading(false)
            return { success: true }
        } else {
            toast.error("Error al crear producto: " + data.message)
            setLoading(false)
            return { success: false, message: data.message }
        }
    }

    return { createProduct, loading }
}

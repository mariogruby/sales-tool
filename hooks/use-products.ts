import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { IProduct } from "@/types/product"

export function useProducts() {
    const { data: session } = useSession()
    const [products, setProducts] = useState<IProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchProducts = async () => {
            if (!session?.user?.id) return

            try {
                const res = await fetch('/api/product/getProduct', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ restaurantId: session.user.id }),
                })

                const data = await res.json()

                if (res.ok) {
                    setProducts(data.products)
                } else {
                    setError(data.message)
                    console.error(data.message)
                }
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [session])

    return { products, loading, error }
}

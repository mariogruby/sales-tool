import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { ICategory } from '@/types/category';

export function useCategories() {
    const { data: session } = useSession()
    const [categories, setCategories] = useState<ICategory[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchCategories = async () => {
            if (!session?.user?.id) return

            try {
                const res = await fetch('/api/category/getCategories', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ restaurantId: session.user.id }),
                })

                const data = await res.json()

                if (res.ok) {
                    setCategories(data.categories)
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

        fetchCategories()
    }, [session])

    return { categories, loading, error }
}

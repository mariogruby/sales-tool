"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface Product {
    _id: string
    name: string
    price: number
}

export function AllProducts() {
    const { data: session } = useSession()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

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

    if (loading) return <div className="p-4">Loading products...</div>

    return (
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {products.map((product) => (
                <Card key={product._id} className="@container/card">
                    <CardHeader>
                        <CardDescription></CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {product.name}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconTrendingUp />
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            €{product.price}
                        </div>
                        <div className="text-muted-foreground">
                            ID: {product._id}
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

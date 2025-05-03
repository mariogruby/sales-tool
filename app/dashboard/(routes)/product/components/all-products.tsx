import { IProduct } from "@/types/product"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IconTrendingUp } from "@tabler/icons-react"

interface AllProductsProps {
    products: IProduct[]
    loading: boolean
    error: string
}

export function AllProducts({ products, loading, error }: AllProductsProps) {
    if (loading) return <div className="p-4">cargando productos...</div>
    if (error) return <div className="p-4">{error}</div>

    return (
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {products.map((product) => (
                <Card key={product._id} className="@container/card">
                    <CardHeader>
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

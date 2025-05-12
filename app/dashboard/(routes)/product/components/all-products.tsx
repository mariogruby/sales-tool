// import { useState } from "react"
// import { Badge } from "@/components/ui/badge"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// CardAction, 
// import { IconTrendingUp } from "@tabler/icons-react"
import { IProduct } from "@/types/product"
import { DropdownMenuDemo } from "./dropdown"
import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface AllProductsProps {
    products: IProduct[]
    loading: boolean
    error: string
}

export function AllProducts({ loading, error, products }: AllProductsProps) {

    if (loading) return <div className="p-4">Cargando productos...</div>

    return (
        <>
            {!loading && !error && products.length === 0 && (
                <div className="flex items-center justify-center h-[300px]">
                    <div className="p-4">
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>No hay productos creados</AlertTitle>
                            {/* <AlertDescription></AlertDescription> */}
                        </Alert>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                {products.map((product) => (
                    <Card key={product._id} className="@container/card">
                        <CardHeader className="flex justify-between items-start">
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {product.name}
                            </CardTitle>
                            <DropdownMenuDemo productId={product._id} product={[product]} />
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1.5 text-xl">
                            <div className="line-clamp-1 flex gap-2 font-medium">
                                €{product.price}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {error && (
                <div className="flex items-center justify-center h-[300px]">
                    <div className="p-4">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error || "Ocurrió un error."}</AlertDescription>
                        </Alert>
                    </div>
                </div>
            )}
        </>
    )
}

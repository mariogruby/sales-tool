"use client"

import { useProductsByCategory } from "@/hooks/use-by-category";
import { Card, CardAction, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

interface ByCategoryProps {
    categoryId?: string;
}

export default function ProductsByCategories({ categoryId }: ByCategoryProps) {
    const { products, loading, error } = useProductsByCategory(categoryId);

    return (
        <div className="mt-6">
            {error && <p className="text-red-500 mb-4">Error: {error}</p>}
            {loading && <p>Cargando productos...</p>}
            {!loading && products.length === 0 && <p>No hay productos para esta categoría.</p>}
            {!loading && products.length > 0 && (
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
            )}
        </div>
    );
}

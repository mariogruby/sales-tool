"use client"

import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { ProductSkeleton } from "./skeletons"
import { SortableProduct } from "./sortable-product"
import { useAllProducts } from "@/hooks/products/use-all-products"

interface AllProductsProps {
    loading: boolean
    error: string
    selectedCategory: string
}

export function AllProducts({ loading, error, selectedCategory }: AllProductsProps) {
    const { orderedProducts, isSortingEnabled, sensors, handleAddToSale, handleDragEnd } =
        useAllProducts(selectedCategory)

    return (
        <>
            {loading && <ProductSkeleton />}

            {!loading && !error && orderedProducts.length === 0 && (
                <div className="flex items-center justify-center h-[300px]">
                    <div className="p-4">
                        <Alert variant="default">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>No hay productos en esta sección</AlertTitle>
                        </Alert>
                    </div>
                </div>
            )}

            {!loading && !error && orderedProducts.length > 0 && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={isSortingEnabled ? handleDragEnd : undefined}
                >
                    <SortableContext
                        items={orderedProducts.map((p) => p._id)}
                        strategy={rectSortingStrategy}
                    >
                        <div
                            className="grid px-4 lg:px-6 gap-4"
                            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}
                        >
                            {orderedProducts.map((product) => (
                                <SortableProduct
                                    key={product._id}
                                    product={product}
                                    onClick={() => handleAddToSale(product)}
                                    isSortingEnabled={isSortingEnabled}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {error && (
                <div className="flex items-center justify-center h-[300px]">
                    <div className="p-4">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </div>
                </div>
            )}
        </>
    )
}

"use client"

import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core"
import {
    SortableContext,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircle, GripVertical } from "lucide-react"
import { ProductClient } from "@/types/product-client"
import { DropdownMenuDemo } from "../dropdown"
import { ProductSkeleton } from "./skeletons"
import { useAllProducts } from "@/hooks/products/use-all-products"

interface AllProductsProps {
    loading: boolean
    error: string
    selectedCategory: string
}

function SortableProduct({
    product,
    onClick,
    isSortingEnabled,
}: {
    product: ProductClient
    onClick: () => void
    isSortingEnabled: boolean
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: product._id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={isSortingEnabled ? "cursor-grab" : ""}
        >
            <Card
                className="h-[180px] flex flex-col justify-between cursor-pointer"
                onClick={isSortingEnabled ? undefined : onClick}
            >
                <CardHeader className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg font-semibold tabular-nums @[250px]/card:text-lg line-clamp-3">
                        {product.name.charAt(0).toUpperCase() + product.name.slice(1).toLowerCase()}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        {isSortingEnabled && (
                            <>
                                <DropdownMenuDemo productId={product._id} product={[product]} />
                                <div
                                    {...attributes}
                                    {...listeners}
                                    className="cursor-grab p-1"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </>
                        )}
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-md">
                    <div className="line-clamp-1 flex gap-2 font-mono text-muted-foreground">
                        €{product.price.toFixed(2)}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export function AllProducts({
    loading,
    error,
    selectedCategory,
}: AllProductsProps) {
    const {
        orderedProducts,
        isSortingEnabled,
        sensors,
        handleAddToSale,
        handleDragEnd,
    } = useAllProducts(selectedCategory)

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
                            style={{
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(250px, 1fr))",
                            }}
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

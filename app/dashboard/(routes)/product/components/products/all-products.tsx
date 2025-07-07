/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useMemo } from "react"
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
import { useSaleStore } from "@/zustand/use-sale-store"
import { useProductStore } from "@/zustand/use-products-store"
import { ProductClient } from "@/types/product-client"
import { DropdownMenuDemo } from "../dropdown"
import { ProductSkeleton } from "./skeletons"
import { useEffect, useState } from "react"
import { useUpdateProductOrder } from "@/hooks/products/use-update-product-order"

interface AllProductsProps {
    loading: boolean
    error: string
    selectedCategory: string
}

function SortableProduct({
    product,
    onClick,
}: {
    product: ProductClient
    onClick: () => void
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
        <div ref={setNodeRef} style={style}>
            <Card className="@container/card cursor-pointer" onClick={onClick}>
                <CardHeader className="flex justify-between items-start gap-2">
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
                        {product.name.charAt(0).toUpperCase() +
                            product.name.slice(1).toLowerCase()}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <DropdownMenuDemo productId={product._id} product={[product]} />
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab p-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-lg">
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
    const { addProduct } = useSaleStore()
    const { products } = useProductStore()
    const { updateOrder } = useUpdateProductOrder()

    const [orderedProducts, setOrderedProducts] = useState<ProductClient[]>([])

    const sensors = useSensors(useSensor(PointerSensor))


    const filtered = useMemo(() => {
        return selectedCategory
            ? products.filter((p) => p.category === selectedCategory)
            : products
    }, [products, selectedCategory])

    useEffect(() => {
        const sorted = [...filtered].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        setOrderedProducts(sorted)
    }, [filtered])

    const handleAddToSale = (product: ProductClient) => {
        addProduct({
            productId: product._id,
            name: product.name,
            quantity: 1,
            price: product.price,
        })
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            const oldIndex = orderedProducts.findIndex((p) => p._id === active.id)
            const newIndex = orderedProducts.findIndex((p) => p._id === over.id)
            const newOrder = arrayMove(orderedProducts, oldIndex, newIndex)
            setOrderedProducts(newOrder)
            updateOrder(newOrder) //  Guardar en el backend
        }
    }

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
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={orderedProducts.map((p) => p._id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                            {orderedProducts.map((product) => (
                                <SortableProduct
                                    key={product._id}
                                    product={product}
                                    onClick={() => handleAddToSale(product)}
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

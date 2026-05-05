import { useMemo, useEffect, useState } from "react"
import { DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useSaleStore } from "@/zustand/use-sale-store"
import { useProductStore } from "@/zustand/use-products-store"
import { ProductClient } from "@/types/product-client"
import { useUpdateProductOrder } from "@/hooks/products/use-update-product-order"

export function useAllProducts(selectedCategory: string) {
    const { addProduct } = useSaleStore()
    const { products, isSortingEnabled } = useProductStore()
    const { updateOrder } = useUpdateProductOrder()

    const [orderedProducts, setOrderedProducts] = useState<ProductClient[]>([])

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: 5,
            },
        })
    )

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
        if (!isSortingEnabled) {
            addProduct({
                productId: product._id,
                name: product.name,
                quantity: 1,
                price: product.price,
            })
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = orderedProducts.findIndex((p) => p._id === active.id)
        const newIndex = orderedProducts.findIndex((p) => p._id === over.id)

        const newOrder = arrayMove(orderedProducts, oldIndex, newIndex)
        setOrderedProducts(newOrder)
        updateOrder(newOrder)
    }

    return {
        orderedProducts,
        isSortingEnabled,
        sensors,
        handleAddToSale,
        handleDragEnd,
    }
}

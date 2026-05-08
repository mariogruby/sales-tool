"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GripVertical } from "lucide-react"
import { ProductClient } from "@/types/product-client"
import { ProductDropdown } from "../dropdown"

interface SortableProductProps {
    product: ProductClient
    onClick: () => void
    isSortingEnabled: boolean
}

export function SortableProduct({ product, onClick, isSortingEnabled }: SortableProductProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: product._id,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className={isSortingEnabled ? "cursor-grab" : ""}>
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
                                <ProductDropdown productId={product._id} product={[product]} />
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

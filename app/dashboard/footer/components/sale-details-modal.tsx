"use client"

import { useState, useEffect, ReactNode } from "react"
import { Minus, Plus, X } from "lucide-react"
import { useSaleStore } from "@/zustand/use-sale-store"
import {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SaleDetailsModal({ children }: { children: ReactNode }) {
    const { products, removeProduct } = useSaleStore()
    const [localProducts, setLocalProducts] = useState(products)

    useEffect(() => {
        setLocalProducts(products)
    }, [products])

    const handleQuantityChange = (index: number, value: number) => {
        if (value < 1) return
        localProducts[index].quantity = value
        setLocalProducts([...localProducts])
        useSaleStore.setState({ products: [...localProducts] })
    }

    const total = localProducts.reduce((sum, p) => sum + p.price * p.quantity, 0)

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Detalles de la venta</SheetTitle>
                    <SheetDescription>
                        Puedes ajustar las cantidades directamente.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-4 p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {localProducts.map((p, idx) => (
                        <div
                            key={idx}
                            className="relative flex flex-col bg-white rounded-xl border p-4 shadow-sm space-y-3"
                        >
                            {/* Botón de eliminar (X) */}
                            <button
                                onClick={() => removeProduct(p.productId)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex justify-between items-center ">
                                <span className="font-medium text-gray-800">{p.name}</span>
                                {/* <span className="text-sm text-gray-600">Precio: €{p.price.toFixed(2)}</span> */}
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1 rounded-md border px-2 py-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleQuantityChange(idx, p.quantity - 1)}
                                        disabled={p.quantity <= 1}
                                        className="sm:h-7 w-7 md:w-10 hover:bg-gray-100 disabled:opacity-40"
                                    >
                                        <Minus className="h-4 w-4 text-gray-600" />
                                    </Button>

                                    <Input
                                        min={1}
                                        value={p.quantity}
                                        onChange={(e) => handleQuantityChange(idx, Number(e.target.value))}
                                        className="w-10 text-center border-none bg-transparent text-sm px-1 py-0 h-7"
                                    />

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleQuantityChange(idx, p.quantity + 1)}
                                        className="sm:h-7 w-7 md:w-10 hover:bg-gray-100"
                                    >
                                        <Plus className="h-4 w-4 text-gray-600" />
                                    </Button>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-sm text-muted-foreground">
                                        Precio: €
                                        <span className="font-mono">
                                            {p.price.toFixed(2)}
                                        </span>
                                    </span>
                                    <span className="text-sm font-semibold text-gray-700">
                                        Subtotal: €
                                        <span className="font-mono">
                                            {(p.price * p.quantity).toFixed(2)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 border-t pt-4 text-center text-lg font-bold">
                    Total: €{total.toFixed(2)}
                </div>

                <SheetFooter className="mt-4">
                    <SheetClose asChild>
                        <Button>Cerrar</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

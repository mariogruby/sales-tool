"use client"

import { Minus, Plus } from "lucide-react"
import { useSaleStore } from "@/zustand/use-sale-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { useCreateSale } from "@/hooks/use-create-sale"
import { useEffect, useState } from "react"
import { SaleDetailsModal } from "./components/sale-details-modal"
// import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
    const { products, paymentType, setPaymentType, clearSale, setStatus } = useSaleStore()
    const { createSale, loading } = useCreateSale()
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

    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

    if (products.length === 0) return null

    return (
        <footer className="sticky bottom-0 z-20 w-full border-t bg-gray-50 px-4 py-3 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Productos */}
                <div className="flex-1 max-h-[180px] overflow-x-auto md:overflow-y-auto pr-2 flex gap-4 flex-nowrap md:flex-wrap items-start">
                    {products.map((p, idx) => (
                        <div
                            key={idx}
                            className="flex-shrink-0 md:flex-shrink bg-white rounded-lg border-2 p-2 w-[160px] min-w-[140px]"
                        >
                            <div className="flex justify-between items-center gap-2">
                                <span className="font-medium text-gray-800 truncate">{p.name}</span>
                                <span className="text-sm font-semibold text-gray-500 flex-shrink-0">€{p.price.toFixed(2)}</span>
                            </div>

                            <div className="mt-2 flex flex-col gap-2">
                                <div className="flex items-center gap-1 rounded-md p-1 border">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleQuantityChange(idx, p.quantity - 1)}
                                        disabled={p.quantity <= 1}
                                        className="h-8 w-8 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <Minus className="h-3 w-3 text-gray-600" />
                                    </Button>

                                    <Input
                                        className="w-12 text-center border-transparent bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        value={p.quantity}
                                        min={1}
                                        onChange={(e) =>
                                            handleQuantityChange(idx, Number(e.target.value))
                                        }
                                    />

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleQuantityChange(idx, p.quantity + 1)}
                                        className="h-8 w-8 hover:bg-gray-100"
                                    >
                                        <Plus className="h-3 w-3 text-gray-600" />
                                    </Button>
                                </div>

                                <span className="font-semibold text-gray-900 text-sm text-right">
                                    €{(p.price * p.quantity).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Panel derecho: select, total, botones */}
                <div className="flex flex-col gap-3 md:gap-4 md:justify-between min-w-full md:min-w-[300px] border-t md:border-t-0 md:border-l border-gray-300 pt-4 md:pt-0 md:pl-4">
                    <SaleDetailsModal>
                        <Button variant="outline" className="w-full md:w-auto">
                            Ver detalles
                        </Button>
                    </SaleDetailsModal>

                    <Select value={paymentType} onValueChange={setPaymentType}>
                        <SelectTrigger className="w-full md:w-[140px] bg-white">
                            <SelectValue placeholder="Pago" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="efectivo">Efectivo</SelectItem>
                            <SelectItem value="tarjeta">Tarjeta</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="font-bold text-lg md:text-xl">Total: €{total.toFixed(2)}</div>

                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <Button
                            variant="destructive"
                            onClick={clearSale}
                            disabled={loading}
                            className="w-full md:w-auto"
                        >
                            Cancelar venta
                        </Button>
                        <Button
                            onClick={() => {
                                setStatus("pagado")
                                createSale()
                            }}
                            disabled={loading}
                            className="w-full md:w-auto"
                        >
                            {loading ? "Guardando..." : "Confirmar venta"}
                        </Button>
                    </div>
                </div>
            </div>
        </footer>

    )
}

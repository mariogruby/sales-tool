"use client"

import { useState } from "react"
import { Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SendInvoiceDialog } from "@/components/common/send-invoice-dialog"
import { useSaleStore } from "@/zustand/use-sale-store"

export function InvoiceModal() {
    const [open, setOpen] = useState(false)
    const { products } = useSaleStore()

    const items = products.map((p) => ({ name: p.name, quantity: p.quantity, price: p.price }))
    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

    return (
        <>
            <Button variant="outline" className="w-full md:w-auto cursor-pointer" onClick={() => setOpen(true)}>
                <Receipt className="w-4 h-4 mr-2" />
                Generar factura
            </Button>
            <SendInvoiceDialog open={open} setOpen={setOpen} items={items} total={total} />
        </>
    )
}

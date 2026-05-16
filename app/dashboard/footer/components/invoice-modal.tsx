"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2Icon, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useSaleStore } from "@/zustand/use-sale-store"

export function InvoiceModal() {
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const { products } = useSaleStore()
    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

    const handleSend = async () => {
        if (!email.trim()) {
            toast.error("Introduce un correo electrónico")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/invoice/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    items: products.map((p) => ({
                        name: p.name,
                        quantity: p.quantity,
                        price: p.price,
                    })),
                    total,
                }),
            })

            const data = await res.json()
            if (res.ok) {
                toast.success("Factura enviada correctamente")
                setEmail("")
                setOpen(false)
            } else {
                toast.error(data.message ?? "Error al enviar la factura")
            }
        } catch {
            toast.error("Error del servidor")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto cursor-pointer">
                    <Receipt className="w-4 h-4 mr-2" />
                    Generar factura
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Enviar factura</DialogTitle>
                    <DialogDescription>
                        Se enviará un PDF con los productos de esta venta (total: €{total.toFixed(2)}).
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2 py-2">
                    <Label htmlFor="invoice-email">Correo del cliente</Label>
                    <Input
                        id="invoice-email"
                        type="email"
                        placeholder="cliente@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSend} disabled={loading || !email.trim()}>
                        {loading ? (
                            <>
                                <Loader2Icon className="animate-spin w-4 h-4 mr-2" />
                                Enviando...
                            </>
                        ) : (
                            "Enviar"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

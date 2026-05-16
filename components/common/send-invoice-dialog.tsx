"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"
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
} from "@/components/ui/dialog"

interface InvoiceItem {
    name: string
    quantity: number
    price: number
}

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    items: InvoiceItem[]
    total: number
}

export function SendInvoiceDialog({ open, setOpen, items, total }: Props) {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

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
                body: JSON.stringify({ email, items, total }),
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

import { useState } from "react"
// import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { useSaleStore } from "@/zustand/use-sale-store"

export function useCreateSale() {
    // const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    
    const createSale = async () => {
        const { products, paymentType, status, clearSale } = useSaleStore.getState();
        try {
            setLoading(true);

            const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

            const saleData = {
                products: products.map(p => ({
                    productId: p.productId,
                    quantity: p.quantity,
                    price: p.price
                })),
                paymentType,
                status,
                total
            };

            const res = await fetch("/api/sales/addSale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(saleData)
            });

            const data = await res.json();

            if (res.ok) {
                clearSale();
                toast.success("Venta realizada con éxito");
                return { success: true };
            } else {
                setError(data.message || "Error al crear la venta");
                toast.error(data.message || "Error al crear la venta");
                return { success: false };
            }
        } catch (err) {
            console.error(err);
            setError("Error de red o del servidor");
            toast.error("Error de red o del servidor");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { createSale, loading, error }
}
import { useState } from "react";
import { toast } from "sonner";

export function useCheckProtectedRoute() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const checkRoute = async (securityCode: string, route: string) => {

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/account/checkProtectedRoute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ securityCode, route }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "no authorized")
                toast.error(data.message, {
                    style: {
                        background: 'red',
                    },
                })
                return false
            } else {
                toast.success("authorized", {
                    style: {
                        background: 'green',
                    },
                })
                return true
            }

        } catch (error) {
            console.error("Error en checkRoute:", error);
            setError("Error al conectar con el servidor");
            toast.error("Error al conectar con el servidor", {
                style: {
                    background: 'red',
                },
            });
        } finally {
            setLoading(false)
        }
    }

    return { checkRoute, loading, error }
}
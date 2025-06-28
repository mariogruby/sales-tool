import { useState } from "react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export function useDeleteAccount() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const deleteAccount = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/account/deleteUser", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json()

            if (res.ok) {
                toast.success("Cuenta Eliminada")
                signOut({callbackUrl:"/sign-in"})
            } else {
                setError(data.message || "Error al eliminar cuenta")
            }
        } catch (err) {
            console.error("Error eliminando cuenta:", err);
            setError("Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    return { deleteAccount, loading, error }
}
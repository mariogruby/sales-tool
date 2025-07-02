import { useState } from "react";
import { toast } from "sonner";

export function useEditAccount() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const updateData = async (update: {
        name: string;
        email: string;
        phoneNumber?: string;
        direction?: string;
        securityCode?: string;
        securityCodeEnabled: boolean;
        protectedRoutes: string[];
    }) => {
        setLoading(true);
        setError("")
        try {
            const res = await fetch("/api/account/editUserData", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(update),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Error updating data");
                toast.error(data.message || "Error al actualizar datos")
                return false;
            }

            toast.success(data.message || "Datos actualizados correctamente")
            setError("");
            return true;
        } catch (error) {
            console.error("Error updating data:", error);
            setError("Error updating data");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, updateData };
}

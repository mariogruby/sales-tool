import { useState } from "react"
import { useCategoryStore } from "@/zustand/use-categories-store"
import { toast } from "sonner"

export function useDeleteCategory() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const removeCategory = useCategoryStore((state) => state.removeCategory)

    const deleteCategory = async (categoryId: string) => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/category/deleteCategory", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ categoryId }),
            });

            const data = await res.json()

            if (res.ok) {
                removeCategory(categoryId)
                toast.success("Categoría eliminada")
                return true
            } else {
                setError(data.message || "Error al eliminar categoria");
                console.error(data.message);
                toast.error("Error al eliminar categoria")
                return false
            }
        } catch (err) {
            console.error("Error deleting category:", err);
            setError("Something went wrong");
            return false
        } finally {
            setLoading(false);
        }
    };

    return { deleteCategory, loading, error, setError }
}
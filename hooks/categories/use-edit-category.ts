import { useState } from "react";
import { toast } from "sonner";
import { ICategory } from "@/types/category";
import { useCategoryStore } from "@/zustand/use-categories-store";

export function useEditCategory() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const setCategories = useCategoryStore((state) => state.setCategories)
    const categories = useCategoryStore((state) => state.categories)

    const editCategory = async (form: {
        categoryId: string;
        name: string,
        color?: string;
    }) => {
        setLoading(true)

        try {
            const res = await fetch("/api/category/editCategory", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            const data = await res.json();

            if (res.ok) {
                const updatedCategory: ICategory = data.category

                const updatedCategories = categories.map((c) =>
                    c._id === updatedCategory._id ? updatedCategory : c
                );
                setCategories(updatedCategories)

                toast.success("Categoría actualizada correctamente");
                return { success: true }
            } else {
                toast.error(data.message || "Error al actualizar producto", {
                    style: {
                        background: 'red',
                    },
                });
                setError(data.message);
                return { success: false }
            }

        } catch (error) {
            console.error(error);
            setError("Error de red o del servidor");
            toast.error("Error de red o del servidor", {
                style: {
                    background: 'red',
                },
            });
        } finally {
            setLoading(false)
        }
    };

    return { editCategory, loading, error }
}
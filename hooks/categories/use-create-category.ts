import { useState } from "react";
import { toast } from "sonner";
import { useCategoryStore } from "@/zustand/use-categories-store";
import { ICategory } from "@/types/category";

export function useCreateCategory() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const addCategory = useCategoryStore((state) => state.addCategory)

    const createCategory = async (form: {
        name: string;
    }) => {
        setLoading(true)

        const res = await fetch("/api/category/addCategory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const data = await res.json();

        if (res.ok) {
            const newCategory: ICategory = data.Category
            addCategory(newCategory) // ---> actualiza zustand store
            toast.success("categoria creada exitosamente", {
                style: {
                    background: 'green',
                },
            });
            setLoading(false);
            return { success: true }
        } else {
            toast.error("Error al crear categoria", {
                style: {
                    background: 'red',
                },
            });
            setError(data.message)
            setLoading(false);
            return { success: false, message: data.message }
        }
    }

    return { createCategory, loading, error }
}
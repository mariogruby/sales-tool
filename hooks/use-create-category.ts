import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCategoryStore } from "@/zustand/use-categories-store";
import { ICategory } from "@/types/category";

export function useCreateCategory() {
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const addCategory = useCategoryStore((state) => state.addCategory)

    const createCategory = async (form: {
        name: string;
    }) => {
        setLoading(true)

        const res = await fetch("/api/category/addCategory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                restaurantId: session?.user?.id,
            }),
        });
        const data = await res.json();

        if (res.ok) {
            const newCategory: ICategory = data.Category
            addCategory(newCategory) // ---> actualiza zustand store
            toast.success("categoria creada exitosamente");
            setLoading(false);
            return { success: true }
        } else {
            toast.error("Error al crear categoria: " + data.message);
            setLoading(false);
            return { success: false, message: data.message }
        }
    }

    return { createCategory, loading }
}
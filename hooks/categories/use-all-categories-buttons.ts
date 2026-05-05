import { useState } from "react"
import { ICategory } from "@/types/category"
import { useCategoryStore } from "@/zustand/use-categories-store"
import { useProductStore } from "@/zustand/use-products-store"

export function useAllCategoriesButtons(selectedCategory: string) {
    const { categories } = useCategoryStore()
    const { isSortingEnabled } = useProductStore()

    const [openDelete, setOpenDelete] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null)
    const [openEdit, setOpenEdit] = useState(false)
    const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null)

    const handleDeleteClick = () => {
        const category = categories.find((c) => c._id === selectedCategory)
        if (category) {
            setCategoryToDelete(category)
            setOpenDelete(true)
        }
    }

    const handleEditClick = () => {
        const category = categories.find((c) => c._id === selectedCategory)
        if (category) {
            setCategoryToEdit(category)
            setOpenEdit(true)
        }
    }

    return {
        categories,
        isSortingEnabled,
        openDelete,
        setOpenDelete,
        categoryToDelete,
        openEdit,
        setOpenEdit,
        categoryToEdit,
        handleDeleteClick,
        handleEditClick,
    }
}

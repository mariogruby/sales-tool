"use client"

import { useState } from "react"
import { ICategory } from "@/types/category"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteCategory } from "./delete-category"
import { EditCategory } from "./edit-category"
import { useCategoryStore } from "@/zustand/use-categories-store"
import { useProductStore } from "@/zustand/use-products-store"
// import { Badge } from "@/components/ui/badge"

interface AllCategoriesProps {
    // categories: ICategory[]
    loading: boolean
    error: string
    selectedCategory: string
    onSelectCategory: (categoryId: string) => void
    showDeleteButton?: boolean
    showEditButton?: boolean
}

export function AllCategoriesButtons({
    // categories,
    loading,
    error,
    selectedCategory,
    onSelectCategory,
    showDeleteButton = true,
    showEditButton = true,
}: AllCategoriesProps) {
    const { categories } = useCategoryStore()
    const { isSortingEnabled } = useProductStore()
    const [openDelete, setOpenDelete] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null)
    const [openEdit, setOpenEdit] = useState(false)
    const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null)

    if (loading) return <div className="p-4">Cargando categorías...</div>

    if (error) {
        return (
            <div className="p-4">
                <Alert variant="destructive" className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    if (categories.length === 0) {
        return (
            <div className="p-4">
                <Alert variant="default" className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>No hay categorías creadas</AlertTitle>
                </Alert>
            </div>
        )
    }

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

    return (
        <div className="flex flex-wrap gap-2 mb-4 px-4 lg:px-6 gap-4">
            <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                onClick={() => onSelectCategory("")}
                className="cursor-pointer"
            >
                Todos
            </Button>

            {categories.map((category) => {
                const isActive = selectedCategory === category._id

                return (
                    <Button
                        key={category._id}
                        onClick={() => onSelectCategory(category._id)}
                        variant={isActive ? "default" : "outline"}
                        className={`cursor-pointer`}
                    >
                        <span className={`h-3 min-w-3 rounded-full px-1 ${category.color?.split(" ")[0]}`} />
                        {category.name}
                    </Button>
                )
            })}


            {isSortingEnabled && showDeleteButton && showEditButton && selectedCategory && (
                <>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDeleteClick}
                        title="Eliminar categoría seleccionada"
                    >
                        <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>

                    {categoryToDelete && (
                        <DeleteCategory
                            open={openDelete}
                            setOpen={setOpenDelete}
                            categoryId={categoryToDelete._id}
                            categoryName={categoryToDelete.name}
                        />
                    )}

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleEditClick}
                        title="Editar categoría seleccionada"
                    >
                        <Pencil className="w-5 h-5" />
                    </Button>

                    {categoryToEdit && (
                        <EditCategory
                            open={openEdit}
                            setOpen={setOpenEdit}
                            category={categoryToEdit}
                        />
                    )}
                </>
            )}
        </div>
    )
}

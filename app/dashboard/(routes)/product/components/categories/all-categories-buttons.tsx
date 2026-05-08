"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModalDeleteConfirmation } from "@/components/common/modal-delete-confirmation"
import { EditCategory } from "./edit-category"
import { AllCategoriesButtonsSkeleton } from "./skeletons-button"
import { useAllCategoriesButtons } from "@/hooks/categories/use-all-categories-buttons"
import { useDeleteCategory } from "@/hooks/categories/use-delete-category"

interface AllCategoriesProps {
    loading: boolean
    error: string
    selectedCategory: string
    onSelectCategory: (categoryId: string) => void
    showDeleteButton?: boolean
    showEditButton?: boolean
}

export function AllCategoriesButtons({
    loading,
    error,
    selectedCategory,
    onSelectCategory,
    showDeleteButton = true,
    showEditButton = true,
}: AllCategoriesProps) {
    const {
        categories,
        openDelete,
        setOpenDelete,
        categoryToDelete,
        openEdit,
        setOpenEdit,
        categoryToEdit,
        handleDeleteClick,
        handleEditClick,
    } = useAllCategoriesButtons(selectedCategory)

    const { deleteCategory, loading: loadingDelete, error: deleteError, setError: setDeleteError } = useDeleteCategory()

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return
        const success = await deleteCategory(categoryToDelete._id)
        if (success) setOpenDelete(false)
    }

    const handleCancelDelete = () => {
        setOpenDelete(false)
        setDeleteError("")
    }

    if (loading) return <AllCategoriesButtonsSkeleton />

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


            {showDeleteButton && showEditButton && selectedCategory && (
                <>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDeleteClick}
                        title="Eliminar categoría seleccionada"
                    >
                        <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>

                    <ModalDeleteConfirmation
                        open={openDelete}
                        title={`¿Estás seguro de eliminar la categoría "${categoryToDelete?.name}"?`}
                        description="Solo puedes eliminar categorías que no tengan productos."
                        confirmLabel="Eliminar"
                        loading={loadingDelete}
                        error={deleteError || undefined}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    />

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

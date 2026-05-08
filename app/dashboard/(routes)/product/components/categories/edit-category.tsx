"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2Icon } from "lucide-react"
import { DrawerClose } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { useEditCategory } from "@/hooks/categories/use-edit-category"
import { ICategory } from "@/types/category"
import { DrawerDialogBaseProps } from "@/types/ui"
import { ResponsiveModal } from "@/components/common/responsive-modal"
import { CATEGORY_COLORS } from "../../constants/category-colors"

type EditCategoryProps = DrawerDialogBaseProps & { category: ICategory }

export function EditCategory({ open, setOpen, category }: EditCategoryProps) {
    return (
        <ResponsiveModal
            open={open}
            onOpenChange={setOpen}
            title="Editar Categoría"
            description="Edita la información de la categoría"
            dialogClassName="sm:max-w-[425px]"
            drawerFooter={
                <DrawerClose asChild>
                    <Button variant="outline" className="w-full">Cancelar</Button>
                </DrawerClose>
            }
        >
            <CategoryForm setOpen={setOpen} category={category} />
        </ResponsiveModal>
    )
}

function CategoryForm({
    category,
    setOpen,
}: {
    category: ICategory
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { editCategory, loading, error } = useEditCategory()

    const [form, setForm] = useState({
        categoryId: category._id,
        name: category.name,
        color: category.color || CATEGORY_COLORS[0],
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await editCategory(form)
        if (result?.success) setOpen(false)
    }

    return (
        <form className="grid items-start gap-4" onSubmit={handleSubmit}>
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div className="grid gap-2">
                <Label htmlFor="name">Nombre de la categoría</Label>
                <Input
                    type="text"
                    id="name"
                    value={form.name}
                    disabled={loading}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label>Color de la categoría</Label>
                <div className="flex flex-wrap gap-2 items-center justify-center">
                    {CATEGORY_COLORS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setForm({ ...form, color })}
                            className={cn(
                                "px-11 py-6 md:px-8 md:py-6 rounded-md border transition-colors",
                                color,
                                form.color === color
                                    ? "ring-2 ring-offset-2 ring-primary"
                                    : "border-muted"
                            )}
                        />
                    ))}
                </div>
            </div>
            <Button disabled={loading} type="submit" className="cursor-pointer">
                {loading ? (
                    <>
                        <Loader2Icon className="animate-spin mr-2" />
                        Guardando...
                    </>
                ) : (
                    "Guardar"
                )}
            </Button>
        </form>
    )
}

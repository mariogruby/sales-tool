"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2Icon } from "lucide-react"
import { DrawerClose } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { useCreateCategory } from "@/hooks/categories/use-create-category"
import { DrawerDialogBaseProps } from "@/types/ui"
import { ResponsiveModal } from "@/components/common/responsive-modal"
import { CATEGORY_COLORS } from "../../constants/category-colors"

export function CreateCategory({ open, setOpen }: DrawerDialogBaseProps) {
    return (
        <ResponsiveModal
            open={open}
            onOpenChange={setOpen}
            title="Crear Categoría"
            dialogClassName="sm:max-w-[425px]"
            drawerFooter={
                <DrawerClose asChild>
                    <Button variant="outline" className="w-full">Cancelar</Button>
                </DrawerClose>
            }
        >
            <CategoryForm />
        </ResponsiveModal>
    )
}

function CategoryForm() {
    const [form, setForm] = useState({ name: "", color: CATEGORY_COLORS[0] })
    const { createCategory, loading, error } = useCreateCategory()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await createCategory(form)
        if (result.success) {
            setForm({ name: "", color: CATEGORY_COLORS[0] })
        }
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
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                    {CATEGORY_COLORS.map((color) => (
                        <button
                            type="button"
                            key={color}
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
                        <Loader2Icon className="animate-spin" />
                        Guardando...
                    </>
                ) : (
                    "Guardar"
                )}
            </Button>
        </form>
    )
}

export default CreateCategory

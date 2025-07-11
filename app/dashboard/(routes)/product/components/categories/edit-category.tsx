"use client"

import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    // DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    // DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert"

import { AlertCircle, Loader2Icon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEditCategory } from "@/hooks/categories/use-edit-category"
import { ICategory } from "@/types/category"
// import { useProducts } from "@/hooks/products/use-products"


type DrawerDialogDemoProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    category: ICategory
}

export function EditCategory({ open, setOpen, category }: DrawerDialogDemoProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Editar Categoría</DialogTitle>
                    <DialogDescription className="text-center">Edita la información de la categoría</DialogDescription>
                </DialogHeader>
                <CategoryForm setOpen={setOpen} category={category} />
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle className="text-center">Editar Categoría</DrawerTitle>
                    <DrawerDescription className="text-center">Edita la información de la categoría</DrawerDescription>
                </DrawerHeader>
                <CategoryForm className="px-4" setOpen={setOpen} category={category} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
function CategoryForm({
    className,
    category,
    setOpen,
}: {
    className?: string
    category: ICategory
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { editCategory, loading, error } = useEditCategory()

    const [form, setForm] = useState({
        categoryId: category._id,
        name: category.name,
        color: category.color || "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await editCategory(form)
        if (result?.success) {
            setOpen(false)
        }
    }

    const colorOptions = [
        "bg-slate-100",
        "bg-red-600",
        "bg-orange-500",
        "bg-yellow-300",
        "bg-blue-700",
        "bg-pink-600",
        "bg-green-500",
        "bg-emerald-700",
        "bg-purple-700",
        "bg-amber-950",
    ]

    return (
        <form
            className={cn("grid items-start gap-4", className)}
            onSubmit={handleSubmit}
        >
            <div className="grid gap-2">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error || "Ocurrió un error."}</AlertDescription>
                    </Alert>
                )}

                {/* Nombre */}
                <Label htmlFor="name">Nombre de la categoría</Label>
                <Input
                    type="text"
                    id="name"
                    value={form.name}
                    disabled={loading}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />

                {/* Color */}
                <Label>Color de la categoría</Label>
                <div className="flex flex-wrap gap-2 items-center justify-center">
                    {colorOptions.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setForm({ ...form, color: color })}
                            className={cn(
                                "px-11 py-6 md:px-8 md:py-6 rounded-md border transition-colors",
                                form.color === color
                                    ? "ring-2 ring-offset-2 ring-primary"
                                    : "border-muted",
                                color
                            )}
                        >
                        </button>
                    ))}
                </div>
            </div>

            {/* Guardar */}
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

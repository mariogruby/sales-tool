"use client"

import * as React from "react"

import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useCreateCategory } from "@/hooks/categories/use-create-category"

type DrawerDialogDemoProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function CreateCategory({ open, setOpen }: DrawerDialogDemoProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Crear Categoría</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <CategoryForm />
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="text-center">Crear Categoría</DrawerTitle>
                    <DrawerDescription>
                    </DrawerDescription>
                </DrawerHeader>
                <CategoryForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function CategoryForm({ className }: React.ComponentProps<"form">) {

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

    const [form, setForm] = useState({
        name: "",
        color: colorOptions[0], // valor por defecto
    })

    const { createCategory, loading, error } = useCreateCategory()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await createCategory(form)
        if (result.success) {
            setForm({ name: "", color: colorOptions[0] })
        }
    }

    return (
        <form className={cn("grid items-start gap-4", className)} onSubmit={handleSubmit}>
            <div className="grid gap-2">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error || "Ocurrió un error."}</AlertDescription>
                    </Alert>
                )}

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
                    {colorOptions.map((color) => (
                        <button
                            type="button"
                            key={color}
                            onClick={() => setForm({ ...form, color })}
                            className={cn(
                                "px-11 py-6 md:px-8 md:py-6 rounded-md border transition-colors",
                                color.split(" ")[0], // background
                                form.color === color
                                    ? "ring-2 ring-offset-2 ring-primary"
                                    : "border-muted"
                            )}
                            title={color}
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

export default CreateCategory;
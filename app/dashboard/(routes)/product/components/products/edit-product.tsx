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
import { useEditProduct } from "@/hooks/products/use-edit-product"
import { IProduct } from "@/types/product"
import { AllCategories } from "../categories/all-categories"
import { useProducts } from "@/hooks/products/use-products"

type DrawerDialogDemoProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    product: IProduct
}

export function EditProduct({ open, setOpen, product }: DrawerDialogDemoProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Editar Producto</DialogTitle>
                    <DialogDescription className="text-center">Edita la información del producto</DialogDescription>
                </DialogHeader>
                <ProductForm setOpen={setOpen} product={product} />
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle className="text-center">Editar Producto</DrawerTitle>
                    <DrawerDescription className="text-center">Edita la información del producto</DrawerDescription>
                </DrawerHeader>
                <ProductForm className="px-4" setOpen={setOpen} product={product} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function ProductForm({
    className,
    product,
    setOpen
}: {
    className?: string
    product: IProduct
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { editProduct, loading, error } = useEditProduct()
    const { categories, loading: loadingCategories, error: errorCategories } = useProducts()

    const [form, setForm] = useState({
        productId: product._id,
        name: product.name,
        price: product.price.toString(),
        categoryId: product.category,
        isAvailable: product.isAvailable ?? true,
    })


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await editProduct(form)
        if (result?.success) {
            setOpen(false)
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
                <Label htmlFor="name">Nombre del producto</Label>
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
                <Label htmlFor="price">Precio</Label>
                <Input
                    type="number"
                    id="price"
                    value={form.price}
                    disabled={loading}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label>Categoría</Label>
                <AllCategories
                    categories={categories}
                    loading={loadingCategories}
                    error={errorCategories}
                    selectedCategory={form.categoryId}
                    onSelectCategory={(categoryId) =>
                        setForm({ ...form, categoryId })
                    }
                    showDeleteButton={false} 
                />
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

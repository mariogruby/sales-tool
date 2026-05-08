"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2Icon } from "lucide-react"
import { DrawerClose } from "@/components/ui/drawer"
import { useCreateProduct } from "@/hooks/products/use-create-product"
import { useProducts } from "@/hooks/products/use-products"
import { AllCategories } from "../categories/all-categories"
import { DrawerDialogBaseProps } from "@/types/ui"
import { ResponsiveModal } from "@/components/common/responsive-modal"

export function CreateProduct({ open, setOpen }: DrawerDialogBaseProps) {
    return (
        <ResponsiveModal
            open={open}
            onOpenChange={setOpen}
            title="Crear Producto"
            dialogClassName="sm:max-w-[425px]"
            drawerFooter={
                <DrawerClose asChild>
                    <Button variant="outline" className="w-full">Cancelar</Button>
                </DrawerClose>
            }
        >
            <ProductForm />
        </ResponsiveModal>
    )
}

function ProductForm() {
    const [form, setForm] = useState({
        name: "",
        price: "",
        isAvailable: true,
        categoryId: "",
    })

    const { createProduct, loading, error } = useCreateProduct()
    const { categories, loading: categoryLoading, error: categoryError } = useProducts()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await createProduct(form)
        if (result.success) {
            setForm({ name: "", price: "", isAvailable: true, categoryId: "" })
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
                    loading={categoryLoading}
                    error={categoryError}
                    selectedCategory={form.categoryId}
                    onSelectCategory={(categoryId) => setForm({ ...form, categoryId })}
                />
            </div>
            <Button disabled={loading || !form.categoryId} type="submit" className="cursor-pointer">
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

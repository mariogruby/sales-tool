"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2Icon } from "lucide-react"
import { DrawerClose } from "@/components/ui/drawer"
import { useEditProduct } from "@/hooks/products/use-edit-product"
import { useProducts } from "@/hooks/products/use-products"
import { AllCategories } from "../categories/all-categories"
import { ProductClient } from "@/types/product-client"
import { DrawerDialogBaseProps } from "@/types/ui"
import { ResponsiveModal } from "@/components/common/responsive-modal"

type EditProductProps = DrawerDialogBaseProps & { product: ProductClient }

export function EditProduct({ open, setOpen, product }: EditProductProps) {
    return (
        <ResponsiveModal
            open={open}
            onOpenChange={setOpen}
            title="Editar Producto"
            description="Edita la información del producto"
            dialogClassName="sm:max-w-[425px]"
            drawerFooter={
                <DrawerClose asChild>
                    <Button variant="outline" className="w-full">Cancelar</Button>
                </DrawerClose>
            }
        >
            <ProductForm setOpen={setOpen} product={product} />
        </ResponsiveModal>
    )
}

function ProductForm({
    product,
    setOpen,
}: {
    product: ProductClient
    setOpen: (open: boolean) => void
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
                    onSelectCategory={(categoryId) => setForm({ ...form, categoryId })}
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

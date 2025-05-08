"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useCreateCategory } from "@/hooks/use-create-category";

type DrawerDialogDemoProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function CreateCategory({ open, setOpen }: DrawerDialogDemoProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {/* Este botón lo puedes quitar si solo usas el externo */}
                <div />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear categoria</DialogTitle>
                    <DialogDescription>
                        {/* Make changes to your profile here. Click save when you're done. */}
                    </DialogDescription>
                </DialogHeader>
                <ProductForm />
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {/* Este botón también puedes quitarlo */}
                <div />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Crear categoria</DrawerTitle>
                    <DrawerDescription>
                        {/* Make changes to your profile here. Click save when you're done. */}
                    </DrawerDescription>
                </DrawerHeader>
                <ProductForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function ProductForm({ className }: React.ComponentProps<"form">) {
    const [form, setForm] = useState({ name: "" });
    const { createCategory, loading } = useCreateCategory()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await createCategory(form)

        if (result.success) {
            setForm({ name: "" })
        }
    }


    return (
        <form className={cn("grid items-start gap-4", className)} onSubmit={handleSubmit}>
            <div className="grid gap-2">
                <Label htmlFor="name">Nombre de la categoria</Label>
                <Input
                    type="text"
                    id="name"
                    value={form.name}
                    disabled={loading}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
            </div>
            <Button disabled={loading} type="submit">Guardar</Button>
        </form>
    );
}

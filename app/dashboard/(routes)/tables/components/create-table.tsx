/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useCreateTable } from "@/hooks/use-create-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMediaQuery } from "@/hooks/use-media-query";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type DrawerDialogDemoProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
type TableFormData = {
    number: number | "";
    location: "terraza" | "interior" | "";
};

export function CreateTables({ open, setOpen }: DrawerDialogDemoProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear Mesas</DialogTitle>
                    <DialogDescription>
                        selecciona el numero de mesas que quieres crear y su ubicacion
                    </DialogDescription>
                </DialogHeader>
                <CreateMultipleTablesForm />
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Crear Mesas</DrawerTitle>
                    <DialogDescription>
                        selecciona el numero de mesas que quieres crear y su ubicacion
                    </DialogDescription>
                </DrawerHeader>
                <CreateMultipleTablesForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}


type FormState = {
    tables: TableFormData[];
};

function CreateMultipleTablesForm({ className }: React.ComponentProps<"form">) {
    const { createTable, loading } = useCreateTable();

    const [form, setForm] = useState<FormState>({
        tables: [{ number: "", location: "" }],
    });

    // Agregar una nueva mesa vacía
    const addTable = () => {
        setForm((prev) => ({
            ...prev,
            tables: [...prev.tables, { number: "", location: "" }],
        }));
    };

    // Eliminar mesa por índice
    const removeTable = (index: number) => {
        setForm((prev) => ({
            ...prev,
            tables: prev.tables.filter((_, i) => i !== index),
        }));
    };

    // Actualizar un campo de una mesa
    const updateTable = (index: number, field: keyof TableFormData, value: any) => {
        setForm((prev) => {
            const newTables = [...prev.tables];
            newTables[index] = { ...newTables[index], [field]: value };
            return { ...prev, tables: newTables };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        for (const table of form.tables) {
            if (table.number === "" || table.location === "") {
                toast.error("Todos los campos son obligatorios");
                return;
            }
            if (typeof table.number !== "number" || table.number <= 0) {
                toast.error("El número de mesa debe ser un número positivo");
                return;
            }
        }

        const tablesToCreate = form.tables.map((t) => ({
            number: Number(t.number),
            location: t.location,
        }));

        const result = await createTable(tablesToCreate);

        if (result?.success) {
            setForm({ tables: [{ number: "", location: "" }] });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
            {form.tables.map((table, i) => (
                <div key={i} className="flex gap-2 items-end">
                    <div className="flex-1">
                        <Label className="mb-2" htmlFor={`number-${i}`}>Número de mesas</Label>
                        <Input
                            id={`number-${i}`}
                            type="number"
                            min={1}
                            value={table.number}
                            onChange={(e) =>
                                updateTable(i, "number", e.target.value === "" ? "" : Number(e.target.value))
                            }
                            required
                        />
                    </div>

                    <div className="flex-1">
                        <Label className="mb-2" htmlFor={`location-${i}`}>Ubicación</Label>
                        <Select
                            value={table.location}
                            onValueChange={(value) => updateTable(i, "location", value)}
                            required
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="terraza">Terraza</SelectItem>
                                <SelectItem value="interior">Interior</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {form.tables.length > 1 && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removeTable(i)}
                            className="h-10"
                        >
                            Eliminar
                        </Button>
                    )}
                </div>
            ))}

            <div className="flex justify-between items-center">
                <Button
                    type="button"
                    variant="outline"
                    onClick={addTable}
                    disabled={loading}
                >
                    Añadir otro grupo de mesa
                </Button>

                <Button type="submit" disabled={loading}>
                    {loading ? "Creando..." : "Crear Mesas"}
                </Button>
            </div>
        </form>
    );
}

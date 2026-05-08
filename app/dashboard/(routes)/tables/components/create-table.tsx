"use client";

import { useState } from "react";
import { useCreateTable } from "@/hooks/tables/use-create-table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DrawerClose } from "@/components/ui/drawer";
import { DrawerDialogBaseProps } from "@/types/ui";
import { ResponsiveModal } from "@/components/common/responsive-modal";

type CreateTablesProps = DrawerDialogBaseProps & { onSuccess?: () => void };

type TableFormData = {
    location: "terraza" | "interior" | "";
};

export function CreateTables({ open, setOpen, onSuccess }: CreateTablesProps) {
    return (
        <ResponsiveModal
            open={open}
            onOpenChange={setOpen}
            title="Crear Mesas"
            description="Selecciona la ubicación de las mesas que quieres crear"
            dialogClassName="sm:max-w-[425px]"
            drawerFooter={
                <DrawerClose asChild>
                    <Button variant="outline" className="w-full">Cancelar</Button>
                </DrawerClose>
            }
        >
            <CreateMultipleTablesForm onSuccess={onSuccess} setOpen={setOpen} />
        </ResponsiveModal>
    );
}

function CreateMultipleTablesForm({
    className,
    onSuccess,
    setOpen,
}: {
    className?: string;
    onSuccess?: () => void;
    setOpen: (open: boolean) => void;
}) {
    const { createTable, loading } = useCreateTable();

    const [form, setForm] = useState<{ tables: TableFormData[] }>({
        tables: [{ location: "" }],
    });

    const addTable = () => {
        setForm((prev) => ({ ...prev, tables: [...prev.tables, { location: "" }] }));
    };

    const removeTable = (index: number) => {
        setForm((prev) => ({ ...prev, tables: prev.tables.filter((_, i) => i !== index) }));
    };

    const updateLocation = (index: number, value: TableFormData["location"]) => {
        setForm((prev) => {
            const newTables = [...prev.tables];
            newTables[index] = { ...newTables[index], location: value };
            return { ...prev, tables: newTables };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const hasEmptyLocation = form.tables.some((t) => t.location === "");
        if (hasEmptyLocation) {
            toast.error("La ubicación es obligatoria", { style: { background: "red" } });
            return;
        }

        const result = await createTable(form.tables.map((t) => ({ location: t.location })));

        if (result?.success) {
            setForm({ tables: [{ location: "" }] });
            onSuccess?.();
            setOpen(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
            {form.tables.map((table, i) => (
                <div key={i} className="flex gap-2 items-end">
                    <div className="flex-1">
                        <Label className="mb-2" htmlFor={`location-${i}`}>Ubicación</Label>
                        <Select
                            value={table.location}
                            onValueChange={(value) => updateLocation(i, value as TableFormData["location"])}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Selecciona" />
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
                            className="h-10 cursor-pointer"
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
                    className="cursor-pointer"
                >
                    Añadir otra mesa
                </Button>
                <Button type="submit" disabled={loading} className="cursor-pointer">
                    {loading ? "Creando..." : "Crear Mesas"}
                </Button>
            </div>
        </form>
    );
}

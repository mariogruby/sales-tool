"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useTables } from "@/hooks/tables/use-tables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveModal } from "@/components/common/responsive-modal";

interface TablesModalProps {
    onAddToTable: (tableNumber: number) => Promise<void>;
    selectedTableNumber: number | null;
    setSelectedTableNumber: (num: number | null) => void;
    disabled?: boolean;
}

export function TablesModal({
    onAddToTable,
    selectedTableNumber,
    setSelectedTableNumber,
    disabled = false,
}: TablesModalProps) {
    const { tables, loading } = useTables();
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleAdd = async () => {
        if (!selectedTableNumber) return;
        setSaving(true);
        await onAddToTable(selectedTableNumber);
        setSaving(false);
        setOpen(false);
    };

    const trigger = (
        <Button variant="outline" className="w-full" disabled={disabled}>
            {selectedTableNumber ? `Mesa ${selectedTableNumber} seleccionada` : "Seleccionar mesa"}
        </Button>
    );

    const footer = (
        <Button
            onClick={handleAdd}
            disabled={!selectedTableNumber || disabled || saving}
            className="w-full mt-2"
        >
            {saving ? (
                <>
                    <Loader2Icon className="animate-spin mr-2" />
                    Guardando...
                </>
            ) : (
                "Agregar a mesa"
            )}
        </Button>
    );

    const content = loading ? (
        <div className="p-4 text-center text-gray-500">Cargando mesas...</div>
    ) : tables.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No hay mesas</div>
    ) : (
        <div className="overflow-y-auto max-h-[60vh] pr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tables.map((table) => (
                    <Card
                        key={table._id}
                        onClick={() => setSelectedTableNumber(table.number)}
                        className={`
                            cursor-pointer border-3 rounded-lg p-2 min-h-[80px] flex flex-col justify-between
                            ${selectedTableNumber === table.number ? "border-primary" : "border-gray-300 dark:border-gray-600"}
                            ${table.isOccupied ? "bg-red-200 dark:bg-red-700" : "bg-green-200 dark:bg-green-700"}
                        `}
                    >
                        <CardHeader className="p-0">
                            <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Mesa {table.number}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex justify-between items-center text-xs text-gray-700 dark:text-gray-300">
                            <span className="capitalize">{table.location}</span>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={setOpen}
            trigger={trigger}
            title="Seleccionar mesa"
            footer={footer}
            dialogClassName="space-y-4 flex flex-col max-h-[80vh]"
            drawerClassName="flex flex-col max-h-[90vh]"
        >
            {content}
        </ResponsiveModal>
    );
}

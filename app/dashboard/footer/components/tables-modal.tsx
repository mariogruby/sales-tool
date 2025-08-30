"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Loader2Icon } from "lucide-react";
import { useTables } from "@/hooks/tables/use-tables";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

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
    const isDesktop = useMediaQuery("(min-width: 768px)");
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

    const renderTableCards = () => {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tables.map((table) => {
                    const isSelected = selectedTableNumber === table.number;
                    return (
                        <Card
                            key={table._id}
                            className={`
                cursor-pointer
                border-3
                rounded-lg
                p-2
                min-h-[80px]
                flex flex-col justify-between
                ${isSelected ? "border-primary" : "border-gray-300 dark:border-gray-600"}
                ${table.isOccupied ? "bg-red-200 dark:bg-red-700" : "bg-green-200 dark:bg-green-700"}`}
                            onClick={() => setSelectedTableNumber(table.number)}
                        >
                            <CardHeader className="p-0">
                                <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    Mesa {table.number}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 flex justify-between items-center text-xs text-gray-700 dark:text-gray-300">
                                <span className="capitalize">{table.location}</span>
                                {/* <Badge
                                    className={`text-[10px] px-2 py-1 ${table.isOccupied ? "bg-destructive" : "bg-green-500"
                                        }`}
                                >
                                    {table.isOccupied ? "Ocupada" : "Libre"}
                                </Badge> */}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    };

    const renderTableList = () => {
        if (loading) {
            return <div className="p-4 text-center text-gray-500">Cargando mesas...</div>;
        }
        if (tables.length === 0) {
            return <div className="p-4 text-center text-gray-500">No hay mesas</div>;
        }
        return <div className="overflow-y-auto max-h-[60vh] pr-2">{renderTableCards()}</div>;
    };

    const renderButton = (
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

    return isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full" disabled={disabled}>
                    {selectedTableNumber
                        ? `Mesa ${selectedTableNumber} seleccionada`
                        : "Seleccionar mesa"}
                </Button>
            </DialogTrigger>
            <DialogContent className="space-y-4 flex flex-col max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="text-center">Seleccionar mesa</DialogTitle>
                </DialogHeader>
                {renderTableList()}
                {renderButton}
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="w-full" disabled={disabled}>
                    {selectedTableNumber
                        ? `Mesa ${selectedTableNumber} seleccionada`
                        : "Seleccionar mesa"}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col max-h-[90vh]">
                <DrawerHeader>
                    <DrawerTitle className="text-center">Seleccionar mesa</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-4 flex-1">{renderTableList()}</div>
                <div className="px-4 pb-4">{renderButton}</div>
            </DrawerContent>
        </Drawer>
    );
}

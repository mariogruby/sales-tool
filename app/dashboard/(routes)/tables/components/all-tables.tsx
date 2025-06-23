"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from "@/components/ui/tabs";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge";
import { Table } from "@/hooks/tables/use-tables";
import {
    IconBan,
    IconCircleCheck,
} from '@tabler/icons-react';
import {
    Loader2,
    AlertCircleIcon,
} from "lucide-react";
import { TableWithProducts } from "@/hooks/tables/use-table-by-number";
import { TableDetails } from "./table-details";


interface AllTablesProps {
    tables: Table[];
    loading: boolean;
    error: string;
    fetchTableByNumber: (tableNumber: number) => void;
    selectedTable: TableWithProducts | null;
    tableLoading: boolean;
    tableError: string;
    refetch: () => void
}

export default function AllTables({
    tables,
    loading,
    error,
    fetchTableByNumber,
    selectedTable,
    tableLoading,
    tableError,
    refetch
}: AllTablesProps) {

    const [isSheetOpen, setIsSheetOpen] = useState(false);


    if (loading) return <p>Cargando mesas...</p>;
    if (error) return <p>{error}</p>;

    const handleTableClick = (tableNumber: number) => {
        fetchTableByNumber(tableNumber);
        setIsSheetOpen(true);
    };

    const renderTables = (tablesToRender: Table[]) =>
        tablesToRender.map((table) => (
            <Card
                key={table._id}
                className="@container/card cursor-pointer hover:ring-2 hover:ring-primary transition"
                onClick={() => handleTableClick(table.number)}
            >
                {tableLoading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                )}
                {tableError && (
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Ha ocurrido un error.</AlertTitle>
                        <AlertDescription>
                            <p>{tableError}</p>
                        </AlertDescription>
                    </Alert>

                )}
                <CardHeader>
                    <CardTitle>Mesa {table.number}</CardTitle>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                    {table.isOccupied ? (
                        <Badge variant="destructive">
                            <IconBan stroke={3} />
                            Ocupada
                        </Badge>
                    ) : (
                        <Badge className="bg-green-500">
                            <IconCircleCheck stroke={3} />
                            Libre
                        </Badge>
                    )}
                </CardFooter>
            </Card>
        ));

    return (
        <div className="">
            <Tabs defaultValue="interior" className="px-2 md:px-8">
                <TabsList className="mb-4 flex justify-center w-full">
                    <TabsTrigger
                        value="interior"
                        className="text-base px-6 py-3 cursor-pointer"
                    >
                        Interior
                    </TabsTrigger>
                    <TabsTrigger
                        value="terraza"
                        className="text-base px-6 py-3 cursor-pointer"
                    >
                        Terraza
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="interior">
                    <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                        {renderTables(tables.filter((t) => t.location === "interior"))}
                    </div>
                </TabsContent>
                <TabsContent value="terraza">
                    <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                        {renderTables(tables.filter((t) => t.location === "terraza"))}
                    </div>
                </TabsContent>
            </Tabs>
            <TableDetails
                open={isSheetOpen && !!selectedTable}
                onClose={() => setIsSheetOpen(false)}
                table={selectedTable}
                refetch={refetch}
            />
        </div>
    );
}

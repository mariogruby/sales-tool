"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table } from "@/hooks/use-tables";
import { TableWithProducts } from "@/hooks/use-table-by-number";

interface AllTablesProps {
    tables: Table[];
    loading: boolean;
    error: string;
    fetchTableByNumber: (tableNumber: number) => void;
    selectedTable: TableWithProducts | null;
    tableLoading: boolean;
    tableError: string;
}

export default function AllTables({
    tables,
    loading,
    error,
    fetchTableByNumber,
    selectedTable,
    tableLoading,
    tableError,
}: AllTablesProps) {

    if (loading) return <p>Cargando mesas...</p>;
    if (error) return <p>{error}</p>;

    const handleTableClick = (tableNumber: number) => {
        fetchTableByNumber(tableNumber);
    };

    const renderTables = (tablesToRender: Table[]) =>
        tablesToRender.map((table) => (
            <Card
                key={table._id}
                className="@container/card cursor-pointer hover:ring-2 hover:ring-primary transition"
                onClick={() => handleTableClick(table.number)}
            >
                <CardHeader>
                    <CardTitle>Mesa {table.number}</CardTitle>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                    {table.isOccupied ? "Ocupada" : "Libre"}
                </CardFooter>
            </Card>
        ));

    return (
        <div className="w-full">
            <Tabs defaultValue="interior" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="interior">Interior</TabsTrigger>
                    <TabsTrigger value="terraza">Terraza</TabsTrigger>
                </TabsList>

                <TabsContent value="interior">
                    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                        {renderTables(tables.filter((t) => t.location === "interior"))}
                    </div>
                </TabsContent>

                <TabsContent value="terraza">
                    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                        {renderTables(tables.filter((t) => t.location === "terraza"))}
                    </div>
                </TabsContent>
            </Tabs>

            {tableLoading && <p className="mt-4 text-sm text-muted-foreground">Cargando datos de la mesa...</p>}
            {tableError && <p className="mt-2 text-sm text-destructive">{tableError}</p>}
            {selectedTable && (
                <pre className="mt-4 bg-muted p-4 rounded text-sm overflow-auto max-w-full">
                    {JSON.stringify(selectedTable, null, 2)}
                </pre>
            )}
        </div>
    );
}

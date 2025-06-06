"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table } from "@/hooks/use-tables";

interface AllTablesProps {
    tables: Table[];
    loading: boolean;
    error: string;
}

export default function AllTables({ tables, loading, error }: AllTablesProps) {

    if (loading) return <p>Cargando mesas...</p>;
    if (error) return <p>{error}</p>;

    // Separar mesas por ubicación
    const interiorTables = tables.filter((t) => t.location === "interior");
    const terrazaTables = tables.filter((t) => t.location === "terraza");

    return (
        <div className="w-full">
            <Tabs defaultValue="interior" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="interior">Interior</TabsTrigger>
                    <TabsTrigger value="terraza">Terraza</TabsTrigger>
                </TabsList>

                <TabsContent value="interior">
                    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                        {interiorTables.map((table) => (
                            <Card
                                key={table._id}
                                className="@container/card cursor-pointer"
                            >
                                <CardHeader>
                                    <CardTitle>Mesa {table.number}</CardTitle>
                                </CardHeader>
                                <CardFooter className="text-sm text-muted-foreground">
                                    {table.isOccupied ? "Ocupada" : "Libre"}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="terraza">
                    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                        {terrazaTables.map((table) => (
                            <Card
                                key={table._id}
                                className="@container/card cursor-pointer"
                            >
                                <CardHeader>
                                    <CardTitle>Mesa {table.number}</CardTitle>
                                </CardHeader>
                                <CardFooter className="text-sm text-muted-foreground">
                                    {table.isOccupied ? "Ocupada" : "Libre"}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

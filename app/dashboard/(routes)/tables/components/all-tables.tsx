"use client";

import { useState, useMemo } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { IconBan, IconCircleCheck } from "@tabler/icons-react";
import { Loader2, AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TableClient } from "@/types/table-client";
import { TableDetails } from "./table-details";
import { TableDropdown } from "./dropdown";
import { useTablesPage } from "@/hooks/tables/use-tables-page";

export default function AllTables() {
    const { tables, loading, error, refetch, selectedTable, fetchTableByNumber, tableLoading, tableError } =
        useTablesPage();

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [clickedTableNumber, setClickedTableNumber] = useState<number | null>(null);

    const interiorTables = useMemo(() => tables.filter((t) => t.location === "interior"), [tables]);
    const terrazaTables = useMemo(() => tables.filter((t) => t.location === "terraza"), [tables]);

    if (error) return <p>{error}</p>;

    const handleTableClick = (tableNumber: number) => {
        setClickedTableNumber(tableNumber);
        fetchTableByNumber(tableNumber);
        setIsSheetOpen(true);
    };

    const renderTables = (tablesToRender: TableClient[]) =>
        tablesToRender.map((table) => {
            const isClicked = clickedTableNumber === table.number;
            return (
                <Card
                    key={table._id}
                    className="@container/card cursor-pointer hover:ring-2 hover:ring-primary transition relative"
                    onClick={() => handleTableClick(table.number)}
                >
                    {isClicked && tableLoading && (
                        <div className="absolute inset-0 bg-primary-foreground/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                    )}
                    {isClicked && tableError && (
                        <Alert variant="destructive">
                            <AlertCircleIcon />
                            <AlertTitle>Ha ocurrido un error.</AlertTitle>
                            <AlertDescription>{tableError}</AlertDescription>
                        </Alert>
                    )}
                    <CardHeader className="flex justify-between items-start">
                        <CardTitle>Mesa {table.number}</CardTitle>
                        <TableDropdown tableNumber={table.number} />
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
            );
        });

    const renderTabContent = (tablesToRender: TableClient[]) => (
        <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {loading ? (
                <div className="col-span-full text-center text-muted-foreground">Cargando mesas...</div>
            ) : tablesToRender.length > 0 ? (
                renderTables(tablesToRender)
            ) : (
                <div className="col-span-full text-center text-muted-foreground">
                    No hay mesas en esta sección
                </div>
            )}
        </div>
    );

    return (
        <div>
            <Tabs defaultValue="interior" className="px-2 md:px-8">
                <TabsList className="mb-4 flex justify-center w-full">
                    <TabsTrigger value="interior" className="text-base px-6 py-3 cursor-pointer">
                        Interior
                    </TabsTrigger>
                    <TabsTrigger value="terraza" className="text-base px-6 py-3 cursor-pointer">
                        Terraza
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="interior">{renderTabContent(interiorTables)}</TabsContent>
                <TabsContent value="terraza">{renderTabContent(terrazaTables)}</TabsContent>
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

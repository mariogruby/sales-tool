"use client";

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnDef,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SkeletonTable } from "@/app/dashboard/components/sales/recentSales/skeletons";

interface TotalSalesTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    loading?: boolean;
    error?: string;
    page?: number;
    totalPages?: number;
    setPage?: (page: number) => void;
}

export function TotalSalesTable<TData, TValue>({
    columns,
    data,
    loading = false,
    error = "",
    page,
    totalPages,
    setPage,
}: TotalSalesTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) return <SkeletonTable />

    if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

    if (!data.length) {
        return <div className="p-4 text-center text-gray-500">No hay resultados.</div>;
    }


    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                <TableHeader className="bg-gray-100 rounded-2xl ">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {page && totalPages && setPage && totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        Anterior
                    </Button>
                    <span>
                        Página {page} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    );
}

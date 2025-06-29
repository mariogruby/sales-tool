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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
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

    if (!data.length) return <div className="p-4 text-center text-gray-500">No hay resultados.</div>;

    return (
        <div className="space-y-4">
            <div className="rounded-md border overflow-x-auto w-full">
                <Table>
                <TableHeader className="bg-muted">
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
                                    <TableCell key={cell.id} className="text-sm sm:text-base px-2 sm:px-4 py-2">
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
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                className="cursor-pointer"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNumber = i + 1;
                            const isFirst = pageNumber === 1;
                            const isLast = pageNumber === totalPages;
                            const isNearby = Math.abs(pageNumber - page) <= 1;

                            const shouldShow = isFirst || isLast || isNearby;

                            // Agrega elipsis antes del primer bloque
                            if (pageNumber === 2 && page > 3) {
                                return (
                                    <PaginationItem key="ellipsis-start">
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }

                            // Agrega elipsis después del último bloque cercano
                            if (pageNumber === totalPages - 1 && page < totalPages - 2) {
                                return (
                                    <PaginationItem key="ellipsis-end">
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }

                            if (!shouldShow) return null;

                            return (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        isActive={page === pageNumber}
                                        onClick={() => setPage(pageNumber)}
                                        className="cursor-pointer"
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        <PaginationItem>
                            <PaginationNext
                                className="cursor-pointer"
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}

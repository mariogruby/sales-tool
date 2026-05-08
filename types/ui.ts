import { ColumnDef } from "@tanstack/react-table";

export interface DrawerDialogBaseProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export interface DataTableBaseProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    loading?: boolean;
    error?: string;
}

export interface PaginatedDataTableProps<TData, TValue> extends DataTableBaseProps<TData, TValue> {
    page?: number;
    totalPages?: number;
    setPage?: (page: number) => void;
}

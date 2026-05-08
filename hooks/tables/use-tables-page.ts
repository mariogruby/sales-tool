import { useTables } from "@/hooks/tables/use-tables";
import { useTableByNumber } from "@/hooks/tables/use-table-by-number";

export function useTablesPage() {
    const { tables, loading, error, refetch } = useTables();
    const {
        table: selectedTable,
        fetchTableByNumber,
        loading: tableLoading,
        error: tableError,
    } = useTableByNumber();

    return {
        tables,
        loading,
        error,
        refetch,
        selectedTable,
        fetchTableByNumber,
        tableLoading,
        tableError,
    };
}

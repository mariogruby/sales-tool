"use client";

import { useTables } from "@/hooks/tables/use-tables";
import { useTableByNumber } from "@/hooks/tables/use-table-by-number";
import AllTables from "./components/all-tables";

const Page = () => {
    const { tables, loading, error } = useTables();
    const {
        table: selectedTable,
        fetchTableByNumber,
        loading: tableLoading,
        error: tableError,
    } = useTableByNumber();

    return (
        <div>
            <AllTables
                tables={tables}
                loading={loading}
                error={error}
                fetchTableByNumber={fetchTableByNumber}
                selectedTable={selectedTable}
                tableLoading={tableLoading}
                tableError={tableError}
            />
        </div>
    );
};

export default Page;

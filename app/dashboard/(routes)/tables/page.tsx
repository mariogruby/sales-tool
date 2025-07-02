"use client";

import { useTables } from "@/hooks/tables/use-tables";
import { useTableByNumber } from "@/hooks/tables/use-table-by-number";
import AllTables from "./components/all-tables";
import { ProtectedRouteGuard } from "@/app/security/protectedRouteGuard";
import { usePathname } from "next/navigation";

const Page = () => {
    const { tables, loading, error, refetch } = useTables();
    const {
        table: selectedTable,
        fetchTableByNumber,
        loading: tableLoading,
        error: tableError,
    } = useTableByNumber();

    const pathname = usePathname()

    return (
        <ProtectedRouteGuard route={pathname}>
            <div className="container mx-auto">
                <AllTables
                    tables={tables}
                    loading={loading}
                    error={error}
                    fetchTableByNumber={fetchTableByNumber}
                    selectedTable={selectedTable}
                    tableLoading={tableLoading}
                    tableError={tableError}
                    refetch={refetch}
                />
            </div>
        </ProtectedRouteGuard>
    );
};

export default Page;

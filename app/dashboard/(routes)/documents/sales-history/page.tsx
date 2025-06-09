"use client";

import { useTotalSales } from "@/hooks/sales/use-total-sales";
import { TotalSalesTable } from "./components/closing-history";
import { totalSalesColumns } from "./components/columns";

const Page = () => {
    const { sales, page, totalPages, loading, error, setPage } = useTotalSales();

    return (
        <div className="p-4">
            <h2 className="mb-4 text-lg font-semibold">Historial de cierres</h2>
            <TotalSalesTable
                columns={totalSalesColumns}
                data={sales}
                loading={loading}
                error={error}
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            />
        </div>
    );
};

export default Page;

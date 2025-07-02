"use client";

import { useTotalSales } from "@/hooks/sales/use-total-sales";
import { TotalSalesTable } from "./components/closing-history";
import { totalSalesColumns } from "./components/columns";
import { ProtectedRouteGuard } from "@/app/security/protectedRouteGuard";
import { usePathname } from "next/navigation";

const Page = () => {
    const { sales, page, totalPages, loading, error, setPage } = useTotalSales();

    const pathname = usePathname()

    return (
        <ProtectedRouteGuard route={pathname}>
            <div className="p-4 max-w-full overflow-x-auto">
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
        </ProtectedRouteGuard>
    );
};

export default Page;

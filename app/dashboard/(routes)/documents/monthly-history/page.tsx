"use client";

import { ProtectedRouteGuard } from "@/app/security/protectedRouteGuard";
import { usePathname } from "next/navigation";
import { TotalMonthlyTable } from "./components/montly-history";
import { useMonthly } from "@/hooks/sales/use-monthy";
import { monthlyColumns } from "./components/columns";

const Page = () => {
    const {monthly, page, setPage, totalPages, loading, error } = useMonthly();
    const pathname = usePathname()

    return (
        <ProtectedRouteGuard route={pathname}>
            <div className="p-4 max-w-full overflow-x-auto">
                <h2 className="mb-4 text-lg font-semibold">Histórico Mensual</h2>
                <TotalMonthlyTable
                    columns={monthlyColumns}
                    data={monthly}
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

"use client";

import { ProtectedRouteGuard } from "@/app/security/protectedRouteGuard";
import { usePathname } from "next/navigation";
import { MonthlyDetailsSalesTable } from "./components/monthly-details";
import { monthlyDetailsColumns } from "./components/columns";
import { useMonthlyDetails } from "@/hooks/sales/use-monthly-details";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const Page = () => {
    const pathname = usePathname();
    const router = useRouter();
    // Extract the month from the pathname, assuming it's the last segment
    const month = pathname?.split("/").pop() ?? null;
    const { sales, page, setPage, totalPages, loading, error } = useMonthlyDetails(month);

    return (
        <ProtectedRouteGuard route={pathname}>
            <div className=" px-2 flex justify-start">
                <Button
                    onClick={() => router.back()}
                    variant="secondary"
                >
                    <ChevronLeftIcon />
                    Volver
                </Button>
            </div>
            <div className="p-4 max-w-full overflow-x-auto">
                <h2 className="mb-4 text-lg font-semibold">
                    Histórico del mes {' '}
                    <Badge variant="secondary" className="bg-yellow-500">test</Badge>
                </h2>
                <MonthlyDetailsSalesTable
                    columns={monthlyDetailsColumns}
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
